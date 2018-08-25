const express = require('express')
const cluster = require('cluster')
const crypto = require('crypto')
const {Worker} = require('webworker-threads')
process.env.UV_THREADPOOL_SIZE = 1; //a every child 1 tread avaiolable
const app = express();
// console.log('cluster.isMaster', cluster.isMaster)


//im a child. act as server and nothing else... (normal express server)
function doWork(duration) {
    const start = Date.now();
    while (Date.now() - start < duration) {

    }
}

function worker(req, res) {

    const worker = new Worker(function () {
        const start=Date.now();
        this.onmessage = function () {
            let counter = 0;
            while (counter < 1e9) {
                counter++;
            }
            postMessage({counter,start});
        }
    })

    worker.onmessage = function (response) {
        // console.log(response)
        console.log('message',Date.now()-response.data.start, response.data.counter)
        // res.send(''+message.data)
    }

    worker.postMessage();
}

app.get('/', (req, res) => {
    // doWork(5000)
    // crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    //     res.send('hi there')
    // })
   worker(req, res);
   worker(req, res);
   worker(req, res);
   worker(req, res);
})

app.get('/fast', (req, res) => {

    res.send('wow fast')
})

app.listen(3000);
