import axios from 'axios';
import Player from '../Models/playerModel.js'
//const Player = require('./playerModel');

const updatePlayerData = async () => {
  // Same logic as before, but now using the Player model
  try {
    const apiUrl = `https://www.dunkest.com/api/stats/table?season_id=15&mode=dunkest&stats_type=avg&weeks%5B%5D=13&rounds%5B%5D=1&rounds%5B%5D=2&teams%5B%5D=31&teams%5B%5D=32&teams%5B%5D=33&teams%5B%5D=34&teams%5B%5D=35&teams%5B%5D=36&teams%5B%5D=37&teams%5B%5D=38&teams%5B%5D=39&teams%5B%5D=40&teams%5B%5D=41&teams%5B%5D=42&teams%5B%5D=43&teams%5B%5D=44&teams%5B%5D=45&teams%5B%5D=46&teams%5B%5D=47&teams%5B%5D=48&positions%5B%5D=1&positions%5B%5D=2&positions%5B%5D=3&player_search=&min_cr=4&max_cr=35&sort_by=pdk&sort_order=desc&iframe=yes`;

    const response = await axios.get(apiUrl, { headers: {} });
    const fetchedPlayers = response.data;
    if(fetchedPlayers.length === 0) {
        try {
            await Player.updateMany({}, { $set: { pdk: 0 } });
            //console.log('Successfully set pdk to 0 for all players.');
          } catch (updateError) {
            console.error('Error updating pdk for all players:', updateError.message);
          }
    }

    await Promise.all(
      fetchedPlayers.map(async (fetchedPlayer) => {
        const { id, first_name, last_name, pdk} = fetchedPlayer;
        const existingPlayer = await Player.findOne({ id: fetchedPlayer.id });

        if (existingPlayer) {
            existingPlayer.id = id;
            existingPlayer.first_name = first_name;
            existingPlayer.last_name = last_name;
            existingPlayer.pdk = pdk;
            await existingPlayer.save();
        } else {
            await Player.create({
                id,
                first_name,
                last_name,
                pdk,
              });
        }
      })
    );

    //console.log('Player data updated successfully.');
  } catch (error) {
    console.error('Error updating player data:', error.message);
  }
};

async function getPlayers(req, res){
    try {

        const response = await Player.find({});
        //console.log(response);
        return res.status(200).json(response);
    } catch(error) {
        console.error(error);
        res.sendStatus(500);
    }

}


export default {updatePlayerData, getPlayers}
