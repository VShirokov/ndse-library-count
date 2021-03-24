const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();

app.get('/counter/:id', (req, res) => {
    const { params: { id } = {} } = req;
    const file = path.join(__dirname, 'store.json' );
    if (file) {
        let dataFromStore, respCount = '';
        fs.readFile(file, 'utf-8')
            .then(data => {
                dataFromStore = JSON.parse(data);
                res.json(dataFromStore[id]);
                respCount = dataFromStore[id];
            })
            .catch(err => {
                console.erro('get request error, read file  - ', err);
                throw err;
            });
    }

});

app.post('/counter/:id/incr', (req, res) => {
    const { params: { id } = {} } = req;
    const file = path.join(__dirname, 'store.json' );

    fs.access(file, fs.F_OK)
        .then(
            fs.readFile(file, 'utf-8')
                .then(data => {
                    const dataFromStore = JSON.parse(data);
                    dataFromStore[id] = dataFromStore[id] ? ++dataFromStore[id] : 1;
                    fs.writeFile(file, JSON.stringify(dataFromStore, null, 4))
                        .then(console.log('success write file'))
                        .catch(err => console.error('Error write file -> ', err));
                })
                .catch(err => {
                    const content = {}
                    content.id = 1;
                    fs.writeFile(file, JSON.stringify(content))
                        .catch(err => console.error('Error write file -> ', err));
                })
        )
        .catch(err => console.error('cannot access to file with error-> ', err));

    res.json('Ok');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});