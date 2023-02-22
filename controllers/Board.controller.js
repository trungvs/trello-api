const express = require('express');
const BoardService = require('../services/Board.service');

const router = express.Router();

router.get("/", getAllBoard)
router.post("/", createBoard)
router.delete("/:id", deleteBoard)
router.put("/:id", editBoard)

function getAllBoard(req, res) {
    BoardService.getAllBoard(req, res)
}
function createBoard(req, res) {
    BoardService.createBoard(req, res)
}

function deleteBoard(req, res) {
    BoardService.deleteBoard(req, res)
}

function editBoard(req, res) {
    BoardService.editBoard(req, res)
}

module.exports = router;
