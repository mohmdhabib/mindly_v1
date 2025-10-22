import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import StickyNote from '@/components/StickyNote';
import './Next.css';

const NextPage: React.FC = () => {
  const [notes, setNotes] = useState<{ id: number; content: string; color: string; position: { x: number; y: number } }[]>([]);

  const addNote = () => {
    const colors = ['#FFFF99', '#FF9999', '#99FF99', '#99FFFF', '#FF99FF'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    // Calculate position based on viewport center
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const newNote = { 
      id: Date.now(), 
      content: '', 
      color: randomColor,
      position: { 
        x: centerX - 125, // Half of note width
        y: centerY - 100  // Half of note height
      }
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id: number, newContent: string) => {
    const newNotes = notes.map((note) =>
      note.id === id ? { ...note, content: newContent } : note
    );
    setNotes(newNotes);
  };

  const deleteNote = (id: number) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
  };

  const updatePosition = (id: number, x: number, y: number) => {
    const newNotes = notes.map((note) =>
      note.id === id ? { ...note, position: { x, y } } : note
    );
    setNotes(newNotes);
  };

  return (
    <div className="next-page">
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={2}
        centerOnInit={true}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="zoom-controls">
              <button onClick={() => zoomIn()}>+</button>
              <button onClick={() => zoomOut()}>-</button>
              <button onClick={() => resetTransform()}>Reset</button>
            </div>
            <TransformComponent wrapperClass="canvas-wrapper" contentClass="notes-container">
              <div className="infinite-canvas">
                {notes.map((note) => (
                  <StickyNote
                    key={note.id}
                    index={note.id}
                    content={note.content}
                    initialColor={note.color}
                    position={note.position}
                    onChange={updateNote}
                    onDelete={deleteNote}
                    onPositionChange={updatePosition}
                  />
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
      <div className="add-note-button" onClick={addNote}>+</div>
    </div>
  );
};

export default NextPage;
