import React, { useState, useRef, useEffect } from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider, useDispatch, useSelector } from 'react-redux';
import './App.css';

const ADD_NOTE = 'ADD_NOTE';
const UPDATE_NOTE = 'UPDATE_NOTE';
const DELETE_NOTE = 'DELETE_NOTE';

const addNote = (note) => ({ type: ADD_NOTE, payload: note });
const updateNote = (index, note) => ({ type: UPDATE_NOTE, payload: { index, note } });
const deleteNote = (index) => ({ type: DELETE_NOTE, payload: { index } });

const notesReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_NOTE:
      return [...state, action.payload];
    case UPDATE_NOTE:
      const updatedNotes = [...state];
      updatedNotes[action.payload.index] = action.payload.note;
      return updatedNotes;
    case DELETE_NOTE:
      return state.filter((note, index) => index !== action.payload.index);
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  notes: notesReducer,
});

const store = createStore(rootReducer);

function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes);

  const [content, setContent] = useState({ title: '', description: '' });
  const [editIndex, setEditIndex] = useState(null);

  const titleInputRef = useRef();

  useEffect(() => {
    titleInputRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.title && content.description) {
      if (editIndex !== null) {
        dispatch(updateNote(editIndex, content));
        setEditIndex(null);
      } else {
        dispatch(addNote(content));
      }
      setContent({ title: '', description: '' });
    }
  };

  const handleEdit = (index) => {
    setContent(notes[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    dispatch(deleteNote(index));
  };

  return (
    <div className='container-f'>
      <div id='addnote' className='mt-5 container rounded-3 d-flex flex-column mx-auto'>
        <form className='d-flex flex-column' onSubmit={handleSubmit}>
          <h1 className='text-center mt-3'>{editIndex !== null ? 'Edit Note' : 'Add a Note'}</h1>
          <input
            type='text'
            placeholder='Title'
            className='m-2 outline'
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            ref={titleInputRef}
          />
          <textarea
            type='text'
            placeholder='Take a note...'
            rows={4}
            className='m-2'
            value={content.description}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
          />
          <button
            id='btn'
            onClick={handleSubmit}
            className='rounded-2 mx-auto mb-3 bg-success text-white mt-2'
          >
            {editIndex !== null ? 'Update Note' : 'Add Note'}
          </button>
        </form>
      </div>

      <div className={`d-flex flex-wrap mt-5 ${notes.length > 2 ? 'justify-content-around' : 'mx-3'}`}>
        {notes.map((note, index) => (
          <div key={index} id='mynotes' className='m-4 container rounded-3 d-flex flex-column bg-light'>
            <div className='title-container d-flex justify-content-between align-items-center'>
              <h2 className='mt-3'>{note.title}</h2>
              <div className='icons-container'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='mx-1'
                  onClick={() => handleEdit(index)}
                  width='1em'
                  height='1em'
                  viewBox='0 0 24 24'
                >
                  <g fill='none' stroke='currentColor' strokeWidth='2'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M4.333 16.048L16.57 3.81a2.56 2.56 0 0 1 3.62 3.619L7.951 19.667a2 2 0 0 1-1.022.547L3 21l.786-3.93a2 2 0 0 1 .547-1.022'
                    />
                    <path d='m14.5 6.5l3 3' />
                  </g>
                </svg>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='mx-1'
                  onClick={() => handleDelete(index)}
                  width='1em'
                  height='1em'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 6h16l-1.58 14.22A2 2 0 0 1 16.432 22H7.568a2 2 0 0 1-1.988-1.78zm3.345-2.853A2 2 0 0 1 9.154 2h5.692a2 2 0 0 1 1.81 1.147L18 6H6zM2 6h20m-12 5v5m4-5v5'
                  />
                </svg>
              </div>
            </div>
            {editIndex === index ? (
              <>
                <input
                  type='text'
                  placeholder='Title'
                  className='m-2 outline'
                  value={content.title}
                  onChange={(e) => setContent({ ...content, title: e.target.value })}
                />
                <textarea
                  type='text'
                  placeholder='Take a note...'
                  rows={4}
                  className='m-2'
                  value={content.description}
                  onChange={(e) => setContent({ ...content, description: e.target.value })}
                />
                <button
                  id='btn'
                  onClick={handleSubmit}
                  className='rounded-2 mx-auto mb-3 bg-secondary text-white'
                >
                  Update Note
                </button>
              </>
            ) : (
              <p>{note.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppWrapper;
