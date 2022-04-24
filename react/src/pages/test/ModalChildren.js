import React, { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import { inputObjChange } from '../../commont tools/object';
import { filetoBase64 } from '../../commont tools/file';
import axios from 'axios';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { arrayMoveImmutable as arrayMove } from 'array-move';
import FlipToBackIcon from '@mui/icons-material/FlipToBack';
import DeleteIcon from '@mui/icons-material/Delete';

const RowHandler = SortableHandle(() => (
  <FlipToBackIcon style={{ position: 'absolute', top: 10, left: 10, cursor: 'pointer', zIndex: 1 }} />
));

const SortableItem = SortableElement(({ value, setData }) => (
  <div
    style={{
      position: 'relative',
      zIndex: 999999,
      background: '#eaeaea',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 120,
    }}
  >
    <RowHandler />
    {(() => {
      const img =
        value.type === 'uploaded' ? (
          <img
            key={value.uid}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            src={value.imageUrl}
          />
        ) : (
          <img
            key={value.uid}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            src={'/images/' + value.imageUrl}
          />
        );
      return (
        <div style={{ width: '100%', height: '100%' }}>
          {img}
          <DeleteIcon
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: 'white',
              color: 'red',
              borderRadius: '50%',
              padding: '4px',
              boxSizing: 'content-box',
              cursor: 'pointer',
            }}
            onClick={() => {
              if (!value.file) {
                setData((data) => {
                  const { checked = false, date, images, title, uid, deletedImages = [] } = data;
                  const newData = { checked, date, title, uid };

                  newData.images = images.filter((a) => a.uid !== value.uid);
                  newData.deletedImages = deletedImages || [];
                  newData.deletedImages.push(value.uid);
                  return newData;
                });
              } else
                return setData((data) => {
                  const newData = { ...data };
                  newData.images = newData.images.filter((a) => a.uid !== value.uid);
                  return newData;
                });
            }}
          />
        </div>
      );
    })()}
  </div>
));

const SortableList = SortableContainer(({ items, setData }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} setData={setData} />
      ))}
    </div>
  );
});

export default function ModalChildren(data, setData, open) {
  const fileInputRef = useRef();

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newItems = arrayMove(data.images, oldIndex, newIndex);
    setData((a) => ({ ...a, images: newItems }));
  };

  useEffect(() => {
    const { uid } = data;
    if (!uid || !open) return;
    selectImages(uid);
  }, [data?.uid, open]);

  const selectImages = async (uid) => {
    const {
      data: { data },
    } = await axios.get('/api/postimage/' + uid);
    data && setData((e) => ({ ...e, images: data }));
  };

  return (
    <div>
      <TextField
        fullWidth
        label="Title"
        id="filled-hidden-label-small"
        size="small"
        value={data.title}
        onChange={(e) => inputObjChange(e, 'title', setData)}
      />
      <br />
      <br />
      <TextField
        fullWidth
        type="datetime-local"
        label="Date"
        id="filled-hidden-label-small"
        size="small"
        value={data.date}
        onChange={(e) => inputObjChange(e, 'date', setData)}
      />
      <br />
      <br />
      <input
        type="file"
        ref={fileInputRef}
        multiple
        onChange={async (e) => {
          let { files } = e.target;
          files = [...files];
          const uploadedFiles = [];

          for (let file of files) {
            const x = await filetoBase64(file);
            uploadedFiles.push({
              uid: Math.random(),
              type: 'uploaded',
              imageUrl: x,
              file,
            });
          }

          setData((e) => ({ ...e, images: [...e.images, ...uploadedFiles] }));
          fileInputRef.current.value = '';
        }}
      />
      <br />
      <SortableList useDragHandle={true} axis="xy" items={data.images} onSortEnd={onSortEnd} setData={setData} />
    </div>
  );
}
