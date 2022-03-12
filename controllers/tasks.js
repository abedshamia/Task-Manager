const {connection} = require('../db/connect');
function createError(err, res) {
  return res.status(500).json(err);
}

const getAllTasks = async (req, res) => {
  try {
    const tasks = await connection.query('SELECT * FROM tasks');
    res.status(200).json({status: 'success', tasks: tasks.rows});
  } catch (error) {
    createError(error, res);
  }
};

const createTask = async (req, res) => {
  const {name} = req.body;

  try {
    if (!name) {
      return res
        .status(400)
        .json({status: 'error', message: 'Please provide all required fields'});
    }

    const newTask = await connection.query(
      'INSERT INTO tasks (name) VALUES ($1) RETURNING *',
      [name]
    );

    if (newTask) {
      res.status(201).json({
        status: 'success',
        message: 'Task created successfully',
        task: newTask.rows[0],
      });
    } else {
      createError(error, res);
    }
  } catch (error) {
    createError(error, res);
  }
};

const getTask = async (req, res) => {
  const {id} = req.params;
  const task = await connection.query('SELECT * FROM tasks where id = $1', [id]);
  if (!task.rows[0]) {
    return res.status(404).json({status: 'error', message: 'Task not found'});
  } else {
    res.status(200).json({status: 'success', task: task.rows[0]});
  }
};

const updateTask = async (req, res) => {
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

  try {
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
      createError(error, res);
    }
  } catch (error) {
    createError(error, res);
  }
};

const deleteTask = async (req, res) => {
  const {id} = req.params;
  const deleteTask = await connection.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [
    id,
  ]);

  //check if task exists
  if (!deleteTask.rows[0]) {
    return res.status(404).json({status: 'error', message: 'Task not found'});
  } else {
    res.status(200).json({status: 'success', message: 'Task deleted successfully'});
  }
};

module.exports = {getAllTasks, createTask, getTask, updateTask, deleteTask};
