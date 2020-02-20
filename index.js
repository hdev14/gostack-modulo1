const express = require('express');

const server = express();

server.use(express.json());

// Middlewares

function log(req, res, next) {
    console.time('Request');
    console.log(`Method: ${req.method}; URL: ${req.url};`);
    next();
    console.timeEnd('Request');
}

function CheckNameExists(req, res, next) {
    if(!req.body.name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    next();
}

function CheckUserExists(req, res, next) {
    const user = users[req.params.index];

    if(!user) {
        return res.status(400).json({ error: 'User does not exists' });
    }

    req.user = user;
    return next();
}

server.use(log);

const users = ['Diego', 'HermersonDev'];

server.get('/users', (req, res) => {
    return res.json(users);
});

server.get('/users/:index', CheckUserExists, (req, res) => {
    return res.json(req.user);
});

server.post('/users', CheckNameExists, (req, res) => {
    const { name } = req.body;
    users.push(name);
    return res.json(users);
});

server.put('/users/:index', CheckNameExists, CheckUserExists, (req, res) => {
    const { name } = req.body;
    const { index } = req.params;

    users[index] = name;
    return res.json(users);
});

server.delete('/users/:index', CheckUserExists, (req, res) => {
    const { index } = req.params;
    
    users.splice(index, 1);
    return res.send();
});

server.listen(3000, () => {
    console.log('server on');
});