const https = require('https')
const crypto = require('crypto');
const fs = require('fs');
process.env.UV_THREADPOOL_SIZE=5

const start = Date.now();

function doRequest() {
    https.request('https://google.com', (res) => {
        res.on('data', () => {
        })
        res.on('end', () => {
            console.log('https.request', Date.now() - start)
        });
    })
        .end();
}


function doHash() {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
        console.log('hash: ', Date.now() - start)
    })
}

doRequest();

fs.readFile('multitask.js', 'utf8', () => {
    console.log('fs.readFile', Date.now() - start)
})

doHash();
doHash();
doHash();
doHash();




