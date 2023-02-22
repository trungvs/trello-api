const express = require('express');
const TodoService = require('../services/Todo.service');

const router = express.Router();

router.post("/", createTodo)

function createTodo(req, res) {
    TodoService.createTodo(req, res)
}

module.exports = router;
