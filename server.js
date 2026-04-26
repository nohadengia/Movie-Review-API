const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

    if (req.method === 'GET' && req.url === '/movies') {
        const data = fs.readFileSync('file.json', 'utf8');
        res.setHeader('Content-Type', 'application/json');
        return res.end(data);
    }

    else if (req.method === 'GET' && req.url.startsWith('/movies/')) {
        const id = req.url.split('/')[2];

        let data = JSON.parse(fs.readFileSync('file.json', 'utf8'));

        const movie = data.find(m => m.id == id);

        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(movie));
    }

    else if (req.method === 'POST' && req.url === '/movies') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            const newMovie = JSON.parse(body);

            let data = JSON.parse(fs.readFileSync('file.json', 'utf8'));

            newMovie.id = Date.now();
            data.push(newMovie);

            fs.writeFileSync('file.json', JSON.stringify(data, null, 2));

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "Movie added" }));
        });
    }

    else if (req.method === 'PUT' && req.url.startsWith('/movies/')) {
        const id = req.url.split('/')[2];
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            const updatedData = JSON.parse(body);

            let data = JSON.parse(fs.readFileSync('file.json', 'utf8'));

            data = data.map(m => {
                if (m.id == id) {
                    return { ...m, ...updatedData };
                }
                return m;
            });

            fs.writeFileSync('file.json', JSON.stringify(data, null, 2));

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: "Updated" }));
        });
    }

    else if (req.method === 'DELETE' && req.url.startsWith('/movies/')) {
        const id = req.url.split('/')[2];

        let data = JSON.parse(fs.readFileSync('file.json', 'utf8'));

        data = data.filter(m => m.id != id);

        fs.writeFileSync('file.json', JSON.stringify(data, null, 2));

        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ message: "Deleted" }));
    }

    else {
        res.statusCode = 404;
        res.end("Route not found");
    }
});

server.listen(3000, () => {
    console.log("Server started on port 3000");
});