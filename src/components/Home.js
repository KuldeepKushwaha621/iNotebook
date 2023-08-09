import React from 'react'
import Notes from './Notes';
//import Alert from './Alerts';


const Home = (props) => {
 const {showAlert} = props;
  return (
    <div>
       <Notes showAlert = {showAlert}  />
    </div>
  )
}

export default Home;
