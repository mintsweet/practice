const BehaviorModel = require('../models/behavior');

module.exports = class Behavior {
  static getBehaviorByQuery(query, option) {
    return BehaviorModel.find(query, option);
  }
};
