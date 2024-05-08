const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const cartRoutes = require('./routes/cartRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = ('mongodb+srv://testUser:pass1234@nodeauthtutorial.osde3dd.mongodb.net/?retryWrites=true&w=majority&appName=nodeAuthTutorial');
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// routes
app.use(checkUser);
console.log('Made it to spoot 1');
app.get('/', (req, res) => res.render('home'));
console.log('Made it to spoot 2');
app.get('/create', requireAuth, (req,res) => res.render('create'));
console.log('Made it to spoot 3');

app.use(authRoutes);
console.log('Made it to spoot 5');
app.use('/courses', requireAuth,courseRoutes);
app.use('/cart', requireAuth, cartRoutes);
console.log('Made it to spoot 6');

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});