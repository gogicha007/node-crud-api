import { IncomingMessage, ServerResponse } from 'node:http';
import { createUser } from '../utils/createUser';


export const postRequest = (req: IncomingMessage, res: ServerResponse) => {
  switch (req.url) {
    case '/api/users':
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', async () => {
        const result = await createUser(data)
        if(result){
          res.statusCode = 201;
          res.writeHead(201, { 'Content-Type': 'text/plain' });
          res.end('postRequests - user created');
        } else {
          res.statusCode = 400;
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('postRequests - user create failed, enter valid data');
        }
      });
      break;
    default:
      res.statusCode = 404;
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write(`404 - Page not found: ${req.url}`);
      res.end();
  }
};
