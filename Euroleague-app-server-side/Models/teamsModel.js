import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
    teamname: String,
    teamplayers: Array,
    points: String,
    coachpoints: String
});

const Team = mongoose.model('Team', TeamSchema);

async function addNewTeam(team) {

    const newTeam = new Team({
        teamname: team.teamname,
        teamplayers: team.teamplayers,
        points: team.points,
        coachpoints: team.coachpoints
    });

    await newTeam.save();
}

async function getTeams() {
    try {
        const teams = await Team.find({});
        return teams;
    } catch (error) {
        console.error('Error fetching teams:', error);
        throw error;
    }
}

async function deleteTeam(teamToDelete) {
    try {
        await Team.deleteOne({ teamname: teamToDelete });
        //console.log(`Team ${teamToDelete} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting team ${teamToDelete}:`, error);
        throw error;
    }

}
async function updateTeam(team) {
    try {
        // Find the team by name and update its status
        await Team.findOneAndUpdate({ teamname: team.teamname }, { $set: team });
    } catch (error) {
        console.error('Error updating team status:', error);
        throw error;
    }

}


export default {addNewTeam, getTeams, deleteTeam, updateTeam}