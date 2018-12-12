require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const massive = require('massive');
const PORT = 4000;
const { CONNECTION_STRING, SESSION_SECRET } = process.env;
const ac = require('./controllers/authController');
const treasureController = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware');

const app = express();
app.use(bodyParser.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: false
}))
massive(CONNECTION_STRING).then(db => {
  app.set('db', db);
})

app.post('/auth/register', ac.register);
app.post('/auth/login', ac.login);
app.post('/api/treasure/user', auth.usersOnly, treasureController.addUserTreasure)
app.get('/auth/logout', ac.logout);
app.get('/api/treasure/dragon', treasureController.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureController.getMyTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly,treasureController.getAllTreasure);

app.listen(PORT, () => console.log(`server is live at port ${PORT}`));