const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./config');
const tokenList = {};

// initialize experess
const router = express.Router();
const app = express();

app.use(bodyParser.json());

app.use('/api', router);
router.get('/', (req, rest) => {
    rest.send('ok cui')
});

router.post('/login', (req, res) => {
    const postData = req.body;
    const user = {
        email: postData.email,
        name:  postData.name
    };
    
    // database authentication check userName dan password
    const token = jwt.sign(user, config.secret, {expiresIn: config.tokenLife});
    const refreshToken = jwt.sign(user, config.refreshTokenSecret, {expiresIn: config.refreshTokenLife});

    const response = {
        status: 'Loggedn in',
        token,
        refreshToken
    };
    tokenList[refreshToken] = response;
    res.status(200).json(response);

});

router.post('/token', (req, res) => {
    // refresh token nya cui
    const postData = req.body;
    if((postData.refreshToken) && (postData.refreshToken in tokenList)) {
        const user = {
            email: postData.email,
            name:  postData.name
        }
        const token = jwt.sign(user, config.secret, {expiresIn: config.tokenLife});
        const response = {
            token,
        }
        // update the token in the list
        tokenList[postData.refreshToken].token = token;
        res.status(200).json(response);
    }else {
        res.status(404).send('Invalid request');
    }
})

router.use(require('./tokenChecker'))

router.get('/secure', (req, res) => {
    res.send('Secure access only for who had loggin in')
});

app.listen(config.port || process.env.port || 3000);