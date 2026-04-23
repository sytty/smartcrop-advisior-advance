import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Server, Smartphone, ArrowRight } from 'lucide-react';

const ConflictResolutionModal = ({ isOpen, onClose, conflicts, onResolve }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!conflicts || conflicts.length === 0) return null;

  const currentConflict = conflicts[currentIndex];

  const handleResolve = (strategy) => {
    onResolve(currentConflict.id, strategy);
    if (currentIndex < conflicts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
      setCurrentIndex(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[hsl(var(--brand-night))] border-white/10 text-white glass-card">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
            Sync Conflict Detected
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Conflict {currentIndex + 1} of {conflicts.length}. Please choose which version to keep.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-sm text-gray-300"><span className="font-medium text-white">Entity:</span> {currentConflict.entity_type} ({currentConflict.entity_id})</p>
            <p className="text-sm text-gray-300"><span className="font-medium text-white">Reason:</span> {currentConflict.conflict_reason}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Local Version */}
            <div className="p-4 rounded-xl border border-[hsl(var(--edge-sync-progress))]/30 bg-[hsl(var(--edge-sync-progress))]/5 relative overflow-hidden">
              <div className="flex items-center mb-3 text-[hsl(var(--edge-sync-progress))]">
                <Smartphone className="w-4 h-4 mr-2" />
                <span className="font-semibold">Local Version (Device)</span>
              </div>
              <pre className="text-xs text-gray-300 bg-black/40 p-3 rounded-lg overflow-x-auto">
                {JSON.stringify(currentConflict.local_data, null, 2)}
              </pre>
              <Button 
                onClick={() => handleResolve('local_wins')}
                className="w-full mt-4 bg-[hsl(var(--edge-sync-progress))]/20 text-[hsl(var(--edge-sync-progress))] hover:bg-[hsl(var(--edge-sync-progress))]/30 border-0"
              >
                Keep Local Version
              </Button>
            </div>

            {/* Server Version */}
            <div className="p-4 rounded-xl border border-[hsl(var(--edge-online))]/30 bg-[hsl(var(--edge-online))]/5 relative overflow-hidden">
              <div className="flex items-center mb-3 text-[hsl(var(--edge-online))]">
                <Server className="w-4 h-4 mr-2" />
                <span className="font-semibold">Server Version (Cloud)</span>
              </div>
              <pre className="text-xs text-gray-300 bg-black/40 p-3 rounded-lg overflow-x-auto">
                {JSON.stringify(currentConflict.server_data, null, 2)}
              </pre>
              <Button 
                onClick={() => handleResolve('server_wins')}
                className="w-full mt-4 bg-[hsl(var(--edge-online))]/20 text-[hsl(var(--edge-online))] hover:bg-[hsl(var(--edge-online))]/30 border-0"
              >
                Keep Server Version
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
            Resolve Later
          </Button>
          <Button onClick={() => handleResolve('merge')} className="bg-white/10 text-white hover:bg-white/20 border-0">
            Merge Data <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConflictResolutionModal;