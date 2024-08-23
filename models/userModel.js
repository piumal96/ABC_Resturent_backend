const { ObjectId } = require('mongodb');

class UserModel {
  constructor(db) {
    this.collection = db.collection('users');
  }

  async findOne(query) {
    return await this.collection.findOne(query);
  }

  async insertOne(user) {
    return await this.collection.insertOne(user);
  }
}

module.exports = UserModel;
