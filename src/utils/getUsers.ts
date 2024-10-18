import { IncomingMessage, ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { isValidId } from '../utils/utils';
import { IFUser } from '../interfaces';

const usersFilePath = path.resolve(__dirname, '../data/users.json');

export const getAll = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const rsData = await readFile(usersFilePath, {
      encoding: 'utf-8',
      flag: 'r',
    });
    return rsData;
  } catch (err) {
    return null;
  }
};

export const getById = async (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split('/')[3] as string;
  let result = { status: 200, data: '' };
  if (isValidId(id)) {
    const userData = await findUser(id);
    if (userData) {
      result.data = JSON.stringify(userData);
    } else {
      // not found or cannot read the file
      result.status = 404;
      result.data = 'User not found...';
    }
  } else {
    result.status = 400;
    result.data = 'Please provide valid UUID...';
  }
  return result;
};

const findUser = async (id: string) => {
  let userData = null;
  try {
    const rsData = await readFile(usersFilePath, {
      encoding: 'utf-8',
      flag: 'r',
    });
    const jsonData = JSON.parse(rsData) as IFUser[];
    const uData = jsonData.find((el) => el['id'] === id);
    userData = uData ? uData : null;
  } catch (err) {
    console.log(err);
  }
  return userData;
};
