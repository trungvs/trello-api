const mongoose = require("mongoose")


module.exports = {
    createTodo,
    editTodo,
    deleteTodo,
    rankTodo
}

const TodoScheme = new mongoose.Schema({
    id: Number,
    name: String,
    no: Number,
    board_id: Number
}, {versionKey: false})

const Todos = mongoose.model("todos", TodoScheme)

async function createTodo(req, res) {
    const name = req.body.name
    const board_id = req.body.board_id

    const maxOrder = await Todos.find({ board_id: board_id}).sort({ no: -1}).limit(1)
    const value = {
        id: Number(Date.now()),
        name: name,
        board_id: board_id,
        no: maxOrder[0]?.no + 1 || 1
    }
    Todos.create(value, (err, results) => {
        if (err) {
            res.send({
                code: 201,
                mesage: "Thao tác thất bại"
            })
        } else {
            res.send({
                code: 200,
                mesage: "Thao tác thành công"
            })
        }
    })
}

async function editTodo(req, res) {
    let id = req.params.id
    let name = req.body.name

    Todos.findOneAndUpdate({id: id}, {name: name}, (err, results) => {
        if (err) {
            res.send({
                code: 201,
                mesage: "Thao tác thất bại"
            })
        } else {
            res.send({
                code: 200,
                mesage: "Thao tác thành công"
            })
        }
    })
}

function deleteTodo(req, res) {
    let id = req.params.id

    Todos.deleteOne({id: id}, (err, results) => {
        if (err) {
            res.send({
                code: 201,
                mesage: "Thao tác thất bại"
            })
        } else {
            res.send({
                code: 200,
                mesage: "Thao tác thành công"
            })
        }
    })
}

async function rankTodo(req, res) {
    let id = Number(req.params.id)
    let board_id = Number(req.body.board_id)
    let currentRanking = Number(req.body.currentRanking)
    let newRanking = Number(req.body.newRanking)

    const selectedItem = await Todos.findOne({id: id})

    if (selectedItem.board_id === board_id) {
        if (currentRanking > newRanking) {
            let updateAllOrder = await Todos.updateMany({board_id: board_id, no: {$gte: newRanking}}, {$inc: {no:1}})
            let updateSelected = await Todos.findOneAndUpdate({id: id}, {no: newRanking})
            if (updateAllOrder && updateSelected) {
                res.send({
                    code: 200,
                    mesage: "Thao tác thành công"
                })
            } else {
                res.send({
                    code: 201,
                    mesage: "Thao tác thất bại"
                })
            }
        } else if (currentRanking < newRanking) {
            let updateAllOrder = await Todos.bulkWrite([
                {
                    "updateMany": {
                        "filter": { no: {$gt: newRanking}, board_id: board_id},
                        "update" : { $inc: {no: 1}}
                    }
                },
                {
                    "updateMany": {
                        "filter": { no: {$lte: newRanking}, board_id: board_id},
                        "update" : { $inc: {no: -1}}
                    }
                }
            ])
            let updateSelected = await Todos.findOneAndUpdate({ id: id }, { no: newRanking })
            if (updateAllOrder && updateSelected) {
                res.send({
                    code: 200,
                    mesage: "Thao tác thành công"
                })
            } else {
                res.send({
                    code: 201,
                    mesage: "Thao tác thất bại"
                })
            }
        }
    } else {
        let updateAllOrder = await Todos.updateMany({board_id: board_id, no: {$gte: newRanking}}, {$inc: {no:1}})
        let updateSelected = await Todos.findOneAndUpdate({id: id}, {no: newRanking, board_id: board_id})
            if (updateSelected) {
                res.send({
                    code: 200,
                    mesage: "Thao tác thành công"
                })
            } else {
                res.send({
                    code: 201,
                    mesage: "Thao tác thất bại"
                })
            }
    }
}