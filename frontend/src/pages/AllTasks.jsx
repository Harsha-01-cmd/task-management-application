import React, { useState, useEffect } from "react";
import Cards from "../components/home/Cards";
import InputData from "../components/home/InputData";
import axios from "axios";

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [inputDiv, setInputDiv] = useState("hidden");
  const [currentTask, setCurrentTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const headers = { authorization: `Bearer ${localStorage.getItem("token")}` };
        const response = await axios.get("http://localhost:1000/api/v1/get-all-tasks", { headers });
        if (response.data.tasks) {
          setTasks(response.data.tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const updateTaskStatus = async (taskId, status) => {
    try {
      const endpoint = status === "imp" ? `/add-imp-task/${taskId}` : `/add-comp-task/${taskId}`;
      const headers = { authorization: `Bearer ${localStorage.getItem("token")}` };
      const response = await axios.put(`http://localhost:1000/api/v1${endpoint}`, {}, { headers });
      
      // Update the tasks state
      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? { ...task, status: status === "imp" ? "Important" : "Complete" } : task
      );
      setTasks(updatedTasks);

      if (status === "imp") {
        const impTasks = JSON.parse(localStorage.getItem("impTasks")) || [];
        localStorage.setItem("impTasks", JSON.stringify([...impTasks, ...updatedTasks.filter(task => task._id === taskId)]));
      } else if (status === "comp") {
        const compTasks = JSON.parse(localStorage.getItem("compTasks")) || [];
        localStorage.setItem("compTasks", JSON.stringify([...compTasks, ...updatedTasks.filter(task => task._id === taskId)]));
      }
      alert(response.data.message);
      return response.data; 
    } catch (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  };
  

  const editTask = (task) => {
    setCurrentTask(task);
    setInputDiv("fixed");
  };

  const handleEditTask = async (taskId, title, desc) => {
    try {
      const headers = { authorization: `Bearer ${localStorage.getItem("token")}` };
      await axios.put(`http://localhost:1000/api/v1/update-task/${taskId}`, { title, desc }, { headers });

      setTasks(tasks.map((task) =>
        task._id === taskId ? { ...task, title, desc } : task
      ));
      setCurrentTask(null);
      setInputDiv("hidden");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const addTask = async (title, desc) => {
    try {
      const headers = { authorization: `Bearer ${localStorage.getItem("token")}` };
      const response = await axios.post(`http://localhost:1000/api/v1/create-task`, { title, desc }, { headers });

      if (response.data.task) {
        setTasks([response.data.task, ...tasks]);
      }
      setInputDiv("hidden");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const headers = { authorization: `Bearer ${localStorage.getItem("token")}` };
      await axios.delete(`http://localhost:1000/api/v1/delete-task/${taskId}`, { headers });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleSubmit = (taskId, title, desc) => {
    if (taskId) {
      handleEditTask(taskId, title, desc);
    } else {
      addTask(title, desc);
    }
  };

  return (
    <div>
      <Cards
        tasks={tasks}
        home={true}
        setInputDiv={setInputDiv}
        onStatusChange={updateTaskStatus}
        onEdit={editTask}
        onDelete={deleteTask}
      />
      <InputData
        inputDiv={inputDiv}
        setInputDiv={setInputDiv}
        task={currentTask}
        onSubmit={handleSubmit}
        isEditing={!!currentTask}
      />
    </div>
  );
};

export default AllTasks;
