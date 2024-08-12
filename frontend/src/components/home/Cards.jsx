import React from "react";
import { FaHeart } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";

const Cards = ({ tasks, home, setInputDiv, onStatusChange, onEdit, onDelete }) => {
  const handleStatusChange = async (taskId, status) => {
    try {
      await onStatusChange(taskId, status);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleUpdate = (taskId) => {
    const task = tasks.find((task) => task._id === taskId);
    onEdit(task);
  };

  const handleDelete = async (taskId) => {
    try {
      await onDelete(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {tasks.map((item) => (
        <div key={item._id} className="border border-zinc-900 rounded-xl p-4 bg-gray-800">
          <h2 className="text-xl font-semibold">{item.title || "Untitled Task"}</h2>
          <p className="text-xs mb-3">{item.desc || "No description"}</p>
          <div className="flex flex-row justify-between gap-2">
            {/* <div className={`status ${item.status === "Complete" ? "bg-green-400" : item.status === "Important" ? "bg-red-400" : "bg-gray-400"} text-gray-700 border border-none py-1 px-2 rounded`}>
              {item.status}
            </div> */}
            <div className="flex flex-row justify-between gap-2">
              <button className={`hover:text-red-700 ${item.status === "Important" ? "text-red-700" : ""}`} onClick={() => handleStatusChange(item._id, 'imp')}>
                <FaHeart />
              </button>
              <button className={`hover:text-green-700 ${item.status === "Complete" ? "text-green-700" : ""}`} onClick={() => handleStatusChange(item._id, 'comp')}>
                <TiTick />
              </button>
              <button className="hover:text-blue-700" onClick={() => handleUpdate(item._id)}>
                <MdEdit />
              </button>
              <button className="hover:text-gray-700" onClick={() => handleDelete(item._id)}>
                <MdDelete />
              </button>
            </div>
          </div>
        </div>
      ))}
      {home && (
        <button
          onClick={() => setInputDiv("fixed")}
          className="border border-zinc-900 rounded-xl bg-gray-800 text-6xl flex justify-center items-center text-gray-400 hover:scale-105 hover:cursor-pointer transition-all duration-300"
        >
          <IoAddCircleOutline />
        </button>
      )}
    </div>
  );
};

export default Cards;


