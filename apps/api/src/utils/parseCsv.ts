import fs from 'fs-extra';
import papa from 'papaparse';

export default async function parseCsv<TResult = Record<string, string>>(
  filePath: string,
): Promise<TResult[]> {
  return new Promise(resolve => {
    papa.parse<TResult>(fs.createReadStream(filePath), {
      header: true,
      skipEmptyLines: true,
      transformHeader: header => header.trim(),
      complete: result => resolve(result.data),
    });
  });
}
