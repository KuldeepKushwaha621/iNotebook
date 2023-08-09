import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
 
} from "react-router-dom";

import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Notesstate from './context/notes/Notesstate';
import Alerts from './components/Alerts';
import Login from './components/Login';
import Signup from './components/Signup';
import { useState } from 'react';


function App() {
  const [alert, setalert] = useState(null);
  const showAlert = (message, type) =>{
    setalert({
      msg : message,
      type : type
    })
    setTimeout(()=>{
      setalert(null)
    }, 1500);
  }
  return (
   <>
<Notesstate>
    <Router>
     <Navbar/>
     <Alerts alert = {alert}/>
     <div className="container">
    
     <Routes>
    <Route exact path='/' element={<Home showAlert = {showAlert} />} />
    <Route exact path='/about' element={<About />} />
    <Route exact path='/login' element={<Login showAlert = {showAlert} />} />
    <Route exact path='/signup' element={<Signup showAlert = {showAlert} />} />
   
     </Routes>
       
     </div>

  </Router>
  </Notesstate>
  </>
  );
}

export default App;
