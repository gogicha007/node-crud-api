import { writeFile, readFile } from 'node:fs/promises';
import { IFUser } from '../interfaces';

export const writeDataToFile = async (filename: string, content: IFUser) => {
  try {
    const jsonData = await readFile(filename, { encoding: 'utf-8' });
    const items = jsonData ? JSON.parse(jsonData) : [];
    items.push(content);
    await writeFile(filename, JSON.stringify(items));
    return true;
  } catch (err) {
    console.log('write to file error', err);
    return false;
  }
};
