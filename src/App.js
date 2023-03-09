import axios from 'axios';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Friends from './Components/Friends';
import Home from './Components/Home';
import Login from './Components/Login';
import NavigationBar from './Components/NavigationBar';
import Signup from './Components/Signup';
import Visit from './Components/Visit';
import instance from './instance';

function App() {

  return (
    <div className="App">
      <NavigationBar />
      <Routes>
        <Route path='' element={<Home />} />
        <Route path='signup' element={<Signup />} />
        <Route path='login' element={<Login/>} />
        <Route path='friends' element={<Friends/>} />
        <Route path='visit-page/:id' element={<Visit/>} />
      </Routes>
    </div>
  );
}

export default App;
