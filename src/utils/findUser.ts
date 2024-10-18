import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { IFUser } from '../interfaces';

const usersFilePath = path.resolve(__dirname, '../data/users.json');

export const findUser = async (id: string) => {
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



