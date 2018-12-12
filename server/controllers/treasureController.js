

module.exports = {
  dragonTreasure: async (req, res) => {
    let db = req.app.get('db');
    const treasure = await db.get_dragon_treasure([ 1 ]);
    res.status(200).send(treasure);
  },
  getMyTreasure: async (req, res) => {
    let db = req.app.get('db');
    const myTreasure = await db.get_user_treasure([req.session.user.id]);
    res.status(200).send(myTreasure);
  },
  addUserTreasure: async (req, res) => {
    let { treasureURL } = req.body;
    let { id } = req.session.user;
    let db = req.app.get('db');
    let userTreasure = await db.add_user_treasure([ treasureURL, id ]);
    res.status(200).send(userTreasure);
  },
  getAllTreasure: async (req, res) => {
    let db = req.app.get('db');
    let allTreasure = await db.get_all_treasure();
    res.status(200).send(allTreasure);
  }
}