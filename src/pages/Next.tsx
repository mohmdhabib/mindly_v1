import React, { useState, useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import StickyNote from '@/components/StickyNote';
import './Next.css';

const NextPage: React.FC = () => {
  const [notes, setNotes] = useState<{ id: number; content: string; color: string; position: { x: number; y: number } }[]>([]);

  const [transformState, setTransformState] = useState({ scale: 1, positionX: 0, positionY: 0 });
  const [minScale, setMinScale] = useState(0.02);
  const [initialScale, setInitialScale] = useState(0.02);
  const transformRef = useRef<any>(null);

  // Canvas size
  const CANVAS_WIDTH = 8000;
  const CANVAS_HEIGHT = 6000;

  // Calculate minScale and initialScale so the canvas fits the viewport at 2% or the exact fit
  const calculateFitScale = () => {
    const fitScale = Math.min(
      window.innerWidth / CANVAS_WIDTH,
      window.innerHeight / CANVAS_HEIGHT
    );
    return Math.max(0.02, fitScale);
  };

  useEffect(() => {
    const fitScale = calculateFitScale();
    setMinScale(fitScale);
    setInitialScale(fitScale);
    // Center the canvas on mount and resize
    if (transformRef.current && transformRef.current.setTransform) {
      const x = (window.innerWidth - CANVAS_WIDTH * fitScale) / 2;
      const y = (window.innerHeight - CANVAS_HEIGHT * fitScale) / 2;
      transformRef.current.setTransform(x, y, fitScale);
    }
    const handleResize = () => {
      const newFitScale = calculateFitScale();
      setMinScale(newFitScale);
      setInitialScale(newFitScale);
      if (transformRef.current && transformRef.current.setTransform) {
        const x = (window.innerWidth - CANVAS_WIDTH * newFitScale) / 2;
        const y = (window.innerHeight - CANVAS_HEIGHT * newFitScale) / 2;
        transformRef.current.setTransform(x, y, newFitScale);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addNote = () => {
    const colors = ['#FFFF99', '#FF9999', '#99FF99', '#99FFFF', '#FF99FF'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Get the canvas element
    const canvas = document.querySelector('.infinite-canvas');
    const rect = canvas?.getBoundingClientRect();
    
    if (!rect) return;
    
    // Calculate the visible center of the canvas
    const visibleCenterX = (-transformState.positionX + window.innerWidth / 2) / transformState.scale;
    const visibleCenterY = (-transformState.positionY + window.innerHeight / 2) / transformState.scale;
    
    const newNote = { 
      id: Date.now(), 
      content: '', 
      color: randomColor,
      position: { 
        x: visibleCenterX - 125, // Center horizontally
        y: visibleCenterY - 100  // Center vertically
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
      note.id === id ? { ...note, position: { 
        x: Math.max(0, Math.min(x, 7750)), // Keep within canvas bounds (8000 - 250)
        y: Math.max(0, Math.min(y, 5800))  // Keep within canvas bounds (6000 - 200)
      }} : note
    );
    setNotes(newNotes);
  };

  return (
    <div className="next-page">
      <TransformWrapper
        ref={transformRef}
        initialScale={initialScale}
        minScale={minScale}
        maxScale={2}
        centerOnInit={false}
        limitToBounds={true}
        wheel={{ step: 0.1 }}
        pinch={{ disabled: false }}
        doubleClick={{ disabled: true }}
        panning={{ excluded: ['notion-card'] }}
        onTransformed={(_, state) => {
          setTransformState({
            scale: state.scale,
            positionX: state.positionX,
            positionY: state.positionY
          });
        }}
      >
        {({ zoomIn, zoomOut, resetTransform, setTransform }) => (
          <>
            <div className="zoom-controls">
              <button onClick={() => zoomOut()} className="zoom-btn">−</button>
              <div className="zoom-level" onClick={() => resetTransform()}>
                {Math.round(transformState.scale * 100)}%
              </div>
              <button onClick={() => zoomIn()} className="zoom-btn">+</button>
              <button
                className="zoom-fit-btn"
                onClick={() => {
                  const fitScale = calculateFitScale();
                  const x = (window.innerWidth - CANVAS_WIDTH * fitScale) / 2;
                  const y = (window.innerHeight - CANVAS_HEIGHT * fitScale) / 2;
                  setTransform(x, y, fitScale);
                }}
              >
                Fit
              </button>
            </div>
            <TransformComponent
              wrapperClass="canvas-wrapper"
              contentClass="notes-container"
            >
              <div
                className="infinite-canvas"
                style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
              >
                <div className="canvas-content">
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
