const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/nuBoot45', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});


// mongoose.connect(
//   process.env.MONGODB_URI || 'mongodb://localhost:27017/nuBoot45',
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
// );
module.exports = mongoose.connection;
