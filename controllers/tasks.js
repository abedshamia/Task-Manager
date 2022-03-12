const {connection} = require('../db/connect');
const asyncWrapper = require('../middleware/async');
const {createCustomError} = require('./../errors/custom-error');

// function createError(err, res, status) {
//   const error = new Error(err);
//   error.status = status;
//   res.status(status).json({
//     status: 'error',
//     message: error.message,
//   });
// }

const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await connection.query('SELECT * FROM tasks');
  res.status(200).json({status: 'success', amount: tasks.rows.length, tasks: tasks.rows});
});

const createTask = asyncWrapper(async (req, res) => {
  const {name} = req.body;
  if (!name) {
    return next(createCustomError('Name is required', 400));
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
    return next(createCustomError('Task not created', 400));
  }
});

const getTask = asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const task = await connection.query('SELECT * FROM tasks where id = $1', [id]);
  if (!task.rows[0]) {
    return next(createCustomError('Task not found', 404));
  } else {
    res.status(200).json({status: 'success', task: task.rows[0]});
  }
});

const updateTask = asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const incomingTask = await connection.query('SELECT * FROM tasks where id = $1', [id]);
  if (!incomingTask.rows[0]) {
    return next(createCustomError('Task not found', 404));
  }

  const {name, completed, description} = incomingTask.rows[0];
  const {name: newName, completed: newCompleted, description: newDescription} = req.body;

  if (!newName && !newCompleted) {
    return next(createCustomError('Name or completed is required', 400));
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
    return next(createCustomError('Task not updated', 400));
  }
});

const deleteTask = asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const deleteTask = await connection.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [
    id,
  ]);
  if (!deleteTask.rows[0]) {
    next(createCustomError('Task not found', 404));
  } else {
    res.status(200).json({status: 'success', message: 'Task deleted successfully'});
  }
});

module.exports = {getAllTasks, createTask, getTask, updateTask, deleteTask};
