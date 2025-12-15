'use client';

import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableImage({ image }) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ? `transform 2000ms ease` : undefined, // 500ms instead of default
    cursor: 'grab',
    width: '100%',
    height: 120,
    objectFit: 'cover',
    borderRadius: 6,
  };
  return (
    <img
      ref={setNodeRef}
      src={image.url}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
}

export default function App() {
  const [images, setImages] = useState([]);

  const handleUpload = (e) => {
    const newImages = Array.from(e.target.files).map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages].slice(0, 4));
    e.target.value = ''; // allow re-upload same file
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    setImages((imgs) => {
      const oldIndex = imgs.findIndex((i) => i.id === active.id);
      const newIndex = imgs.findIndex((i) => i.id === over.id);
      return arrayMove(imgs, oldIndex, newIndex);
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <input type="file" multiple accept="image/*" onChange={handleUpload} />

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((i) => i.id)}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
              marginTop: 20,
            }}
          >
            {images.map((img) => (
              <SortableImage key={img.id} image={img} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
