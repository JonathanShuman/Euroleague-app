import teamsModel from "../Models/teamsModel.js";
async function addTeam(req, res){
    try {
        const teamname = req.body.teamname;
        const teamplayers = req.body.teamplayers;
        const points = req.body.points;
        const coachpoints = req.body.coachpoints;
        const team = {
            teamname: teamname,
            teamplayers: teamplayers,
            points: points,
            coachpoints: coachpoints
        }
        teamsModel.addNewTeam(team);
        res.sendStatus(200);

    }
    catch(error) {
        console.error(error);
        res.sendStatus(500);

    }
}

async function getTeams(req, res){
    try {

        const response = await teamsModel.getTeams();
        return res.status(200).json(response);
    } catch(error) {
        console.error(error);
        res.sendStatus(500);
    }

}

async function deleteTeam(req, res){
    try {
        const teamToDelete = req.params.name;
        //console.log(teamToDelete);
        await teamsModel.deleteTeam(teamToDelete);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);

    }

}

async function updateTeam(req, res){
    try {
        const teamname = req.body.teamname;
        const teamplayers = req.body.teamplayers;
        const points = req.body.points;
        const coachpoints = req.body.coachpoints;
        const team = {
            teamname: teamname,
            teamplayers: teamplayers,
            points: points,
            coachpoints: coachpoints
        }
        await teamsModel.updateTeam(team);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);

    }

}

export default {addTeam, getTeams, deleteTeam, updateTeam}