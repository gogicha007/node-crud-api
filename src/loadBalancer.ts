import cluster from 'node:cluster';
import http, { ServerResponse, RequestOptions, createServer } from 'node:http';
import os from 'node:os';
import url from 'node:url'
import { Server } from './server';

let PORT = 4000;
let numCPUs = os.availableParallelism();
let current = 0

const workerPorts = Array.from({ length: numCPUs - 1 }, (_, i) => PORT + i + 1);

const roundRobin = (workerPorts: number[]) => {
  const target  = workerPorts[current]
  current = (current + 1) % (numCPUs-1)
  return target
}

const theUrl = (reqUrl: string, port: number) => {
  return url.format({
    protocol: "http",
    host: "localhost:" + port,
    pathname: reqUrl,
  });
}

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  

  const server = http.createServer((req, res) => {
    const targetPort = roundRobin(workerPorts)
    console.log(targetPort)
    const targetUrl = theUrl(req.url as string, targetPort)
    
    console.log(targetUrl)
    
    res.statusCode = 200
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('request received')
  });
  server.listen(PORT, ()=>{
    console.log(`Load balancer ${process.pid} is running at ${PORT} port`)
  })

  workerPorts.forEach((workerPort) => {
    const worker = cluster.fork({ PORT: workerPort });
    worker.on('message', async (message) => {
      console.log(message);
    });
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  new Server().server.listen(process.env.PORT, () => {
    console.log(
      `Worker ${process.pid} running on port ${process.env.PORT}`
    );
  });
}
