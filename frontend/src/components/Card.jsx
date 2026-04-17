import React from 'react';

const Card = ({ children, title, subtitle, icon: Icon, className = "", footer }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300 ${className}`}>
      {(title || Icon) && (
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
          {Icon && <Icon className="w-6 h-6 text-primary" />}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
