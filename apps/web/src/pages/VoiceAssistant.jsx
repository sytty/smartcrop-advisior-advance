import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, MessageSquare, Clock, Loader2, Sparkles, Languages } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { generateVoiceResponses } from '@/lib/mockData.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import GlassCard from '@/components/GlassCard.jsx';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en-US', name: 'English' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'mr-IN', name: 'Marathi' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'pt-BR', name: 'Portuguese' },
  { code: 'sw-KE', name: 'Swahili' }
];

const sampleQueries = [
  'What should I plant today?',
  'Is my soil ready for planting?',
  "What's the pest risk in my area?",
  'How much fertilizer do I need?',
  'When should I harvest?'
];

const VoiceAssistantContent = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [history, setHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const processQueryRef = useRef(() => {});

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchHistory();

        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'en-US';

          recognitionRef.current.onresult = (event) => {
            let currentTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i += 1) {
              currentTranscript += event.results[i][0].transcript;
            }
            setTranscript(currentTranscript.trim());
          };

          recognitionRef.current.onerror = (event) => {
            setIsListening(false);
            if (event.error !== 'no-speech') {
              toast.error(`Microphone error: ${event.error}`);
            }
          };

          recognitionRef.current.onend = () => {
            setIsListening(false);
            const finalText = transcriptRef.current;
            if (finalText) {
              processQueryRef.current(finalText);
            }
          };
        } else {
          throw new Error('Speech recognition is not supported in this browser.');
        }

        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  }, [language]);

  const fetchHistory = async () => {
    try {
      const records = await pb.collection('voice_conversations').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setHistory(records);
    } catch (fetchError) {
      setHistory([]);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    setTranscript('');
    transcriptRef.current = '';

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (startError) {
      toast.error('Failed to start microphone. Check permissions.');
    }
  };

  const speakResponse = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  const handleProcessQuery = useCallback(async (queryText) => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      const responseText = generateVoiceResponses(queryText);
      const langName = languages.find((l) => l.code === language)?.name || 'English';

      try {
        const record = await pb.collection('voice_conversations').create({
          userId: currentUser.id,
          query: queryText,
          response: responseText,
          language: langName
        }, { $autoCancel: false });

        setHistory((prev) => [record, ...prev]);
      } catch (dbErr) {
        setHistory((prev) => [{
          id: String(Date.now()),
          query: queryText,
          response: responseText,
          language: langName,
          created: new Date().toISOString()
        }, ...prev]);
      }

      speakResponse(responseText);
      setTranscript('');
      transcriptRef.current = '';
    } catch (processError) {
      toast.error('Failed to process query');
    } finally {
      setIsProcessing(false);
    }
  }, [language, currentUser?.id, speakResponse]);

  useEffect(() => {
    processQueryRef.current = handleProcessQuery;
  }, [handleProcessQuery]);

  const handleSampleClick = (query) => {
    setTranscript(query);
    transcriptRef.current = query;
    handleProcessQuery(query);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="glass-card rounded-[2rem] p-8 md:p-10 text-center max-w-md w-full">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
          <div className="h-4 w-44 loading-shimmer rounded-full mx-auto mb-3" />
          <div className="h-3 w-64 loading-shimmer rounded-full mx-auto" />
          <p className="text-muted-foreground mt-4">{t('intelligence.voice_assistant.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) throw new Error(error);

  return (
    <div className="max-w-5xl mx-auto relative z-10">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[2rem] p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
              <Sparkles className="w-3 h-3 mr-1" /> Conversational farm intelligence
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center">
              <MessageSquare className="w-8 h-8 mr-3 text-primary" />
              {t('intelligence.voice_assistant.title')}
            </h1>
            <p className="text-muted-foreground max-w-2xl">{t('intelligence.voice_assistant.subtitle')}</p>
          </div>

          <div className="w-full md:w-[190px]">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full rounded-xl border-primary/30 bg-card/70">
                <Languages className="w-4 h-4 mr-2" />
                <SelectValue placeholder={t('intelligence.voice_assistant.language')} />
              </SelectTrigger>
              <SelectContent className="glass-card border-border/70">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card p-8 rounded-3xl border border-border/70 text-center relative overflow-hidden">
            <div className="mb-8 flex justify-center">
              <button
                onClick={toggleListening}
                className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isListening
                    ? 'bg-primary/20 text-primary shadow-[0_0_40px_hsla(var(--primary)/0.35)]'
                    : 'bg-card/70 text-muted-foreground hover:bg-card hover:text-foreground'
                }`}
              >
                {isListening && (
                  <>
                    <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-75"></span>
                    <span className="absolute inset-[-18px] rounded-full border border-primary/40 animate-ping opacity-50" style={{ animationDelay: '0.2s' }}></span>
                  </>
                )}
                {isListening ? <Mic className="w-12 h-12" /> : <MicOff className="w-12 h-12" />}
              </button>
            </div>

            <div className="min-h-[84px] flex items-center justify-center rounded-2xl border border-border/70 bg-card/60 px-5">
              {isProcessing ? (
                <div className="flex items-center text-primary font-medium">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  {t('intelligence.voice_assistant.processing')}
                </div>
              ) : transcript ? (
                <p className="text-lg text-foreground font-medium">"{transcript}"</p>
              ) : (
                <p className="text-muted-foreground">
                  {isListening ? t('intelligence.voice_assistant.listening') : t('intelligence.voice_assistant.tapToSpeak')}
                </p>
              )}
            </div>
          </motion.div>

          {history.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="glass-card p-6 rounded-3xl border border-border/70">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                {t('intelligence.voice_assistant.recentConversation')}
              </h3>
              <div className="space-y-4">
                {history.slice(0, 1).map((item) => (
                  <div key={item.id} className="space-y-3">
                    <div className="bg-card/70 rounded-xl p-4 border border-border/70 ml-4 md:ml-8">
                      <p className="text-sm text-muted-foreground mb-1">{t('intelligence.voice_assistant.youAsked')}</p>
                      <p className="text-foreground">"{item.query}"</p>
                    </div>
                    <div className="bg-primary/10 rounded-xl p-4 border border-primary/25 mr-4 md:mr-8 relative group">
                      <button
                        onClick={() => speakResponse(item.response)}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-card/70 text-muted-foreground hover:text-foreground hover:bg-card transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Replay audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <p className="text-sm text-primary mb-1">{t('intelligence.voice_assistant.assistantReplied')}</p>
                      <p className="text-foreground leading-relaxed pr-12">{item.response}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-3xl border border-border/70">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('intelligence.voice_assistant.tryAsking')}</h3>
            <div className="flex flex-col gap-2">
              {sampleQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSampleClick(query)}
                  disabled={isListening || isProcessing}
                  className="text-left px-4 py-3 rounded-xl bg-card/60 border border-border/70 text-sm text-muted-foreground hover:bg-primary/5 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  "{query}"
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }} className="glass-card p-6 rounded-3xl border border-border/70">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('intelligence.voice_assistant.history')}</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {history.slice(1).map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-card/60 border border-border/70">
                  <p className="text-sm text-foreground font-medium truncate">"{item.query}"</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.created).toLocaleDateString()} • {item.language}
                  </p>
                </div>
              ))}
              {history.length <= 1 && (
                <div className="rounded-2xl border border-dashed border-border/70 bg-card/60 px-4 py-6 text-center">
                  <MessageSquare className="w-8 h-8 text-primary/60 mx-auto mb-2" />
                  <p className="text-sm text-foreground font-semibold mb-1">{t('intelligence.voice_assistant.noHistory')}</p>
                  <p className="text-xs text-muted-foreground">Your conversations will appear here once you start asking questions.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const VoiceAssistant = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet>
        <title>{t('intelligence.voice_assistant.title')} - Smart Crop Advisor</title>
      </Helmet>
      <ErrorBoundary componentName="VoiceAssistant">
        <VoiceAssistantContent />
      </ErrorBoundary>
    </div>
  );
};

export default VoiceAssistant;
