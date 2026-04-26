const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

    // GET /movies
    if (req.method === 'GET' && req.url === '/movies') {
        const data = fs.readFileSync('file.json', 'utf8');
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
    }

    // POST /movies
    else if (req.method === 'POST' && req.url === '/movies') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            const newMovie = JSON.parse(body);

            let data = fs.readFileSync('file.json', 'utf8');
            data = JSON.parse(data);

            newMovie.id = Date.now();
            data.push(newMovie);

            fs.writeFileSync('file.json', JSON.stringify(data, null, 2));

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "Movie added" }));
        });
    }

    // fallback route
    else {
        res.statusCode = 404;
        res.end("Route not found");
    }
});

server.listen(3000, () => {
    console.log("Server started on port 3000");
});