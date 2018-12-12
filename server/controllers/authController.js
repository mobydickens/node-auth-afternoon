const bcrypt = require('bcryptjs')

module.exports = {
  register: async (req, res) => {
    let { username, password, isAdmin } = req.body;
    let db = req.app.get('db');
    let founduser = await db.get_user([ username ]);
    if(founduser[0]) {
      res.status(409).send('Username taken!');
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync( password, salt );
      let user = await db.register_user([ isAdmin, username, hash ])
      req.session.user = { isAdmin: user[0].is_admin, id: user[0].id, username: user[0].username };
      res.status(201).send(req.session.user);
    }
  },
  login: async (req, res) => {
    let { username, password } = req.body;
    let db = req.app.get('db');
    const foundUser = await db.get_user([ username ]);
    const user = foundUser[0];
    if(!user) {
      res.status(401).send('User not found. Please register as a new user before logging in.');
    } else {
      const isAuthenticated = bcrypt.compareSync( password, user.hash );
      if(!isAuthenticated) {
        res.status(403).send('Incorrect password');
      } else {
        req.session.user = { isAdmin: user.is_admin, id: user.id, username: user.username };
        res.status(200).send(req.session.user);
      }
    }
  },
  logout: (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  }
}