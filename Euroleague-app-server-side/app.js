import express from 'express'
import axios from 'axios'
import cors from 'cors';
import mongoose from 'mongoose';
import teamsController from './Controller/teamsController.js';
import playerController from './Controller/playerController.js';
global.roundNumber = 11;
const app = express();
const port = 3001;
app.use(cors());

await mongoose.connect('mongodb://127.0.0.1:27017/fantasy', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process if unable to connect to the database
    });

app.use(express.json());

app.post('/api/Teams', teamsController.addTeam);
app.get('/api/Teams', teamsController.getTeams);
app.delete(`/api/Teams/:name`, teamsController.deleteTeam);
app.put('/api/Teams', teamsController.updateTeam);
setInterval(playerController.updatePlayerData, 1000);
app.get('/api/Players', playerController.getPlayers);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
