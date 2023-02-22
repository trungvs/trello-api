const express = require('express');
const TodoService = require('../services/Todo.service');

const router = express.Router();

router.post("/", createTodo)
router.get("/:id", getTodoById)
router.put("/:id", editTodo)

function createTodo(req, res) {
    TodoService.createTodo(req, res)
}

function getTodoById(req, res) {
    TodoService.getTodoById(req, res)
}

function editTodo(req, res) {
    TodoService.editTodo(req, res)
}

module.exports = router;