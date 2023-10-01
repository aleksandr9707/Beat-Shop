import mongoose from 'mongoose';
console.log(process.env.DATABASE_URL);

mongoose.connect('mongodb+srv://alex9707:seistudent@cluster0.rpax1g5.mongodb.net/beat-shop?retryWrites=true&w=majority');

const db = mongoose.connection;

db.on('connected', function () {
  console.log(`Connected to ${db.name} at ${db.host}:${db.port}`);
});