import React, { useContext, useEffect, useRef, useState } from 'react'
import NoteContext from '../contex/notes/noteContext';
import NoteItem from './NoteItem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {

    const navigate=useNavigate();
    const context = useContext(NoteContext);
    const { notes, getNotes, editNote } = context;
    const ref = useRef(null);
    const refclose = useRef(null);

    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "default" })
    const handleClick = (e) => {
        editNote(note.id, note.etitle, note.edescription, note.etag);

        console.log(note.id, note.etitle, note.edescription, note.etag)
        refclose.current.click();
        props.showAlert("Note Updated successfully","success");

    }
    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }




    useEffect(() => {
if(localStorage.getItem('token')){
    
    getNotes();
}
else{
    navigate("/login")
}

        // eslint-disable-next-line
    }, []);

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
    }


    return (

        <>
            <AddNote showAlert={props.showAlert} />

            <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className='my-3'>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" aria-describedby="emailHelp" onChange={onChange} value={note.etitle} 
                                    minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label" >Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" onChange={onChange} value={note.edescription} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label" >Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" onChange={onChange} value={note.etag} />
                                </div>


                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refclose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={note.etitle.length<5 || note.edescription.length<5} type="button" className="btn btn-primary" onClick={handleClick}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row my-3">
                <h2>Your Notes</h2>

                <div className="container  ">
                {notes.length === 0 && "No Notes to Display"}
                </div>
                   
                {notes.map((note) => {
                    return <NoteItem note={note} updateNote={updateNote} key={note._id} showAlert={props.showAlert} />
                })}
            </div>


        </>
    )
}

export default Notes;


