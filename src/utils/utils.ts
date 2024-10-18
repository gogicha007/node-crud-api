import { IncomingMessage } from 'node:http';
import { writeFile, readFile } from 'node:fs/promises';
import { IFUser } from '../interfaces';


export const writeDataToFile = async (filename: string, content: IFUser[]) =>{
  try {
    await writeFile(filename, JSON.stringify(content));
    return true
  } catch (err) {
    return false
  }
}

export const getReqBody = (req: IncomingMessage) => {
  return new Promise((resolve, reject) => {
    try {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const result = body ? body: null;
        resolve(result);
      });
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

export const getJSONData = async (filePath: string) => {
  let result: IFUser[] = [];
  try {
    const rsData = await readFile(filePath, {
      encoding: 'utf-8',
      flag: 'r',
    });
    result = JSON.parse(rsData) as IFUser[];
  } catch (err) {
    console.log(err);
  }
  return result;
};
