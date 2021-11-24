
function authenticate(req, res, next) {
    const username = req.headers['username']; 
    if (username && username.length > 0) {
        req.username = username;
    } else {
        req.username = "user";
    }
    return next();
}

function askForJson(req, res, next) {

    const contentType = req.headers['content-type']; 
    if (contentType == 'application/json') {
        return next();
    }
    return res.status(450).send('Invalid content type');
}

module.exports = {
    authenticate,
    askForJson
};