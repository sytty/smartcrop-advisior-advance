import React, { useRef } from 'react';
import { UploadCloud, FileText, X, CheckCircle2 } from 'lucide-react';
import GlassCard from './GlassCard.jsx';

const DocumentUploadZone = ({ label, type, onUpload, file, onRemove }) => {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    validateAndUpload(droppedFile);
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files?.[0];
    validateAndUpload(selectedFile);
  };

  const validateAndUpload = (selectedFile) => {
    if (!selectedFile) return;
    
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(selectedFile.type)) {
      alert('Invalid file type. Only PDF, JPG, PNG allowed.');
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    onUpload(type, selectedFile);
  };

  return (
    <GlassCard className="p-4">
      <p className="text-sm font-medium text-white mb-3">{label}</p>
      
      {!file ? (
        <div 
          className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-[#00d4ff]/50 transition-colors cursor-pointer bg-white/5"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleChange} 
            accept=".pdf,.jpg,.jpeg,.png" 
            className="hidden" 
          />
          <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-white font-medium mb-1">Click or drag file</p>
          <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#1a4d2e]/20 border border-[#1a4d2e]/40">
          <div className="flex items-center overflow-hidden">
            <FileText className="w-8 h-8 text-[#22c55e] mr-3 flex-shrink-0" />
            <div className="truncate">
              <p className="text-sm font-medium text-white truncate">{file.name}</p>
              <p className="text-xs text-gray-400 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1 text-[#22c55e]" />
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button 
            onClick={() => onRemove(type)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </GlassCard>
  );
};

export default DocumentUploadZone;