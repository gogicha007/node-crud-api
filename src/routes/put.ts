import { IncomingMessage, ServerResponse } from 'node:http';
import { updateUser } from '../utils/updateUser';
import { getAll, getById } from '../utils/getUsers';
import { isValidId } from '../utils/utils';


export const putRequest = async (req: IncomingMessage, res: ServerResponse) => {
  switch (req.url) {
    case (req.url as string).match(/\/api\/users\/\w+/)?.input:
      const putUser = await updateUser(req, res)
      res.writeHead(putUser.status, { 'Content-Type': 'text/plain' });
      res.end(putUser.data);
      break;
    default:
      res.statusCode = 404;
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write(`404 - Page not found: ${req.url}`);
      res.end();
  }
};
