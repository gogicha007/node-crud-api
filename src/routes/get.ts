import { IncomingMessage, ServerResponse } from 'node:http';
import { getAll } from '../utils/getUsers';

export const getRequest = async (req: IncomingMessage, res: ServerResponse) => {
  switch (req.url) {
    case '/api/users':
      const getUsers = (await getAll(req, res)) as string;
      const result = getUsers ? getUsers : 'no data';
      res.writeHead(200);
      res.write(`Users: \n ${result}`);
      res.end();
      break;
    case (req.url as string).match(/\/api\/users\/\w+/)?.input:
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('get user by id');
      break;
    default:
      res.statusCode = 404;
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write(`404 - Page not found: ${req.url}`);
      res.end();
  }
};
