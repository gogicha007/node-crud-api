import { IncomingMessage, ServerResponse } from 'node:http';

export const deleteRequest = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  switch (req.url) {
    case (req.url as string).match(/\/api\/users\/\w+/)?.input:
      const getUser = await getById(req, res);
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
