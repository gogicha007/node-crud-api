import { IncomingMessage, ServerResponse } from 'node:http';
import { getAll, getById } from '../utils/getUsers';


export const getRequest = async (req: IncomingMessage, res: ServerResponse) => {
  switch (req.url) {
    case '/api/users':
      const getUsers = (await getAll(req, res)) as string;
      const result = getUsers ? getUsers : 'no data';
      res.writeHead(200, { 'Content-Type': 'text/json' });
      res.write(`Users: ${result}`);
      res.end();
      break;
    case (req.url as string).match(/\/api\/users\/\w+/)?.input:
      const getUser = (await getById(req, res))
      res.writeHead(getUser.status, { 'Content-Type': 'text/plain' });
      res.end(getUser.data);
      break;
    default:
      res.statusCode = 404;
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write(`404 - Page not found: ${req.url}`);
      res.end();
  }
};
