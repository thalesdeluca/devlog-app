import * as mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String, 
  password: String
});

mongoose.model('users', UserSchema);

export default UserSchema;