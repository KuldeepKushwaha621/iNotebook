
import Notecontext from "./Notecontext";
import { useState } from "react";

const Notesstate = (props)=>{
  const host = "http://localhost:5000"

    const initialnotes = []
    const [notes, setnotes] = useState(initialnotes)


//Get All Note
const getNotes = async ()=>{
  //Api call
  const response = await fetch(`${host}/api/notes/fetchallnotes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
"auth-token": localStorage.getItem('token')
    }
  });
  const json = await response.json()
  //console.log(json)
  setnotes(json)
  }


//Add Note
const addNote =async (title, description, tag)=>{

//Api call
const response = await fetch(`${host}/api/notes/addnote`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "auth-token":
localStorage.getItem('token')
  },
  body: JSON.stringify({title, description, tag}), 
} );
const json = await response.json()
  const note = json
    setnotes(notes.concat(note))
}
//Delete Note

const deleteNote = async (id)=>{

  const response = await fetch(`${host}/api/notes//deletenote/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "auth-token":
  localStorage.getItem('token')
    }
  });
  const json =  response.json(); 
  console.log(json)


  console.log("delete note with id" + id);
  const newNotes = notes.filter((note)=>{return note._id !== id})
  setnotes(newNotes)
}

//Edit Note

const editNote = async (id, title, description, tag)=>{
//Api call
const response = await fetch(`${host}/api/notes//updatenote/${id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "auth-token":
localStorage.getItem('token')
  },
  body: JSON.stringify({title, description, tag})
} );
const json =  await response.json(); 
console.log(json);


let newNote = JSON.parse(JSON.stringify(notes))
//logic to edit
for(let index = 0; index < notes.length; index++){
    const element = newNote[index];
    if(element._id === id){
      newNote[index].title = title;
      newNote[index].description = description;
      newNote[index].tag = tag;
      break;
    }
   
  }
  setnotes(newNote);
}
return (
        <Notecontext.Provider value = {{notes, addNote, deleteNote, editNote, getNotes}}>
            {props.children}
        </Notecontext.Provider>

)
}


export default Notesstate;