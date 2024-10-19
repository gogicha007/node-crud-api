import { IncomingMessage, ServerResponse } from 'node:http';
import { updateUser } from '../utils/userController';

export const putRequest = async (req: IncomingMessage, res: ServerResponse) => {
  switch (req.url) {
    case (req.url as string).match(/\/api\/users\/\w+/)?.input:
      const putResult = await updateUser(req, res);
      res.writeHead(putResult.status, { 'Content-Type': 'text/plain' });
      res.end(putResult.data);
      break;
    default:
      res.statusCode = 404;
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write(`404 - Page not found: ${req.url}`);
      res.end();
  }
};
