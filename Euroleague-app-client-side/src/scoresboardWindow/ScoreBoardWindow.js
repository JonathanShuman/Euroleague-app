import React from 'react';
import  { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import './ScoreBoardWindow.css';
function ScoreBoardWindow() {
    

    const [teams, setTeams] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);

        const navigate = useNavigate();

        const openSelectWin = (e) => {
            navigate('/Select');
        }

        async function postTeam(team) {
            
            const res = await fetch(`http://localhost:3001/api/Teams`, {
                            'method': 'put',
                            'headers': {
                                    'Content-Type': 'application/json',
                            },
                            'body': JSON.stringify(team)
                    })
    
        }

        const getAllPlayersStats = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/Players', {
                    'method': 'get',
                    'headers': { },
                }); // Replace with your server endpoint
                const data = await response.json();
                //console.log(data);
                setAllPlayers(data); // Assuming your server returns an array of teams
                //console.log(teams);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        

        const refreshScoreboard = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/Teams', {
                    'method': 'get',
                    'headers': { },
                }); // Replace with your server endpoint
                const data = await response.json();
                //console.log(data)
                setTeams(data); // Assuming your server returns an array of teams
                //console.log(teams);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const deleteTeam = async (team) => {
            try{
            const name = team.teamname;

            const response = await fetch(`http://localhost:3001/api/Teams/${name}`, {
                        'method': 'delete',
                        'headers': {
                                'Content-Type': 'application/json',
                        },
                })

                if (response.ok) {
                    // If the deletion is successful, update the state to remove the deleted team
                    const updatedTeams = teams.filter((t) => t.teamname !== team.teamname);
                    setTeams(updatedTeams);
                    closeModal(); // Close the modal after deleting the team
                } else {
                    console.error('Error deleting team:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting team:', error);
            }

        }

        const calculatePdk = () => {
            const updatedTeams = teams.map((team) => {
                let totalPoints = parseFloat(team.coachpoints);
                //console.log(totalPoints);
                //let totalPoints =  parseFloat(team.points);
        
                team.teamplayers.forEach((p) => {
                    const foundPlayer = allPlayers.find(
                        (player) => p.firstName === player.first_name && p.lastName === player.last_name
                    );
        
                    if (foundPlayer) {
                        //console.log('Player:', p);
                        //console.log('Found Player:', foundPlayer);
        
                        if (!p.bench && !p.captain) {
                            totalPoints += parseFloat(foundPlayer.pdk);
                        } else if (p.bench && !p.captain) {
                            totalPoints += parseFloat(foundPlayer.pdk) / 2;
                        } else if (!p.bench && p.captain) {
                            totalPoints += parseFloat(foundPlayer.pdk) * 2;
                        } else {
                            totalPoints += parseFloat(foundPlayer.pdk);
                        }
                    }
                });
        
                //console.log('Team:', team.teamname, 'Total Points:', totalPoints);
        
                return { ...team, points: totalPoints.toString() };
            });
        
            setTeams(updatedTeams);
        };
        
    
        useEffect(() => {
            getAllPlayersStats();
            // Call the refreshScoreboard function when the component is mounted
            refreshScoreboard();
           // calculatePdk();

            
        }, []);

        useEffect(() => {
            
           
            const intervalId = setInterval(getAllPlayersStats, 5000);

            
             return () => clearInterval(intervalId);

            
        }, []);
        useEffect(() => {
            
            //calculatePdk();
            // Call the calculatePdk function every 10 seconds
            const intervalId = setInterval(calculatePdk, 1000);

            // // Clean up the interval when the component unmounts
             return () => clearInterval(intervalId);

            
        }, [teams, allPlayers]);
        
        // The empty dependency array means this effect runs once on mount

        // useEffect(() => {
        //     // Log the updated teams state
        //     console.log(teams);
        // }, [teams]); // This effect will run whenever teams state changes

        const handleTeamSelect = (team) => {
            setSelectedTeam(team);
        };

        const closeModal = () => {
            setSelectedTeam(null);
        };

        const toggleBenchStatus = (player) => {
            // Find the selected team from the state
            const selectedTeamIndex = teams.findIndex((team) => team.teamname === selectedTeam.teamname);
        
            // Find the index of the player in the team's players array
            const playerIndex = teams[selectedTeamIndex].teamplayers.findIndex(
                (p) => p.firstName === player.firstName && p.lastName === player.lastName
            );
        
            // Create a new copy of the teams state to avoid mutating the state directly
            const updatedTeams = [...teams];
        
            // Toggle the bench status of the selected player
            updatedTeams[selectedTeamIndex].teamplayers[playerIndex].bench = !updatedTeams[selectedTeamIndex].teamplayers[playerIndex].bench;
        
            // Update the state with the modified teams array
            
            setTeams(updatedTeams);
            postTeam(updatedTeams[selectedTeamIndex]);
        };
        
        const toggleCaptainStatus = (player) => {
            // Find the selected team from the state
            const selectedTeamIndex = teams.findIndex((team) => team.teamname === selectedTeam.teamname);
        
            // Find the index of the player in the team's players array
            const playerIndex = teams[selectedTeamIndex].teamplayers.findIndex(
                (p) => p.firstName === player.firstName && p.lastName === player.lastName
            );
        
            // Create a new copy of the teams state to avoid mutating the state directly
            const updatedTeams = [...teams];
        
            // Toggle the captain status of the selected player
            updatedTeams[selectedTeamIndex].teamplayers[playerIndex].captain = !updatedTeams[selectedTeamIndex].teamplayers[playerIndex].captain;
        
            // Update the state with the modified teams array
            setTeams(updatedTeams);
            postTeam(updatedTeams[selectedTeamIndex]);
        };

        const addCoachPoints = async (team) => {

            const userInput = window.prompt(
                "Choose an option:\n1. Add 25\n2. Add 20\n3. Add 10\n4. Decrease 5\n5. Decrease 10\n6. Decrease 20"
              );
            
              if (userInput !== null) {
                const option = parseInt(userInput);
            
                switch (option) {
                  case 1:
                    // Add 25 points
                    addPoints(team, 25);
                    break;
                  case 2:
                    // Add 20 points
                    addPoints(team, 20);
                    break;
                  case 3:
                    // Add 10 points
                    addPoints(team, 10);
                    break;
                  case 4:
                    // Decrease 5 points
                    decreasePoints(team, 5);
                    break;
                  case 5:
                    // Decrease 10 points
                    decreasePoints(team, 10);
                    break;
                  case 6:
                    // Decrease 20 points
                    decreasePoints(team, 20);
                    break;
                  default:
                    window.alert("Invalid option");
                    break;
                }
              }

        }

        const addPoints = (team, points) => {
            // Find the index of the team in the original array
            const teamIndex = teams.findIndex((t) => t.teamname === team.teamname);
          
            // Add points to the team's total points
            const updatedTeams = teams.map((t, index) =>
              index === teamIndex ? { ...t, coachpoints: (parseFloat(t.coachpoints) + points).toString() } : t
            );
            setTeams(updatedTeams);
          
            // Send the updated team and its index to the post method
            postTeam(updatedTeams[teamIndex]);
          };
          
          const decreasePoints = (team, points) => {
            // Find the index of the team in the original array
            const teamIndex = teams.findIndex((t) => t.teamname === team.teamname);
          
            // Decrease points from the team's total points
            const updatedTeams = teams.map((t, index) =>
              index === teamIndex ? { ...t, coachpoints: (parseFloat(t.coachpoints) - points).toString() } : t
            );
            setTeams(updatedTeams);
          
            // Send the updated team and its index to the post method
            postTeam(updatedTeams[teamIndex]);
          };
        
    
    return(
        <div>
            <span>
                <button id='add-team-btn' type="button" className="btn btn-primary" onClick={openSelectWin} >
                    Add new team
                </button>
            </span>
            <div className="container">
                <h1 id='score-board-header'>Scoreboard - Based Euroleague live stats</h1>
                <ul className="scoreboard-list">
                    {teams
                    .sort((a, b) => parseFloat(b.points) - parseFloat(a.points))
                    .map((team, index) => (
                    <li key={index} className="scoreboard-item">
                
                        <button onClick={() => handleTeamSelect(team)} className="team-button">
                            {team.teamname}
                        </button>
                        <div className='points-container'>
                        <span className="points">{team.points}</span>
                        </div>
                        <button onClick={() => addCoachPoints(team)} className='coachp-button' >
                            Add coach points
                        </button>
                        <button onClick={() => deleteTeam(team)} className="delete-button">
                            Delete Team
                        </button>
                        
                    </li>
                    ))}
                </ul>

            </div>

            {selectedTeam && (
  <div className={`modal ${selectedTeam ? 'active' : ''}`}>
    <button onClick={closeModal}>Close</button>
    <h2>Players of {selectedTeam.teamname}</h2>
    <table className="player-table">
      <thead>
        <tr>
          <th>Player</th>
          <th>Captain</th>
          <th>Bench</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {selectedTeam.teamplayers.map((player, index) => (
          <tr key={index}>
            <td>
              {player.firstName} {player.lastName}
            </td>
            <td className={player.captain ? 'v' : 'x'}>{player.captain ? 'V' : 'X'}</td>
            <td className={player.bench ? 'v' : 'x'}>{player.bench ? 'V' : 'X'}</td>
            <td>
              <button onClick={() => toggleBenchStatus(player)}>
                Toggle Bench
              </button>
              <button onClick={() => toggleCaptainStatus(player)}>
                Toggle Captain
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)};
        </div>

    );
}
export default ScoreBoardWindow;