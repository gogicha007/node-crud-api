import { v4 as uuidv4 } from 'uuid';
import { IFUser } from '../interfaces';
import { writeDataToFile } from './utils';
import path from 'node:path'

export const createUser = async (data: string) => {
  try {
    const userData = JSON.parse(data) as IFUser;
    const isValid = validateData(userData);
    if (isValid) {
      userData.id = uuidv4();
      userData.username = userData.username.split(' ')[0]
      const usersJSON = path.resolve(__dirname,'../data/users.json')
      const isDataWrote = await writeDataToFile(usersJSON, userData)
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
