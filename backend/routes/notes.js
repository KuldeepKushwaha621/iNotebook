const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');
const { findByDisplayValue } = require('@testing-library/react');


//Route 1 : get all the notesusing get : /api/notes/getuser. login required
router.get('/fetchallnotes',fetchuser, async (req,res)=>{
  try {
    const notes = await Note.find({user : req.user.id});
    res.json(notes)
  } catch (error) {
    console.error(error.message);
  res.status(500).send("Internal server Error");
  }
  
})

//Route 2 : Add the notes using POST : /api/notes/addnote. login required
router.post('/addnote',fetchuser,[
  body('title', 'Enter a valid title').isLength({min:3}),
  body('description', 'Enter at least 5 character').isLength({min:5}),
  

], async (req,res)=>{

  try {
    const {title, description, tag} = req.body;
// if there are errors, return bad request and the errors
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors : errors.array() });
    }
    const note = new Note({
       title, description, tag, user : req.user.id
    })
    const savednote = await note.save();
      res.json(savednote)


} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server Error");
}
})

//Route 3 : Update notes using PUT : /api/notes/updatenote. login required
router.put('/updatenote/:id',fetchuser, async (req,res)=>{

  const {title, description, tag} = req.body
  try {
    
  //Create Newnote object
  const NewNote = {};
  if(title){NewNote.title = title};
  if(description){NewNote.description = description};
  if(tag){NewNote.tag = tag};

//Find the note to be updated and update it

let note = await Note.findById(req.params.id);
if(!note){
  return res.status(404).send("Not found")} 

if(note.user.toString() !== req.user.id){   //when the user acces another account 
  return res.status(401).send("NOT Allowed babu");
}

note = await Note.findByIdAndUpdate(req.params.id, {$set:NewNote}, {new:true})
res.json({note});


} catch (error) {
    
  console.error(error.message);
  res.status(500).send("Internal server Error");
}

})


//Route 4 : Delete notes using Delete : /api/notes/deletenote. login required
router.delete('/deletenote/:id',fetchuser, async (req,res)=>{

  try {
//Find the note to be delete and delete it

let note = await Note.findById(req.params.id);
if(!note){
  return res.status(404).send("Not found")} 

  //Allow deletion if user owns this Notes
if(note.user.toString() !== req.user.id){   //when the user acces another account 
  return res.status(401).send("NOT Allowed babu");
}

note = await Note.findByIdAndDelete(req.params.id)
res.json({"success" : "Note has been deleted", note:note});
   
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server Error");
}
})

module.exports = router