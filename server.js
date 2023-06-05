const express = require('express');
const mongoose = require('mongoose');
const app = express();
const connectToMongoDB = require('./database/connection');
const bscrypt = require('bcryptjs');
const routes = require('./routes/router')
const User = require('./models/user');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();

const Store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
    store: Store
}));
app.use(express.urlencoded({ extended: true }));

app.use('/',routes);


app.use(express.static('public'));
app.use('/img/avatars', express.static(__dirname + '/public/img/avatars'));

app.use('/', routes);

async function start() {
    const uri = await connectToMongoDB();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    app.listen(2356, () => {
        console.log('Сервер запущен на порту 2356');
    });
}

start();