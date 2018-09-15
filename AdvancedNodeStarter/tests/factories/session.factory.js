const Keygrip = require('keygrip')
const buffer = require('safe-buffer').Buffer;
const keys = require('../../config/keys')
module.exports = (user) => {
    const sessionObj = {
        passport: {
            user: user._id.toString()
        }
    }
    const session = Buffer.from(JSON.stringify(sessionObj))
        .toString('base64');
    const keyGrip = new Keygrip([keys.cookieKey])
    const sig = keyGrip.sign(`session=${session}`);

    return {session, sig}
}