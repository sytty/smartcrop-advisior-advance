import React from 'react';
import { Clock, FileSearch, CheckCircle, XCircle, DollarSign } from 'lucide-react';

const ApplicationStatusBadge = ({ status }) => {
  const config = {
    submitted: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Clock, label: 'Submitted' },
    under_review: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: FileSearch, label: 'Under Review' },
    approved: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle, label: 'Approved' },
    rejected: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle, label: 'Rejected' },
    paid: { color: 'text-[#00d4ff]', bg: 'bg-[#00d4ff]/10', border: 'border-[#00d4ff]/20', icon: DollarSign, label: 'Paid' }
  };

  const current = config[status] || config.submitted;
  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${current.bg} ${current.color} ${current.border}`}>
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      {current.label}
    </span>
  );
};

export default ApplicationStatusBadge;