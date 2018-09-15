const mngs = require('mongoose');
const User = mngs.model('User');
module.exports = () => {
    return new User({}).save()
}