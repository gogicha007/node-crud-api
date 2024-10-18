import { IncomingMessage } from 'node:http';
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

export const getReqBody = (req: IncomingMessage) => {
  return new Promise((resolve, reject) => {
    try {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {});
    } catch (error) {
      reject(error);
    }
  });
};
export const isValidId = (id: string) => {
  const regexExp =
    /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  return regexExp.test(id);
};
