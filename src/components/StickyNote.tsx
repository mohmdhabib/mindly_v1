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
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setNoteContent(newContent);
    onChange(index, newContent);
  };

  const handleColorChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    const colors = ['#FFFF99', '#FF9999', '#99FF99', '#99FFFF', '#FF99FF'];
    const newColor = colors[(colors.indexOf(color) + 1) % colors.length];
    setColor(newColor);
  };

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    if (!isDragging) return;
    onPositionChange(index, data.x, data.y);
  };

  const onStart = (e: DraggableEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const onStop = (e: DraggableEvent, data: DraggableData) => {
    e.stopPropagation();
    setIsDragging(false);
    onPositionChange(index, data.x, data.y);
  };

  return (
    <Draggable
      position={position}
      onStop={onStop}
      onStart={onStart}
      onDrag={handleDrag}
      grid={[20, 20]} // Snap to grid for better organization
      bounds="parent"
      handle=".drag-handle"
    >
      <div className="notion-card" style={{ backgroundColor: color }}>
        <div className="notion-card-header drag-handle">
          <button className="delete-button" onClick={(e) => { e.stopPropagation(); onDelete(index); }}>×</button>
          <button className="color-button" onClick={handleColorChange}>🎨</button>
        </div>
        <textarea
          value={noteContent}
          onChange={handleChange}
          className="notion-card-textarea"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </Draggable>
  );
};

export default StickyNote;