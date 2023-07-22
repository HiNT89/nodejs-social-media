module.exports = {
  multipleMongooseToObject: function (list) {
    return list.map((it) => it.toObject());
  },
  mongooseToObject: function (mongoose) {
    return mongoose ? mongoose.toObject() : mongoose;
  },
};
