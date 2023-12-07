import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import ScoreBoardWindow from './scoresboardWindow/ScoreBoardWindow';
import SelectTeamWindow from './selectTeamWindow/SelectTeamWindow';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ScoreBoardWindow />} />
      <Route path="/Select" element={<SelectTeamWindow />} />
    </Routes>
   </BrowserRouter>

  );
}

export default App;
