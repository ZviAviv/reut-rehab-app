
import React from 'react';

interface WidgetCardProps {
  title: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  noHeaderBorder?: boolean;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ title, children, icon, action, noHeaderBorder }) => {
  const hasHeader = title || icon || action;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {hasHeader && (
        <div className={`px-4 py-2.5 flex items-center justify-between ${noHeaderBorder ? '' : 'border-b border-gray-50'}`}>
          <div className="flex items-center gap-2.5 flex-1">
            {icon && <span className="text-blue-500 shrink-0">{icon}</span>}
            {title && (
              <div className="font-semibold text-gray-800 text-sm leading-none">
                {title}
              </div>
            )}
          </div>
          {action && <div className="text-xs shrink-0">{action}</div>}
        </div>
      )}
      <div className="px-4 py-3 flex-grow">
        {children}
      </div>
    </div>
  );
};

export default WidgetCard;
