import React, { useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import './StickyNote.css';

interface StickyNoteProps {
  content: string;
  index: number;
  onChange: (id: number, newContent: string) => void;
  onDelete: (id: number) => void;
  onPositionChange: (id: number, x: number, y: number) => void;
  initialColor?: string;
  position: { x: number; y: number };
}

const StickyNote: React.FC<StickyNoteProps> = ({ 
  content, 
  index, 
  onChange, 
  onDelete, 
  onPositionChange,
  initialColor = '#FFFF99',
  position 
}) => {
  const [noteContent, setNoteContent] = useState(content);
  const [color, setColor] = useState(initialColor);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setNoteContent(newContent);
    onChange(index, newContent);
  };

  const handleColorChange = () => {
    const colors = ['#FFFF99', '#FF9999', '#99FF99', '#99FFFF', '#FF99FF'];
    const newColor = colors[(colors.indexOf(color) + 1) % colors.length];
    setColor(newColor);
  };

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    onPositionChange(index, data.x, data.y);
  };

  return (
    <Draggable
      position={position}
      onStop={handleDrag}
      bounds=".canvas-boundary"
      grid={[10, 10]} // Snap to grid for better organization
    >
      <div className="notion-card" style={{ backgroundColor: color }}>
        <div className="notion-card-header">
          <button className="delete-button" onClick={() => onDelete(index)}>X</button>
          <button className="color-button" onClick={handleColorChange}>🎨</button>
        </div>
        <textarea
          value={noteContent}
          onChange={handleChange}
          className="notion-card-textarea"
        />
      </div>
    </Draggable>
  );
};

export default StickyNote;