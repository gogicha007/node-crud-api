import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { getRequest } from './routes/get';
import { postRequest } from './routes/post';
import { putRequest } from './routes/put';
import { deleteRequest } from './routes/delete';

export class Server {
  public server = createServer((req: IncomingMessage, res: ServerResponse) => {
    switch (req.method) {
      case 'GET':
        console.log('get request');
        getRequest(req, res);
        break;
      case 'POST':
        console.log('post request');
        postRequest(req, res);
        break;
      case 'PUT':
        console.log('put request');
        putRequest(req, res);
        break;
      case 'DELETE':
        console.log('delete request');
        deleteRequest(req, res);
        break;
    }
  });
  public close(): void {
    this.server.close();
  }
}
