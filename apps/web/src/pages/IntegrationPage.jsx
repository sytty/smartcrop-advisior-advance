import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Blocks, CloudSun, Satellite, Cpu, Link as LinkIcon, 
  Mail, MessageSquare, CreditCard, Webhook, Settings, CheckCircle2, XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function IntegrationPage() {
  const [integrations, setIntegrations] = useState([
    { id: 'weather', name: 'OpenWeather API', category: 'Data Source', icon: CloudSun, active: true, status: 'Connected' },
    { id: 'satellite', name: 'Sentinel Hub', category: 'Data Source', icon: Satellite, active: true, status: 'Connected' },
    { id: 'iot', name: 'AWS IoT Core', category: 'Hardware', icon: Cpu, active: false, status: 'Disconnected' },
    { id: 'blockchain', name: 'Ethereum Network', category: 'Security', icon: LinkIcon, active: true, status: 'Connected' },
    { id: 'email', name: 'SendGrid', category: 'Communication', icon: Mail, active: true, status: 'Connected' },
    { id: 'sms', name: 'Twilio', category: 'Communication', icon: MessageSquare, active: false, status: 'Requires Config' },
    { id: 'payment', name: 'Stripe', category: 'Finance', icon: CreditCard, active: false, status: 'Disconnected' },
    { id: 'webhooks', name: 'Custom Webhooks', category: 'Developer', icon: Webhook, active: true, status: '2 Active' },
  ]);

  const handleToggle = (id) => {
    setIntegrations(integrations.map(int => {
      if (int.id === id) {
        const newActive = !int.active;
        toast.success(`${int.name} ${newActive ? 'enabled' : 'disabled'}`);
        return { ...int, active: newActive, status: newActive ? 'Connected' : 'Disconnected' };
      }
      return int;
    }));
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Blocks className="w-8 h-8 text-primary" /> Integrations & APIs
          </h1>
          <p className="text-muted-foreground mt-2">Manage third-party services, hardware connections, and API keys.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <Card key={integration.id} className={`transition-all duration-200 ${integration.active ? 'border-primary/30 shadow-sm' : 'opacity-80'}`}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${integration.active ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <Switch 
                      checked={integration.active} 
                      onCheckedChange={() => handleToggle(integration.id)} 
                    />
                  </div>
                  <CardTitle className="mt-4 text-xl">{integration.name}</CardTitle>
                  <CardDescription>{integration.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    {integration.active ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={integration.active ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}>
                      {integration.status}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/50">
                  <Button variant="ghost" className="w-full justify-between text-muted-foreground hover:text-foreground">
                    Configure <Settings className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <Card className="mt-12 border-dashed border-2 bg-transparent">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Blocks className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Need a custom integration?</h3>
            <p className="text-muted-foreground max-w-md mb-6">Generate API keys to connect your own proprietary hardware or software to the Smart Crop Advisor platform.</p>
            <Button>Generate API Key</Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}