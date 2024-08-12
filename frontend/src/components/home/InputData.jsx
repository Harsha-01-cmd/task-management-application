import React, { useState, useEffect } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const InputData = ({ inputDiv, setInputDiv, task, onSubmit, isEditing }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDesc(task.desc);
    } else {
      setTitle('');
      setDesc('');
    }
  }, [task]);

  const handleSubmit = () => {
    onSubmit(task ? task._id : null, title, desc); 
  };

  return (
    <>
      <div className={`${inputDiv} fixed top-0 left-0 bg-gray-800 opacity-70 h-screen w-full`}></div>
      <div className={`${inputDiv} fixed top-0 left-0 h-screen w-full flex items-center justify-center`}>
        <div className="w-2/6 bg-gray-900 h-[60vh] p-4 rounded flex flex-col justify-around items-center">
          <button onClick={() => setInputDiv("hidden")} className="w-full flex justify-end mb-2 text-gray-600">
            <AiOutlineCloseCircle />
          </button>
          <input
            type="text"
            placeholder="Title of Task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-5 py-2 w-full rounded bg-gray-200 text-gray-900"
          />
          <textarea
            cols="30"
            rows="8"
            placeholder="Description of Task"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="px-5 py-2 w-full rounded bg-gray-200 text-gray-900"
          />
          <button onClick={handleSubmit} className="px-3 py-2 rounded bg-gray-700 my-3">
            {isEditing ? "Update Task" : "Add Task"}
          </button>
        </div>
      </div>
    </>
  );
};

export default InputData;


