import cluster from 'node:cluster';
import dotenv from 'dotenv';
import { request, createServer, IncomingMessage } from 'node:http';
import os from 'node:os';
import url from 'node:url';
import { Server } from './server';

dotenv.config()

let MULTI_PORT = Number(process.env.MULTI_PORT) || 4000;
let numCPUs = os.availableParallelism();
let current = 0;

const workerPorts = Array.from(
  { length: numCPUs - 1 },
  (_, i) => MULTI_PORT + i + 1
);
const roundRobin = (workerPorts: number[]) => {
  const target = workerPorts[current];
  current = (current + 1) % (numCPUs - 1);
  return target;
};

const theUrl = (reqUrl: string, port: number) => {
  return url.format({
    protocol: 'http',
    host: 'localhost:' + port,
    pathname: reqUrl,
  });
};

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  const server = createServer((req, res) => {
    const targetPort = roundRobin(workerPorts);
    const targetUrl = theUrl(req.url as string, targetPort);
    console.log(targetUrl)
    const runner = request(
      targetUrl,
      {
        headers: req.headers,
        method: req.method
      },
      (serverResponse: IncomingMessage) => {
        res.writeHead(serverResponse.statusCode as number, serverResponse.headers)
        serverResponse.pipe(res, { end: true});
      }
    )

    req.pipe(runner, { end: true})
  });
  
  server.listen(MULTI_PORT, () => {
    console.log(`Load balancer ${process.pid} is running at ${MULTI_PORT} port`);
  });

  workerPorts.forEach((workerPort) => {
    const worker = cluster.fork({ MULTI_PORT: workerPort });
    worker.on('message', async (message) => {
      console.log(message);
    });
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  new Server().server.listen(process.env.MULTI_PORT, () => {
    console.log(`Worker ${process.pid} running on port ${process.env.MULTI_PORT}`);
  });
}
