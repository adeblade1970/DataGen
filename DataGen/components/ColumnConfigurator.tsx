
import React from 'react';
import { ColumnConfigs } from '../types';

interface ColumnConfiguratorProps {
  headers: string[];
  configs: ColumnConfigs;
  onConfigChange: (newConfigs: ColumnConfigs) => void;
}

export const ColumnConfigurator: React.FC<ColumnConfiguratorProps> = ({ headers, configs, onConfigChange }) => {

  const handlePatternChange = (header: string, pattern: string) => {
    onConfigChange({ ...configs, [header]: pattern });
  };

  return (
    <div className="overflow-x-auto">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-6">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-amber-800">
                        Leave pattern blank to keep original data. Use <strong className="font-semibold">X</strong> for random letters, <strong className="font-semibold">N</strong> for numbers (e.g., <code className="bg-amber-100 p-1 rounded">XXN-NNN</code>), or <strong className="font-semibold">#</strong> to obfuscate (e.g., <code className="bg-amber-100 p-1 rounded">#######</code>).
                    </p>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {headers.map(header => (
                <div key={header}>
                    <label htmlFor={`pattern-${header}`} className="block text-sm font-medium text-slate-700 truncate" title={header}>
                        {header}
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            id={`pattern-${header}`}
                            value={configs[header] || ''}
                            onChange={(e) => handlePatternChange(header, e.target.value)}
                            placeholder="Keep original data"
                            className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
                        />
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
