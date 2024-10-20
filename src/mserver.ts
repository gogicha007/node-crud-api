import cluster from 'node:cluster';
import os from 'node:os';
import { Server } from './server';

// console.log(os.availableParallelism());

const numParallel = os.availableParallelism();
let port = 4000;
let counter = port;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numParallel; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker)=> {
    port = 7000
    console.log('worker.id')
  })

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  //   http
  //     .createServer((req, res) => {
  //       res.writeHead(200);
  //       res.end('hello world\n');
  //     })
  //     .listen(8000);
  //   console.log(`Worker ${process.pid} started`);

  new Server().server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  console.log(`Worker ${process.pid} started`);
}
