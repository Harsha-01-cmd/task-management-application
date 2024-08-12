import React, { useState, useEffect } from "react";
import Cards from "../components/home/Cards";
import axios from "axios";

const ImpTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const storedTasks = JSON.parse(localStorage.getItem("impTasks"));
        if (storedTasks) {
          setTasks(storedTasks);
        } else {
          const headers = { authorization: `Bearer ${localStorage.getItem("token")}` };
          const response = await axios.get("http://localhost:1000/api/v1/get-imp-task", { headers });
          setTasks(response.data.tasks);
          localStorage.setItem("impTasks", JSON.stringify(response.data.tasks));
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const updateTaskStatus = async (taskId, field) => {
    try {
      const headers = { authorization: `Bearer ${localStorage.getItem("token")}` };
      await axios.put(`http://localhost:1000/api/v1/update-task-status/${taskId}`, { [field]: true }, { headers });
      const updatedTasks = tasks.map((task) => (task._id === taskId ? { ...task, [field]: true } : task));
      setTasks(updatedTasks);
      localStorage.setItem("impTasks", JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const headers = { authorization: `Bearer ${localStorage.getItem("token")}` };
      await axios.delete(`http://localhost:1000/api/v1/delete-task/${taskId}`, { headers });
      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem("impTasks", JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div>
      <Cards tasks={tasks} onStatusChange={updateTaskStatus} onDelete={deleteTask} />
    </div>
  );
};

export default ImpTasks;
