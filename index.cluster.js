const express = require('express')
const cluster = require('cluster')
const crypto = require('crypto')
process.env.UV_THREADPOOL_SIZE = 1; //a every child 1 tread avaiolable
const app = express();
// console.log('cluster.isMaster', cluster.isMaster)

// is the file in master mode...
if (cluster.isMaster) {

    //run this file again in child mode
    cluster.fork();
    cluster.fork();
    // cluster.fork();
    // cluster.fork();
    // cluster.fork();
    // cluster.fork();
}


else {
    //im a child. act as server and nothing else... (normal express server)
    function doWork(duration) {
        const start = Date.now();
        while (Date.now() - start < duration) {

        }
    }

    app.get('/', (req, res) => {
        // doWork(5000)
        crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
            res.send('hi there')
        })
    })

    app.get('/fast', (req, res) => {

        res.send('wow fast')
    })

    app.listen(3000);
}