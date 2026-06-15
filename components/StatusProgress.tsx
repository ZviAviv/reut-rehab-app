
import React from 'react';
import { AppStage } from '../types';
import { STAGES } from '../constants';

interface StatusProgressProps {
  currentStage: AppStage;
  onStageChange: (stage: AppStage) => void;
  onClose?: () => void;
}

const StatusProgress: React.FC<StatusProgressProps> = ({ currentStage, onStageChange, onClose }) => {
  const currentIndex = STAGES.indexOf(currentStage);

  return (
    <div className="bg-white p-2 pb-10 rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-xs z-20"
        >
          ✕
        </button>
      )}
      <div className="relative flex justify-between items-center w-full px-2 mt-2">
        {/* Progress Line */}
        <div className="absolute h-0.5 bg-gray-100 top-4 left-6 right-6 z-0" />
        <div
          className="absolute h-0.5 bg-blue-500 top-4 right-6 z-0 transition-all duration-500"
          style={{ width: `calc(${(currentIndex / (STAGES.length - 1)) * 100}% - ${(currentIndex / (STAGES.length - 1)) * 3}rem)` }}
        />

        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          
          return (
            <div 
              key={stage} 
              className="relative z-10 flex flex-col items-center group flex-1 cursor-pointer"
              onClick={() => onStageChange(stage)}
            >
              <div className={`
                w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
                ${isCompleted ? 'bg-blue-500 border-blue-500 text-white' : 
                  isCurrent ? 'bg-white border-blue-500 text-blue-500 scale-110' : 
                  'bg-white border-gray-200 text-gray-400'}
              `}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </div>
              <span className={`
                absolute top-9 text-[10px] leading-[1.1] font-medium text-center transition-colors px-0.5 max-w-[50px]
                ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-700' : 'text-gray-400'}
              `}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusProgress;
