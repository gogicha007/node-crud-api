import { IncomingMessage, ServerResponse } from 'http';
import { isValidId, getReqBody } from './utils';
import { findUser } from './findUser';
import { IFUser } from '../interfaces';


export const updateUser = async (req: IncomingMessage, res: ServerResponse) => {
  const id = req.url?.split('/')[3] as string;
  let result = { status: 200, data: '' };
  if (isValidId(id)) {
    const userData = await findUser(id);
    if (!userData) {
      result.status = 404;
      result.data = 'User not found...';
    } else {
        const body = await getReqBody(req)

        const {username, age, hobbies } = JSON.parse(body as string)
        const user = {
            username: username || userData.username,
            age: age || userData.age,
            hobbies: hobbies || userData.hobbies
        }
        let data = '';
        req.on('data', (chunk) => {
          data += chunk;
        });
        result.data = JSON.stringify(userData);
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
