import { ColumnConfigs, DataRecord } from '../types';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';

const getRandomChar = (source: string): string => {
  return source.charAt(Math.floor(Math.random() * source.length));
};

const generateValueFromPattern = (pattern: string): string => {
  if (!pattern) return '';
  if (/^#+$/.test(pattern)) {
    return pattern; // Obfuscation
  }

  return pattern
    .split('')
    .map(char => {
      // Make pattern matching case-insensitive
      if (char.toLowerCase() === 'x') return getRandomChar(ALPHABET);
      if (char.toLowerCase() === 'n') return getRandomChar(NUMBERS);
      return char; // Literal character
    })
    .join('');
};

export const generateData = (
  configs: ColumnConfigs,
  originalData: DataRecord[],
  numToGenerate: number,
  headers: string[]
): DataRecord[] => {
  const newRecords: DataRecord[] = [];

  // Pre-calculate available original values for each column for random sampling.
  const originalValuesByHeader: Record<string, (string | number | boolean)[]> = {};
  if (originalData.length > 0) {
      headers.forEach(header => {
          originalValuesByHeader[header] = originalData
              .map(record => record[header])
              .filter(value => value !== null && value !== undefined);
      });
  }


  for (let i = 0; i < numToGenerate; i++) {
    const newRecord: DataRecord = {};
    headers.forEach(header => {
      const pattern = configs[header];
      if (pattern) {
        // Generate data from a pattern (X, N, #)
        newRecord[header] = generateValueFromPattern(pattern);
      } else {
        // If no pattern, pick a random value from the original data for this column.
        const existingValues = originalValuesByHeader[header];
        if (existingValues && existingValues.length > 0) {
          const randomIndex = Math.floor(Math.random() * existingValues.length);
          newRecord[header] = existingValues[randomIndex];
        } else {
          // Fallback: If no original data exists for this column, generate an empty string.
          newRecord[header] = '';
        }
      }
    });
    newRecords.push(newRecord);
  }

  return [...originalData, ...newRecords];
};
