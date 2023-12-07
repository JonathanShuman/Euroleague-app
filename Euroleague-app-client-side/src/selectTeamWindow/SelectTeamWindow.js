import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import './SelectTeamWindow.css'
function SelectTeamWindow() {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);
    const [suggestedPlayers, setSuggestedPlayers] = useState([]);

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
    

    async function postTeam() {

        const newTeamName = document.getElementById('teamName').value;

        const data = {
            teamname: newTeamName,
            teamplayers: players,
            points: "0",
            coachpoints: "0",
            
        }
        //console.log(data);
        
        const res = await fetch('http://localhost:3001/api/Teams', {
                        'method': 'post',
                        'headers': {
                                'Content-Type': 'application/json',
                        },
                        'body': JSON.stringify(data)
                })

    }

    const handleInputChange = (e) => {
        const inputText = e.target.value.toLowerCase();
        const filteredPlayers = allPlayers.filter(
            (player) =>
                player.first_name.toLowerCase().startsWith(inputText) ||
                player.last_name.toLowerCase().startsWith(inputText)
        );
        setSuggestedPlayers(filteredPlayers);
    };

    const handlePlayerSelection = (selectedPlayer) => {
        setPlayers([...players, selectedPlayer]);
        setSuggestedPlayers([]);
        document.getElementById('playerInput').value = `${selectedPlayer.first_name} ${selectedPlayer.last_name}`;
    };


    const handleAddPlayer = () => {
         if (players.length < 10) {
            const fullName = document.getElementById('playerInput').value;
            const [firstName, ...lastNameArray] = fullName.split(' ');
            const lastName = lastNameArray.join(' ');
            //console.log(firstName);
            //console.log(lastName);
            const bench = false;
            const captain = false;

                 if (firstName && lastName) {
                 // Check if the player exists in the allPlayers array
                 const playerExists = allPlayers.find(
                    (player) => player.first_name === firstName && player.last_name === lastName);
                    if (playerExists) {
                        // Add the new player to the array
                        setPlayers([...players, { firstName, lastName, bench, captain }]);
                    } else {
                        alert('Selected player not found in the player database.');
                    }
                document.getElementById('playerInput').value = '';
                // Clear the input fields
                // document.getElementById('firstName').value = '';
                // document.getElementById('lastName').value = '';
            } else {
                alert('Please provide both first name and last name.');
            }
        } else {
            alert('You can only add up to 10 players.');
        }

            
          
        };
        //     // Get the input values
        //     const firstName = document.getElementById('firstName').value;
        //     const lastName = document.getElementById('lastName').value;

        //     // Check if both first name and last name are provided
        //     if (firstName && lastName) {
        //          // Check if the player exists in the allPlayers array
        //          const playerExists = allPlayers.find(
        //             (player) => player.first_name === firstName && player.last_name === lastName);
        //             if (playerExists) {
        //                 // Add the new player to the array
        //                 setPlayers([...players, { firstName, lastName }]);
        //             } else {
        //                 alert('Selected player not found in the player database.');
        //             }
                
        //         // Clear the input fields
        //         document.getElementById('firstName').value = '';
        //         document.getElementById('lastName').value = '';
        //     } else {
        //         alert('Please provide both first name and last name.');
        //     }
        // } else {
        //     alert('You can only add up to 10 players.');
        // }
    

    const goBack = () => {
        navigate('/');
    }

    const handleSave = () => {
        postTeam();
        document.getElementById('teamName').value = '';

    }

    useEffect(() => {
        getAllPlayersStats();
    }, []);


    

    return (
        <div className="container mt-5" >
          <h1 id="select-your-team" className="mb-4">Select Your Team</h1>
    
          <div className="input-group mb-3">
            <input
              id="playerInput"
              type="text"
              className="form-control"
              placeholder="Type player name"
              onChange={handleInputChange}
              list="suggestedPlayers"
            />
            <datalist id="suggestedPlayers">
              {suggestedPlayers.map((player, index) => (
                <option
                  key={index}
                  value={`${player.first_name} ${player.last_name}`}
                  onClick={() => handlePlayerSelection(player)}
                />
              ))}
            </datalist>
            <button className="btn btn-primary" onClick={handleAddPlayer}>
              Add
            </button>
          </div>
    
          <div className="mb-4">
            <h2>Team Players</h2>
            <ul className="list-group">
              {players.map((player, index) => (
                <li key={index} className="list-group-item">
                  {`${player.firstName} ${player.lastName}`}
                </li>
              ))}
            </ul>
          </div>
    
          <div className="mb-3">
            <input
              id="teamName"
              type="text"
              className="form-control"
              placeholder="Choose team name"
            />
          </div>
    
          <div>
            <button className="btn btn-success" onClick={handleSave}>
              Save Team
            </button>
            <button className="btn btn-secondary ml-2" onClick={goBack}>
              Back to Scoreboard
            </button>
          </div>
        </div>
      );
    
}
export default SelectTeamWindow;