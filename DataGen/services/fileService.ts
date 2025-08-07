
import { RawParsedData, DataRecord } from '../types';

// These are expected to be loaded from index.html
declare const Papa: any;
declare const XLSX: any;

export const parseFile = (file: File): Promise<RawParsedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const fileType = file.name.endsWith('.csv') ? 'csv' : 'xlsx';
    
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        if (!event.target?.result) {
            return reject(new Error('File could not be read.'));
        }

        let rows: (string | number)[][] = [];

        if (fileType === 'csv') {
          const result = Papa.parse(event.target.result as string, {
            header: false,
            skipEmptyLines: true,
          });
          if (result.errors.length > 0) {
            return reject(new Error(`CSV Parsing Error: ${result.errors[0].message}`));
          }
          rows = result.data;
        } else {
          const workbook = XLSX.read(event.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        }
        
        if (rows.length === 0) {
            return reject(new Error('The uploaded file is empty or could not be parsed.'));
        }

        resolve({ rows, fileName: file.name, fileType });
      } catch (err) {
        reject(new Error('Failed to process the file. Please ensure it is a valid CSV or Excel file.'));
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file.'));
    
    if (fileType === 'csv') {
        reader.readAsText(file);
    } else {
        reader.readAsBinaryString(file);
    }
  });
};

export const exportFile = (data: DataRecord[], headers: string[], fileName: string, fileType: 'csv' | 'xlsx') => {
    if (fileType === 'csv') {
        // Ensure data is in the correct format for Papa.unparse
        const csvData = data.map(record => headers.map(header => record[header]));
        const csv = Papa.unparse({ fields: headers, data: csvData });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        triggerDownload(blob, fileName);
    } else {
        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'GeneratedData');
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        triggerDownload(blob, fileName);
    }
};

const triggerDownload = (blob: Blob, fileName: string) => {
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
