import { IncomingMessage, ServerResponse } from 'http';
import path from 'node:path';
import { isValidId, getJSONData, writeDataToFile } from './utils';

const usersFilePath = path.resolve(__dirname, '../data/users.json');

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
  return result
};
