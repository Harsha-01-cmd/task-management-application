import React, { useState, useEffect } from "react";
import Cards from "../components/home/Cards";
import axios from "axios";

const CompTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const storedTasks = JSON.parse(localStorage.getItem("compTasks"));
        if (storedTasks) {
          setTasks(storedTasks);
        } else {
          const headers = { authorization: `Bearer ${localStorage.getItem("token")}` };
          const response = await axios.get("http://localhost:1000/api/v1/get-comp-task", { headers });
          setTasks(response.data.tasks);
          localStorage.setItem("compTasks", JSON.stringify(response.data.tasks));
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const updateTaskStatus = async (taskId, status) => {
    try {
      const headers = { authorization: `Bearer ${localStorage.getItem("token")}` };
      const response = await axios.put(`http://localhost:1000/api/v1/update-task-status/${taskId}`, { status }, { headers });

      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? { ...task, status: status === 'imp' ? "Important" : "Complete" } : task
      );
      setTasks(updatedTasks);

      localStorage.setItem("compTasks", JSON.stringify(updatedTasks));

      return response.data;
    } catch (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const headers = { authorization: `Bearer ${localStorage.getItem("token")}` };
      await axios.delete(`http://localhost:1000/api/v1/delete-task/${taskId}`, { headers });

      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem("compTasks", JSON.stringify(updatedTasks));
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

export default CompTasks;
