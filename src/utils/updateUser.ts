import { IncomingMessage, ServerResponse } from 'http';
import path from 'node:path';
import { isValidId, getReqBody, getJSONData, writeDataToFile } from './utils';
import { IFUser } from '../interfaces';

const usersFilePath = path.resolve(__dirname, '../data/users.json');

export const updateUser = async (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split('/')[3] as string;
  let result = { status: 400, data: 'Something went wrong' };
  if (isValidId(id)) {
    const usersArray = await getJSONData(usersFilePath);
    const userData = usersArray.find((el) => el.id === id);
    if (!userData) {
      result.status = 404;
      result.data = 'User not found...';
    } else {
      let username, age, hobbies;
      const body = await getReqBody(req);
      if (body) {
        const bodyObj = JSON.parse(body as string);
        username = bodyObj.username;
        age = bodyObj.age;
        hobbies = bodyObj.hobbies;
      }
      const user = {
        username: username || userData.username,
        age: age || userData.age,
        hobbies: hobbies || userData.hobbies,
      };
      const userIndex = usersArray.findIndex((el) => el.id === id);
      usersArray[userIndex] = { id, ...user };
      const updateDone = await writeDataToFile(usersFilePath, usersArray);
      if (updateDone) {
        result.status = 200;
        result.data = JSON.stringify(user);
      }
    }
  } else {
    result.status = 400;
    result.data = 'Please provide valid UUID...';
  }
  return result;
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
