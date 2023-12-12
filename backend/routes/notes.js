const express = require('express');
const router = express.Router();
const fetchuser = require("../middleware/fetchuser")
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

//Route 1: Get All the notes using Get "/api/notes/getuser":Login required;


router.get("/fetchallnotes", fetchuser, async (req, res) => {

    try {
        const notes = await Note.find({ user: req.user.id });
        // console.log(notes)
        res.json(notes)

    }
    catch (error) {
        console.log({ error: error.message });
        res.status(500).send("internal server error")

    }


})


//Route 2:Add a new Note using Post "/api/notes/addnote":Login required;


router.post("/addnote", fetchuser, [
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', "Description must be atleast five characters").isLength({ min: 5 })
], async (req, res) => {

    try {
        const { title, description, tag } = req.body;
        //  If there are errors,return bad request and the errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        // console.log("user>>>>>>>>>>>>",{user: req.user.id})
        // console.log("note>>>>>>>>>>>>",note)
        const saveNote = await note.save()
        // console.log("Savenote>>>>>>>>>>>>",saveNote)
        res.json(saveNote)




    }

    catch (error) {
        console.log({ error: error.message });
        res.status(500).send("internal server error")

    }

})

//Route 3:Update an existing Note using: Put "/api/notes/updatenote":Login required;
router.put("/updatenote/:id", fetchuser,async (req,res)=>{
const {title,description,tag}=req.body;

try {
    
// Create a newNote object
const newNote={};
if(title){newNote.title=title}
if(description){newNote.description=description}
if(tag){newNote.tag=tag}

// Find the note to be updated and update it

let note=await Note.findById(req.params.id);
 if(!note){ return res.status(404).send("Not Found")};
// console.log("user>>>>",note)
// console.log("note.user.toString()>>>>",note.user.toString())
// console.log("req.user.id>>>>",req.user.id)
 if(note.user.toString() !==req.user.id){
    return res.status(401).send("Not allowed")
 }

 note= await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})

res.json({note});

}catch (error) {
    console.log({ error: error.message });
    res.status(500).send("internal server error")

}




} )




//Route 4:Delete an existing Note using: Delete "/api/notes/delete":Login required;
router.delete("/deletenote/:id", fetchuser,async (req,res)=>{
    
    try {
        



       // Find the note to be delete and delete it
    
       let note=await Note.findById(req.params.id);
       if(!note){ return res.status(404).send("Not Found")};
  
  
       // Allow deletion only if user owns this Note
  
       if(note.user.toString() !==req.user.id){
          return res.status(401).send("Not allowed")
       }
  
       note= await Note.findByIdAndDelete(req.params.id)
    //   console.log("deletr>>>>",note)
      res.json({"Success":"Note has been Deleted",note:note}); 
} 
 catch (error) {
    console.log({ error: error.message });
    res.status(500).send("internal server error")

}
    
    } )



module.exports = router;