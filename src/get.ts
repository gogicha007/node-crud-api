import { IncomingMessage, ServerResponse } from 'node:http';

export const getRequest = (req: IncomingMessage, res: ServerResponse) => {
  switch (req.url) {
    case '/':
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`home method ${req.url}`);
      break;
    case '/users':
        res.writeHead(200)
        res.end('get users')
        break
    case (req.url as string).match(/\/users\/\w+/)?.input: 
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
