
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AppStep, RawParsedData, ColumnConfigs, DataRecord } from './types';
import { FileUpload } from './components/FileUpload';
import { ColumnConfigurator } from './components/ColumnConfigurator';
import { DataTable } from './components/DataTable';
import { UniversityIcon, SpinnerIcon, DownloadIcon } from './components/Icons';
import { parseFile, exportFile } from './services/fileService';
import { generateData } from './services/generatorService';

export default function App() {
  const [step, setStep] = useState<AppStep>('upload');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [rawParsedData, setRawParsedData] = useState<RawParsedData | null>(null);
  const [hasHeader, setHasHeader] = useState<boolean>(true);

  const [columnConfigs, setColumnConfigs] = useState<ColumnConfigs>({});
  const [numToGenerate, setNumToGenerate] = useState<number>(100);
  
  const [finalData, setFinalData] = useState<DataRecord[]>([]);

  const { headers, originalData } = useMemo(() => {
    if (!rawParsedData) return { headers: [], originalData: [] };

    let headers: string[] = [];
    let dataRows: (string | number)[][] = [];

    if (hasHeader && rawParsedData.rows.length > 0) {
        headers = rawParsedData.rows[0].map(String);
        dataRows = rawParsedData.rows.slice(1);
    } else {
        const numFields = rawParsedData.rows[0]?.length || 0;
        headers = Array.from({ length: numFields }, (_, i) => `Field ${i + 1}`);
        dataRows = rawParsedData.rows;
    }
    
    const data: DataRecord[] = dataRows.map(row => {
        const record: DataRecord = {};
        headers.forEach((h, i) => {
            record[h] = row[i] ?? '';
        });
        return record;
    });

    return { headers, originalData: data };
  }, [rawParsedData, hasHeader]);

  useEffect(() => {
    if (headers.length > 0) {
        const initialConfigs: ColumnConfigs = {};
        headers.forEach(header => {
            initialConfigs[header] = ''; // Default to keep original
        });
        setColumnConfigs(initialConfigs);
    }
  }, [headers]);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
        const parsed = await parseFile(file);
        setRawParsedData(parsed);
        setStep('configure');
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred during file parsing.');
        setStep('upload');
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleGenerate = () => {
    setIsLoading(true);
    setError(null);
    try {
        const generated = generateData(columnConfigs, originalData, numToGenerate, headers);
        setFinalData(generated);
        setStep('download');
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred during data generation.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setStep('upload');
    setRawParsedData(null);
    setFinalData([]);
    setError(null);
    setNumToGenerate(100);
    setHasHeader(true);
  };
  
  const handleExport = (format: 'csv' | 'xlsx') => {
    if (!rawParsedData) return;
    const { fileName } = rawParsedData;
    const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
    exportFile(finalData, headers, `${baseName}_generated.${format}`, format);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-blue-900 text-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UniversityIcon className="h-10 w-10 text-blue-300" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              UoB QA Team Test Data Generator
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          {isLoading && (
            <div className="flex justify-center items-center p-16">
              <SpinnerIcon className="h-12 w-12 text-blue-700" />
              <p className="ml-4 text-slate-600 text-lg">Processing...</p>
            </div>
          )}

          {!isLoading && step === 'upload' && (
            <FileUpload onFileSelect={handleFileSelect} />
          )}

          {!isLoading && step === 'configure' && rawParsedData && (
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Step 2: Configure Columns</h2>
                <p className="text-slate-600 mb-6">File: <span className="font-medium text-blue-800">{rawParsedData.fileName}</span></p>
                
                <div className="mb-6">
                  <div className="flex items-center">
                      <input
                          id="hasHeader"
                          type="checkbox"
                          checked={hasHeader}
                          onChange={(e) => setHasHeader(e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="hasHeader" className="ml-2 block text-sm text-slate-900">
                          First row is header
                      </label>
                  </div>
                </div>

                <ColumnConfigurator headers={headers} configs={columnConfigs} onConfigChange={setColumnConfigs} />
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Step 3: Generate Data</h2>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <div className="flex-grow mb-4 sm:mb-0">
                    <label htmlFor="numToGenerate" className="block text-sm font-medium text-slate-700 mb-1">Number of new records to generate</label>
                    <input
                      type="number"
                      id="numToGenerate"
                      value={numToGenerate}
                      onChange={(e) => setNumToGenerate(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full sm:w-48 p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleGenerate}
                    className="w-full sm:w-auto bg-red-600 text-white font-bold py-2 px-6 rounded-md hover:bg-red-700 transition duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Generate Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isLoading && step === 'download' && (
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Step 4: Download Results</h2>
                <p className="text-slate-600 mb-6">Generated <span className="font-medium text-red-600">{numToGenerate}</span> new records, total records: <span className="font-medium text-blue-800">{finalData.length}</span>.</p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button onClick={() => handleExport('csv')} className="flex items-center justify-center bg-amber-700 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-800 transition duration-300">
                    <DownloadIcon className="h-5 w-5 mr-2" /> Download as CSV
                  </button>
                  <button onClick={() => handleExport('xlsx')} className="flex items-center justify-center bg-amber-700 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-800 transition duration-300">
                    <DownloadIcon className="h-5 w-5 mr-2" /> Download as XLSX
                  </button>
                  <button onClick={handleStartOver} className="flex items-center justify-center bg-slate-500 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-600 transition duration-300">
                    Start Over
                  </button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                 <h3 className="text-xl font-bold text-slate-800 mb-4">Data Preview (first 50 rows)</h3>
                 <DataTable headers={headers} data={finalData.slice(0, 50)} />
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-slate-800 text-slate-400 py-4 mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          &copy; {new Date().getFullYear()} UoB QA Team. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
