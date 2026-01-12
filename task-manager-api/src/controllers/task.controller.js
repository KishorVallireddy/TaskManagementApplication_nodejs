const Task = require("../models/task.model");

exports.createTask = async (req, res) => {
  await Task.create({ ...req.body, userId: req.user.userId });
  res.status(201).json({ message: "Task created" });
};

exports.getTasks = async (req, res) => {
  try {
    let filter = {};

    // ✅ If user is NOT Admin → restrict to own tasks
    if (req.user.role !== "Admin") {
      filter.userId = req.user.userId;
    }

    // Optional filters
    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    const tasks = await Task.find(filter).populate("userId", "username role");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ❌ User cannot edit others' tasks
    if (
      req.user.role !== "Admin" &&
      task.userId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
};
