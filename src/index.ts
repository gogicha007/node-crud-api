import http from 'node:http';

const server = http.createServer((req, res) => {
    res.writeHead(200)
});

server.listen(3000)
