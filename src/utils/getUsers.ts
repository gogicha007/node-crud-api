import { IncomingMessage, ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const usersFilePath = path.resolve(__dirname, '../data/users.json');

export const getAll = async (req: IncomingMessage, res: ServerResponse) => {
  console.log('get all');
  try {
    const rsData = await readFile(usersFilePath, { encoding: 'utf-8', flag: 'r' });
    return rsData;
  } catch (err) {
    return null
  }
};

export const getById = (req: IncomingMessage, res: ServerResponse) => {
  console.log('get by id');
};
