import { v4 as uuidv4 } from 'uuid';
import { IFUser } from '../interfaces';
import { writeDataToFile, getJSONData } from './utils';
import path from 'node:path'

const usersFilePath = path.resolve(__dirname, '../data/users.json');

export const createUser = async (data: string) => {
  try {
    const userData = JSON.parse(data) as IFUser;
    const isValid = validateData(userData);
    if (isValid) {
      userData.id = uuidv4();
      userData.username = userData.username.split(' ')[0]
      const usersArray = await getJSONData(usersFilePath)
      usersArray.push(userData)
      const isDataWrote = await writeDataToFile(usersFilePath, usersArray)
      return isDataWrote;
    }
    return false;
  } catch (err) {
    return false;
  }
};

const validateData = (data: IFUser) => {
  if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
    if (!(data.username && data.age && data.hobbies)) return false;
    if (
      !(
        typeof data.username === 'string' &&
        typeof data.age === 'number' &&
        Array.isArray(data.hobbies)
      )
    )
      return false;
    return true;
  }
  return false;
};
