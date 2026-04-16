import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LifeBuoy, Search, Book, PlayCircle, MessageSquare, 
  Ticket, FileText, ChevronRight, HelpCircle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';

export default function HelpAndSupportPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    toast.success(`Searching documentation for: ${searchQuery}`);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    toast.success('Support ticket created successfully. We will respond within 24 hours.');
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6 py-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LifeBuoy className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">How can we help you today?</h1>
          <p className="text-lg text-muted-foreground">Search our knowledge base, watch tutorials, or contact our support team.</p>
          
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              className="w-full pl-12 pr-32 h-14 text-lg rounded-full bg-background border-2 focus-visible:ring-primary" 
              placeholder="Search for articles, guides, or error codes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6">
              Search
            </Button>
          </form>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Book className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold text-lg">Documentation</h3>
              <p className="text-sm text-muted-foreground">Detailed guides on every feature of the Smart Crop Advisor platform.</p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlayCircle className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-lg">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground">Step-by-step visual guides to help you master precision farming tools.</p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Community Forum</h3>
              <p className="text-sm text-muted-foreground">Connect with other farmers, share tips, and get community support.</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="faq" className="w-full mt-12">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 max-w-2xl mx-auto mb-8 h-auto">
            <TabsTrigger value="faq" className="py-3"><HelpCircle className="w-4 h-4 mr-2" /> FAQs</TabsTrigger>
            <TabsTrigger value="ticket" className="py-3"><Ticket className="w-4 h-4 mr-2" /> Submit Ticket</TabsTrigger>
            <TabsTrigger value="guides" className="py-3"><FileText className="w-4 h-4 mr-2" /> User Guides</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Quick answers to common issues.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I connect my IoT soil sensors?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      Navigate to the IoT Dashboard, click "Add Device", and enter the MAC address found on the bottom of your sensor. Ensure the sensor is powered on and within range of your LoRaWAN gateway.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>What drone models are supported for field mapping?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      We currently support DJI Agras series, senseFly, and custom Pixhawk-based drones. You can connect them via the Drone Monitoring System using your manufacturer API credentials.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>How accurate is the AI Disease Detector?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      Our computer vision models are trained on over 2 million annotated images and achieve a 94.5% accuracy rate across 40+ common crop diseases. However, it should be used as a decision support tool alongside professional agronomic advice.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Can I export my data for subsidy applications?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      Yes. Go to Data Management &gt; Export, select the date range, and choose the "Government Subsidy Format (PDF)" option. This will generate a compliant report with all necessary field and yield data.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ticket" className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Create Support Ticket</CardTitle>
                <CardDescription>Our technical team will investigate your issue.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required>
                        <option value="">Select category...</option>
                        <option value="hardware">Hardware / Sensors</option>
                        <option value="software">Software Bug</option>
                        <option value="billing">Billing / Subscription</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Priority</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High (System Down)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="Brief description of the issue" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea 
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                      placeholder="Please provide as much detail as possible..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Attachments (Optional)</label>
                    <Input type="file" multiple className="cursor-pointer" />
                  </div>
                  <Button type="submit" className="w-full">Submit Ticket</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides">
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p>Downloadable PDF manuals and interactive guides will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}