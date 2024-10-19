import { IncomingMessage, ServerResponse } from 'node:http';
import { v4 as uuidv4 } from 'uuid';
import path from 'node:path';
import {
  getJSONData,
  isValidId,
  validateUserData,
  writeDataToFile,
  getReqBody,
} from '../utils/utils';
import { IFUser } from '../interfaces';

const usersFilePath = path.resolve(__dirname, '../data/users.json');

export const getAll = async (req: IncomingMessage, res: ServerResponse) => {
  const usersArray = await getJSONData(usersFilePath);
  return usersArray;
};

export const getById = async (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split('/')[3] as string;
  let result = { status: 200, data: '' };
  if (isValidId(id)) {
    const usersArray = (await getJSONData(usersFilePath)) as IFUser[];
    const userData = usersArray.find((user) => user.id === id);
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

export const createUser = async (data: string) => {
  try {
    const userData = JSON.parse(data) as IFUser;
    const isValid = validateUserData(userData);
    if (isValid) {
      userData.id = uuidv4();
      userData.username = userData.username.split(' ')[0];
      const usersArray = await getJSONData(usersFilePath);
      usersArray.push(userData);
      const isDataWrote = await writeDataToFile(usersFilePath, usersArray);
      return isDataWrote;
    }
    return false;
  } catch (err) {
    return false;
  }
};

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

export const deleteUser = async (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split('/')[3] as string;
  let result = { status: 400, data: 'Something went wrong' };
  if (isValidId(id)) {
    const usersArray = await getJSONData(usersFilePath);
    const userIndex = usersArray.findIndex((el) => el.id === id);
    if (userIndex >= 0) {
      const content = usersArray.filter((el) => el.id !== id);
      const updateDone = await writeDataToFile(usersFilePath, content);
      if (updateDone) {
        result.status = 204;
        result.data = `User with id: ${id} removed`;
      }
    } else {
      result.status = 404;
      result.data = 'User not found...';
    }
  } else {
    result.status = 400;
    result.data = 'Please provide valid UUID...';
  }
  return result;
};
