
import React, { useState } from 'react';
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Modal from '../../components/Modal';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const features = [
    'Unlimited saved searches',
    'High-velocity background indexing (60s)',
    'Advanced lead intent scoring',
    'Custom webhooks & API access',
    'Priority Slack support',
    'Export to CSV & CRM integrations'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade to Signal Pro">
      <div className="p-6">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-zinc-200">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Unlock full discovery</h2>
          <p className="text-gray-500 text-sm mt-1">Scale your signal hunting with professional tools.</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-xl flex">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${billingCycle === 'yearly' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
            >
              Yearly <span className="text-green-600 ml-1">-20%</span>
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center">
                <CheckIcon className="w-3 h-3 text-zinc-900 stroke-[3px]" />
              </div>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 mb-6">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-3xl font-bold text-gray-900">${billingCycle === 'monthly' ? '49' : '39'}</span>
              <span className="text-gray-500 text-sm font-medium">/month</span>
            </div>
            {billingCycle === 'yearly' && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-2 py-1 rounded">Billed annually</span>
            )}
          </div>
          <button 
            className="w-full bg-zinc-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-zinc-200"
            onClick={() => {
              alert('Thank you! In a real app, this would redirect to checkout.');
              onClose();
            }}
          >
            Start 7-day free trial
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-4 leading-relaxed">
            By starting your trial, you agree to our Terms of Service. <br /> Cancel anytime before the trial ends to avoid being charged.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeModal;
