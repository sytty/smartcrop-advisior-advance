import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LifeBuoy, Search, Book, PlayCircle, MessageSquare, 
  Ticket, FileText, ChevronRight, HelpCircle, Clock3, ShieldCheck, Rocket
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function HelpAndSupportPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    toast.success(t('help.searching', { query: searchQuery, defaultValue: `Searching documentation for: ${searchQuery}` }));
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    toast.success(t('help.ticketCreated', { defaultValue: 'Support ticket created successfully. We will respond within 24 hours.' }));
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <section className="feature-shell p-6 md:p-8">
          <div className="text-center max-w-3xl mx-auto space-y-6 py-2 relative z-10">
            <span className="feature-kicker">{t('help.kicker', { defaultValue: 'Help Center' })}</span>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <LifeBuoy className="w-8 h-8 text-primary" />
          </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t('help.title', { defaultValue: 'How can we help you today?' })}</h1>
            <p className="text-lg text-muted-foreground">{t('help.subtitle', { defaultValue: 'Search guides, resolve issues fast, and reach the farm support team through one unified workspace.' })}</p>
          
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              className="w-full pl-12 pr-36 h-14 text-base sm:text-lg rounded-full bg-background/90 border-2 focus-visible:ring-primary" 
              placeholder={t('help.searchPlaceholder', { defaultValue: 'Search for articles, guides, or error codes...' })} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-11 px-6 text-base sm:text-sm">
              {t('help.searchButton', { defaultValue: 'Search' })}
            </Button>
          </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="insight-flag">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{t('help.firstResponse', { defaultValue: 'First Response' })}</p>
                <p className="font-semibold mt-1 flex items-center justify-center gap-2"><Clock3 className="w-4 h-4 text-primary" /> {t('help.responseValue', { defaultValue: 'Under 2 hours' })}</p>
              </div>
              <div className="insight-flag good">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{t('help.resolutionSuccess', { defaultValue: 'Resolution Success' })}</p>
                <p className="font-semibold mt-1 flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> {t('help.resolutionValue', { defaultValue: '96.4%' })}</p>
              </div>
              <div className="insight-flag warning">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{t('help.priorityQueue', { defaultValue: 'Priority Queue' })}</p>
                <p className="font-semibold mt-1 flex items-center justify-center gap-2"><Rocket className="w-4 h-4 text-accent" /> {t('help.priorityValue', { defaultValue: 'Field down incidents' })}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card rounded-3xl border-border/70 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Book className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold text-lg">{t('help.documentation', { defaultValue: 'Documentation' })}</h3>
              <p className="text-sm text-muted-foreground">{t('help.documentationDesc', { defaultValue: 'Detailed guides on every feature of the Smart Crop Advisor platform.' })}</p>
            </CardContent>
          </Card>
          <Card className="glass-card rounded-3xl border-border/70 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlayCircle className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-lg">{t('help.videoTutorials', { defaultValue: 'Video Tutorials' })}</h3>
              <p className="text-sm text-muted-foreground">{t('help.videoTutorialsDesc', { defaultValue: 'Step-by-step visual guides to help you master precision farming tools.' })}</p>
            </CardContent>
          </Card>
          <Card className="glass-card rounded-3xl border-border/70 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg">{t('help.communityForum', { defaultValue: 'Community Forum' })}</h3>
              <p className="text-sm text-muted-foreground">{t('help.communityForumDesc', { defaultValue: 'Connect with other farmers, share tips, and get community support.' })}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="faq" className="w-full mt-12">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 max-w-2xl mx-auto mb-8 h-auto bg-card/80 border border-border/70 p-1 rounded-xl">
            <TabsTrigger value="faq" className="min-h-[44px] py-3"><HelpCircle className="w-4 h-4 mr-2" /> {t('help.faqTab', { defaultValue: 'FAQs' })}</TabsTrigger>
            <TabsTrigger value="ticket" className="min-h-[44px] py-3"><Ticket className="w-4 h-4 mr-2" /> {t('help.ticketTab', { defaultValue: 'Submit Ticket' })}</TabsTrigger>
            <TabsTrigger value="guides" className="min-h-[44px] py-3"><FileText className="w-4 h-4 mr-2" /> {t('help.guidesTab', { defaultValue: 'User Guides' })}</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="max-w-3xl mx-auto">
            <Card className="glass-card rounded-3xl border-border/70">
              <CardHeader>
                <CardTitle>{t('help.faqTitle', { defaultValue: 'Frequently Asked Questions' })}</CardTitle>
                <CardDescription>{t('help.faqDescription', { defaultValue: 'Quick answers to common issues.' })}</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>{t('help.faq.sensor.title', { defaultValue: 'How do I connect my IoT soil sensors?' })}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {t('help.faq.sensor.answer', { defaultValue: 'Navigate to the IoT Dashboard, click "Add Device", and enter the MAC address found on the bottom of your sensor. Ensure the sensor is powered on and within range of your LoRaWAN gateway.' })}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>{t('help.faq.drones.title', { defaultValue: 'What drone models are supported for field mapping?' })}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {t('help.faq.drones.answer', { defaultValue: 'We currently support DJI Agras series, senseFly, and custom Pixhawk-based drones. You can connect them via the Drone Monitoring System using your manufacturer API credentials.' })}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>{t('help.faq.disease.title', { defaultValue: 'How accurate is the AI Disease Detector?' })}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {t('help.faq.disease.answer', { defaultValue: 'Our computer vision models are trained on over 2 million annotated images and achieve a 94.5% accuracy rate across 40+ common crop diseases. However, it should be used as a decision support tool alongside professional agronomic advice.' })}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>{t('help.faq.export.title', { defaultValue: 'Can I export my data for subsidy applications?' })}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {t('help.faq.export.answer', { defaultValue: 'Yes. Go to Data Management &gt; Export, select the date range, and choose the "Government Subsidy Format (PDF)" option. This will generate a compliant report with all necessary field and yield data.' })}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ticket" className="max-w-2xl mx-auto">
            <Card className="glass-card rounded-3xl border-border/70">
              <CardHeader>
                <CardTitle>{t('help.ticketTitle', { defaultValue: 'Create Support Ticket' })}</CardTitle>
                <CardDescription>{t('help.ticketDescription', { defaultValue: 'Our technical team will investigate your issue.' })}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('help.ticketCategory', { defaultValue: 'Category' })}</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required>
                        <option value="">{t('help.ticketCategoryPlaceholder', { defaultValue: 'Select category...' })}</option>
                        <option value="hardware">{t('help.ticketCategoryHardware', { defaultValue: 'Hardware / Sensors' })}</option>
                        <option value="software">{t('help.ticketCategorySoftware', { defaultValue: 'Software Bug' })}</option>
                        <option value="billing">{t('help.ticketCategoryBilling', { defaultValue: 'Billing / Subscription' })}</option>
                        <option value="other">{t('help.ticketCategoryOther', { defaultValue: 'Other' })}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('help.ticketPriority', { defaultValue: 'Priority' })}</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required>
                        <option value="low">{t('help.ticketPriorityLow', { defaultValue: 'Low' })}</option>
                        <option value="medium">{t('help.ticketPriorityMedium', { defaultValue: 'Medium' })}</option>
                        <option value="high">{t('help.ticketPriorityHigh', { defaultValue: 'High (System Down)' })}</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('help.ticketSubject', { defaultValue: 'Subject' })}</label>
                    <Input placeholder={t('help.ticketSubjectPlaceholder', { defaultValue: 'Brief description of the issue' })} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('help.ticketDescriptionLabel', { defaultValue: 'Description' })}</label>
                    <textarea 
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                      placeholder={t('help.ticketDescriptionPlaceholder', { defaultValue: 'Please provide as much detail as possible...' })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('help.ticketAttachments', { defaultValue: 'Attachments (Optional)' })}</label>
                    <Input type="file" multiple className="cursor-pointer" />
                  </div>
                  <Button type="submit" className="w-full h-11 text-base sm:text-sm">{t('help.ticketSubmit', { defaultValue: 'Submit Ticket' })}</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides">
            <Card className="glass-card rounded-3xl border-border/70">
              <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p>{t('help.guidesPlaceholder', { defaultValue: 'Downloadable PDF manuals and interactive guides will appear here.' })}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}