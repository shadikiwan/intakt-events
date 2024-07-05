const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const router = require('./routes/routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const corsOption = {
    origin: '*',
    credential: true,
    optionSuccessStatus: 200
};

app.use(cors(corsOption));
app.use('/', router);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Endpoint to get video file names
app.get('/api/videos', (req, res) => {
    const videoDir = path.join(__dirname, '..', 'public', 'videos');
    fs.readdir(videoDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        const videoFiles = files.filter(file => file.endsWith('.mp4'));
        res.json(videoFiles);
    });
});

const port = 4000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
