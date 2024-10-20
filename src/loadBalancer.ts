import cluster from 'node:cluster';
import http, { ServerResponse, RequestOptions, createServer } from 'node:http'
import os from 'node:os';
import { Server } from './server';
import url from 'node:url'

let PORT = 4000;
let numCPUs = os.availableParallelism();

const workerPorts = Array.from({ length: numCPUs - 1 }, (_, i) => PORT + i + 1);


if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // const roundRobin = (servers, req, res) => {
  //   const target  = servers[current]
  //   current = (current + 1) % (numCPUs-1)
  // }
  workerPorts.forEach((workerPort) => {
    console.log(workerPort)
    const child = cluster.fork({PORT: workerPort});
    child.on('message', async (message) => {
      console.log(message);
    });
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  new Server().server.listen(PORT, () => {
    console.log(`Worker ${process.pid} started. Server running on port ${PORT}`);
  });
}
