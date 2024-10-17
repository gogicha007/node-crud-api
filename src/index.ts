import {createServer, IncomingMessage, ServerResponse} from 'node:http';
import { getRequest } from './get';

const PORT = process.env.PORT || 3000
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  switch (req.method) {
    case 'GET':
      getRequest(req, res);
      break;
    case 'POST':
      break;
    case 'PUT':
      break;
    case 'DELETE':
      break;
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
