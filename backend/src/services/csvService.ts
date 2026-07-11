import Papa from 'papaparse';

export function parseCSVString(csvString: string): any[] {
  const result = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors && result.errors.length > 0) {
    console.error('CSV Parsing errors:', result.errors);
  }

  return result.data;
}
