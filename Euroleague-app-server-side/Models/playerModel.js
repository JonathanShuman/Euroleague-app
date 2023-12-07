import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  first_name: String, 
  last_name: String,
  pdk: String,
});

const Player = mongoose.model('Player', playerSchema);

export default Player;