const {connection} = require('../db/connect');
const asyncWrapper = require('../middleware/async');

function createError(err, res, status) {
  return res.status(status).json(err);
}

const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await connection.query('SELECT * FROM tasks');
  res.status(200).json({status: 'success', amount: tasks.rows.length, tasks: tasks.rows});
});

const createTask = asyncWrapper(async (req, res) => {
  const {name} = req.body;
  if (!name) {
    return res
      .status(400)
      .json({status: 'error', message: 'Please provide all required fields'});
  }

  const newTask = await connection.query('INSERT INTO tasks (name) VALUES ($1) RETURNING *', [
    name,
  ]);

  if (newTask) {
    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      task: newTask.rows[0],
    });
  } else {
    createError(error, res, 500);
  }
});

const getTask = asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const task = await connection.query('SELECT * FROM tasks where id = $1', [id]);
  if (!task.rows[0]) {
    return res.status(404).json({status: 'error', message: 'Task not found'});
  } else {
    res.status(200).json({status: 'success', task: task.rows[0]});
  }
});

const updateTask = asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const incomingTask = await connection.query('SELECT * FROM tasks where id = $1', [id]);
  if (!incomingTask.rows[0]) {
    return res.status(404).json({status: 'error', message: 'Task not found'});
  }

  const {name, completed, description} = incomingTask.rows[0];
  const {name: newName, completed: newCompleted, description: newDescription} = req.body;

  if (!newName && !newCompleted && !newDescription) {
    return res.status(400).json({status: 'error', message: 'Please provide a field'});
  }

  const updatedTask = {
    name: newName || name,
    completed: newCompleted || completed,
    description: newDescription || description,
  };

  const updateTask = await connection.query(
    'UPDATE tasks SET name = $1, completed = $2, description = $3 WHERE id = $4 RETURNING *',
    [updatedTask.name, updatedTask.completed, updatedTask.description, id]
  );

  if (updateTask) {
    res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      task: updateTask.rows[0],
    });
  } else {
    createError(error, res, 500);
  }
});

const deleteTask = asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const deleteTask = await connection.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [
    id,
  ]);
  if (!deleteTask.rows[0]) {
    return res.status(404).json({status: 'error', message: 'Task not found'});
  } else {
    res.status(200).json({status: 'success', message: 'Task deleted successfully'});
  }
});

module.exports = {getAllTasks, createTask, getTask, updateTask, deleteTask};
