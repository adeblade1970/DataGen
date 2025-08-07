
export type AppStep = 'upload' | 'configure' | 'download';

export type RawParsedData = {
  rows: (string | number)[][];
  fileName: string;
  fileType: 'csv' | 'xlsx';
};

export type ColumnConfigs = Record<string, string>;

export type DataRecord = Record<string, string | number | boolean>;
