const router = require("express").Router();
const User = require("../models/user");
const Task = require("../models/task");
const { authToken } = require("./auth");

// CREATE_TASK
router.post("/create-task", authToken, async (req, res) => {
   try {
      const { title, desc } = req.body;
      const userId = req.userId;

      if (!title || !desc) {
         return res.status(400).json({ message: "Title and description are required" });
      }

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      // Create new task
      const newTask = new Task({ title, desc });
      const saveTask = await newTask.save();
      const taskId = saveTask._id;

      // Add task to user's tasks
      user.tasks.push(taskId);
      await user.save();

      // Send success response
      return res.status(200).json({ message: "Task created successfully", taskId });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
   }
});

//GET_ALL_TASKS
router.get("/get-all-tasks", authToken, async (req, res) => {
   try {
      const userId = req.userId; 

      const userData = await User.findById(userId).populate({
         path: "tasks",
         options: { sort: { createdAt: -1 } }
      });

      if (!userData) {
         return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ tasks: userData.tasks });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
   }
});

//DELETE_A_TASK
router.delete("/delete-task/:taskId", authToken, async (req, res) => {
   try {
      const userId = req.userId;
      const { taskId } = req.params;

      // Find the task
      const task = await Task.findById(taskId);
      if (!task) {
         return res.status(404).json({ message: "Task not found" });
      }

      // Check if the task belongs to the authenticated user
      const user = await User.findById(userId);
      if (!user.tasks.includes(taskId)) {
         return res.status(400).json({ message: "Unauthorized to delete this task" });
      }

      // Delete the task
      await Task.findByIdAndDelete(taskId);

      // Remove the task reference from the user's task list
      user.tasks.pull(taskId);
      await user.save();

      return res.status(200).json({ message: "Task deleted successfully" });
   } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Internal Server Error" });
   }
});

//UPDATE_A_TASK
router.put("/update-task/:taskId", authToken, async (req, res) => {
   try {
      const userId = req.userId;
      const { taskId } = req.params; 
      const { title, desc } = req.body; 

      // Find the task
      const task = await Task.findById(taskId);
      if (!task) {
         return res.status(404).json({ message: "Task not found" });
      }

      // Check if the task belongs to the authenticated user
      const user = await User.findById(userId);
      if (!user.tasks.includes(taskId)) {
         return res.status(400).json({ message: "Unauthorized to update this task" });
      }

      // Update the task
      if (title) task.title = title;
      if (desc) task.desc = desc;
      const updatedTask = await task.save();

      return res.status(200).json({ message: "Task updated successfully", task: updatedTask });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
   }
});

//UPDATE_IMP_TASK
router.put("/add-imp-task/:taskId", authToken, async (req, res) => {
   try {
      const userId = req.userId;
      const { taskId } = req.params; 

      // Find the task
      const task = await Task.findById(taskId);
      if (!task) {
         return res.status(404).json({ message: "Task not found" });
      }

      // Check if the task belongs to the authenticated user
      const user = await User.findById(userId);
      if (!user.tasks.includes(taskId)) {
         return res.status(403).json({ message: "Unauthorized to modify this task" });
      }

      // Mark the task as important
      task.imp = true;
      await task.save();

      return res.status(200).json({ message: "Task marked as important successfully" });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
   }
});

//UPDATE_COMP_TASK
router.put("/add-comp-task/:taskId", authToken, async (req, res) => {
   try {
      const userId = req.userId;
      const { taskId } = req.params; 

      // Find the task
      const task = await Task.findById(taskId);
      if (!task) {
         return res.status(404).json({ message: "Task not found" });
      }

      // Check if the task belongs to the authenticated user
      const user = await User.findById(userId);
      if (!user.tasks.includes(taskId)) {
         return res.status(403).json({ message: "Unauthorized to modify this task" });
      }

      // Mark the task as important
      task.comp = true;
      await task.save();

      return res.status(200).json({ message: "Task completed successfully" });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
   }
});

//GET_IMP_TASKS
router.get("/get-imp-task", authToken, async (req, res) => {
   try {
      const userId = req.userId; 

      const userData = await User.findById(userId).populate({
         path: "tasks",
         match: {imp: true},
         options: { sort: { createdAt: -1 } }
      });

      if (!userData) {
         return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ tasks: userData.tasks });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
   }
});

//GET_COMP_TASKS
router.get("/get-comp-task", authToken, async (req, res) => {
   try {
      const userId = req.userId; 

      const userData = await User.findById(userId).populate({
         path: "tasks",
         match: {comp: true},
         options: { sort: { createdAt: -1 } }
      });

      if (!userData) {
         return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ tasks: userData.tasks });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
   }
});

//GET_INCOMP_TASKS
router.get("/get-incomp-task", authToken, async (req, res) => {
   try {
      const userId = req.userId; 

      const userData = await User.findById(userId).populate({
         path: "tasks",
         match: {comp: false},
         options: { sort: { createdAt: -1 } }
      });

      if (!userData) {
         return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ tasks: userData.tasks });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
   }
});
module.exports = router;
