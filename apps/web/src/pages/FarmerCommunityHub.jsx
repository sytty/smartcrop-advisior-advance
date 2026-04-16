import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, MessageSquare, ThumbsUp, BookOpen, PlayCircle } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { Button } from '@/components/ui/button';
import { useTutorial } from '@/hooks/useTutorial.jsx';
import SmartSuggestions from '@/components/SmartSuggestions.jsx';
import SmartAlerts from '@/components/SmartAlerts.jsx';
import Gamification from '@/components/Gamification.jsx';
import ExportShare from '@/components/ExportShare.jsx';

const FarmerCommunityHub = () => {
  const { startTutorial } = useTutorial();

  useEffect(() => {
    if (!localStorage.getItem('tutorial_completed_community')) startTutorial('community');
  }, [startTutorial]);

  const alerts = [];
  const suggestions = [{ id: 1, text: 'Join the "Drought Resistant Farming" group. 45 farmers in your area are sharing tips there.', impact: 'Learn local best practices' }];

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet><title>Farmer Community - Smart Crop Advisor</title></Helmet>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <Users className="w-10 h-10 mr-3 text-[#00d4ff]" /> Farmer Community
            </h1>
            <p className="text-xl text-gray-400">Talk to other farmers, ask questions, and share tips.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => startTutorial('community')} className="bg-white/5 border-white/10 text-white"><PlayCircle className="w-4 h-4 mr-2" /> Tutorial</Button>
            <Button className="bg-[#00d4ff] text-black font-bold">Ask a Question</Button>
          </div>
        </div>

        <Gamification />
        <SmartAlerts alerts={alerts} />
        <SmartSuggestions suggestions={suggestions} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[
              { name: 'John D.', time: '2 hours ago', text: 'Has anyone tried the new drought-resistant corn seeds? Did they actually survive the dry spell last month?', likes: 12, comments: 4 },
              { name: 'Sarah M.', time: '5 hours ago', text: 'Just sold my first batch of carbon credits! The process was super easy through the app. Highly recommend looking into it if you do no-till farming.', likes: 45, comments: 18 }
            ].map((post, i) => (
              <GlassCard key={i} className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#b300ff] flex items-center justify-center text-white font-bold text-2xl">
                    {post.name[0]}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{post.name}</h3>
                    <p className="text-gray-500 text-lg">{post.time}</p>
                  </div>
                </div>
                <p className="text-2xl text-gray-300 mb-8 leading-relaxed">{post.text}</p>
                <div className="flex gap-8 border-t border-white/10 pt-6">
                  <button className="flex items-center text-gray-400 hover:text-[#00d4ff] text-xl font-medium transition-colors">
                    <ThumbsUp className="w-6 h-6 mr-2" /> {post.likes} Likes
                  </button>
                  <button className="flex items-center text-gray-400 hover:text-[#00d4ff] text-xl font-medium transition-colors">
                    <MessageSquare className="w-6 h-6 mr-2" /> {post.comments} Comments
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="space-y-6">
            <GlassCard className="p-8 bg-gradient-to-br from-[#b300ff]/10 to-transparent border-[#b300ff]/30">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#b300ff]" /> Expert Guides
              </h2>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="block p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-2">Beginner's Guide to Drip Irrigation</h3>
                    <p className="text-gray-400">Read time: 5 mins</p>
                  </a>
                </li>
                <li>
                  <a href="#" className="block p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-2">How to spot early signs of blight</h3>
                    <p className="text-gray-400">Read time: 3 mins</p>
                  </a>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerCommunityHub;