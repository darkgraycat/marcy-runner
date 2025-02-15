const http = require('http');
const net = require('net');

const server = http.createServer({
    // Explicitly set IPv4
    family: 4,
    // Increase various timeouts
    keepAlive: true,
    keepAliveTimeout: 60000,
    headersTimeout: 65000,
}, (req, res) => {
    console.log('\nHTTP Request Details:');
    console.log('Raw socket remote:', req.connection.remoteAddress);
    console.log('X-Forwarded-For:', req.headers['x-forwarded-for']);
    console.log('Remote Address:', req.socket.remoteAddress);
    console.log('Remote Family:', req.socket.remoteFamily);
    console.log('Remote Port:', req.socket.remotePort);
    console.log('Local Address:', req.socket.localAddress);
    console.log('Local Port:', req.socket.localPort);
    console.log('Headers:', req.headers);

    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Keep-Alive', 'timeout=60');
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.writeHead(200);
    res.end('Hello World\n');
});

server.on('error', (err) => {
    console.error('Server error:', err.message, err.stack);
});

server.on('connection', (socket) => {
    // Set socket options
    socket.setKeepAlive(true, 1000);
    socket.setNoDelay(true);
    
    // Set a large timeout
    socket.setTimeout(60000);
    
    socket.on('timeout', () => {
        console.log('Socket timeout from:', socket.remoteAddress);
        socket.end();
    });
    
    socket.on('error', (err) => {
        console.error('Socket error:', err.message, 'from:', socket.remoteAddress);
        if (!socket.destroyed) {
            socket.destroy();
        }
    });
    
    console.log('\nNew TCP Connection:');
    try {
        const addr = socket.address();
        console.log('Socket address:', addr);
        console.log('Remote:', socket.remoteAddress + ':' + socket.remotePort);
        console.log('Local:', socket.localAddress + ':' + socket.localPort);
        console.log('Family:', addr.family);
    } catch (err) {
        console.error('Error getting socket info:', err);
    }
});

const port = 3000;
const host = '0.0.0.0';

server.listen(port, host, () => {
    const addr = server.address();
    console.log('\nServer Configuration:');
    console.log('Address info:', addr);
    console.log(`Server is listening on ${addr.address}:${addr.port}`);
    
    // Print network interfaces
    const nets = require('os').networkInterfaces();
    console.log('\nAvailable Network Interfaces:');
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4') {
                console.log(`${name}: ${net.address}`);
            }
        }
    }
});
