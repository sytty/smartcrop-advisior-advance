import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Link as LinkIcon, QrCode, FileText, History, Share2, Download, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

export default function BlockchainCropCertification() {
  const { currentUser } = useAuth();
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const records = await pb.collection('certifications').getFullList({
          filter: `farmer_id="${currentUser.id}"`,
          sort: '-created',
          $autoCancel: false
        });
        setCertifications(records);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchCerts();
  }, [currentUser]);

  const handleRequest = (e) => {
    e.preventDefault();
    toast.success('Certification request submitted to the blockchain network.');
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary" /> Blockchain Certification
            </h1>
            <p className="text-muted-foreground mt-2">Immutable, verifiable crop provenance and organic certification.</p>
          </div>
          <Button><FileText className="w-4 h-4 mr-2" /> New Request</Button>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active Certificates</TabsTrigger>
            <TabsTrigger value="request">Request Certification</TabsTrigger>
            <TabsTrigger value="verify">Verify Authenticity</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading blockchain records...</div>
            ) : certifications.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {certifications.map(cert => (
                  <Card key={cert.id} className="overflow-hidden border-primary/20">
                    <div className="bg-primary/10 px-6 py-3 border-b border-primary/10 flex justify-between items-center">
                      <span className="font-semibold text-primary">{cert.certification_type}</span>
                      <Badge variant={cert.status === 'approved' ? 'default' : 'secondary'}>{cert.status}</Badge>
                    </div>
                    <CardContent className="p-6 grid grid-cols-3 gap-6">
                      <div className="col-span-2 space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Crop</p>
                          <p className="font-medium">{cert.crop_type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Blockchain Hash</p>
                          <p className="font-mono text-xs text-primary truncate">{cert.blockchain_hash || 'Pending...'}</p>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-2" /> PDF</Button>
                          <Button size="sm" variant="outline"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center bg-white p-2 rounded-lg">
                        <QRCodeSVG value={`https://verify.smartcrop.app/cert/${cert.certificate_id}`} size={100} />
                        <span className="text-[10px] text-muted-foreground mt-2 text-center">Scan to verify</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <ShieldCheck className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Active Certificates</h3>
                  <p className="text-muted-foreground max-w-md">You haven't acquired any blockchain-verified certificates yet. Request one to prove your crop's provenance.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="request">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Request New Certification</CardTitle>
                <CardDescription>Submit your farm data for decentralized verification.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Certification Type</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option>Organic Certified (USDA)</option>
                      <option>Fair Trade</option>
                      <option>Carbon Neutral</option>
                      <option>Non-GMO Project Verified</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Crop</Label>
                    <Input placeholder="e.g., Arabica Coffee" />
                  </div>
                  <div className="space-y-2">
                    <Label>Supporting Documents (Lab results, soil tests)</Label>
                    <Input type="file" multiple />
                  </div>
                  <div className="bg-muted p-4 rounded-lg mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Verification Fee (Smart Contract)</span>
                      <span className="font-mono">0.05 ETH</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span>Total</span>
                      <span className="font-mono">~$120.00 USD</span>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Submit to Oracle Network</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verify">
            <Card className="max-w-2xl mx-auto text-center py-12">
              <CardContent className="space-y-6">
                <QrCode className="w-16 h-16 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-semibold">Verify a Certificate</h3>
                <p className="text-muted-foreground">Enter a certificate ID or scan a QR code to verify its authenticity on the blockchain.</p>
                <div className="flex gap-2 max-w-md mx-auto">
                  <Input placeholder="Enter Certificate ID (e.g., CERT-8X9A...)" />
                  <Button>Verify</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}