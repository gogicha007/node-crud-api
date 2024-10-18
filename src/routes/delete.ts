import { IncomingMessage, ServerResponse } from 'node:http';
import { deleteUser } from '../utils/deleteUser';

export const deleteRequest = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  switch (req.url) {
    case (req.url as string).match(/\/api\/users\/\w+/)?.input:
      const removedUser = await deleteUser(req, res);
      console.log(removedUser)
      res.writeHead(removedUser.status, { 'Content-Type': 'text/plain' });
      res.end(removedUser.data);
      break;
    default:
      res.statusCode = 404;
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write(`404 - Page not found: ${req.url}`);
      res.end();
  }
};
