const { MYSQL_DB } = require('../mysql/mysql')
const { connectDB } = require("../mongoose/mongoose")
const mongoose = require("mongoose")

module.exports = {
    getAllBoard,
    createBoard,
    editBoard,
    deleteBoard,
    rankBoard
}

const boardsSchema = new mongoose.Schema({
    id: Number,
    name: String,
    no: Number
}, {versionKey: false})

const Boards = mongoose.model("boards", boardsSchema)

async function getAllBoard(req, res) {
    try {
        // const results = await Boards.find({}).sort({ no: "asc"})
        const results = await Boards.aggregate([
            {
                $lookup: {
                    from: "todos",
                    localField: "id",
                    foreignField: "board_id",
                    as: "lists",
                }
            },
            {
                $sort: {"no": 1}
            }
        ]).sort({ no: "asc" })
        res.send({
            code: 200,
            data: results
        })
    } catch (err) {
        res.send({
            code: 201,
            mesage: "Thao tác thất bại"
        })
    }
}

async function createBoard(req, res) {
    try {
        const maxOrder = await Boards.find({}).sort({ no: -1}).limit(1)
        const value = {
            id: Number(Date.now()),
            name: req.body.name,
            no: maxOrder[0]?.no + 1|| 1
        }
        const results = await Boards.create(value)
        res.send({
            code: 200,
            data: results
        })
    } catch (err) {
        res.send({
            code: 201,
            mesage: "Thao tác thất bại"
        })
    }
} 

async function editBoard(req, res) {
    const id = req.params.id
    const name = req.body.name

    Boards.findOneAndUpdate({id: id}, {name: name}, (err, results) => {
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

async function deleteBoard(req, res) {
    const id = req.params.id

    Boards.deleteOne({id: id}, (err, results) => {
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

async function rankBoard(req, res) {
    let id = req.params.id
    let currentRanking = Number(req.body.currentRanking)
    let newRanking = Number(req.body.newRanking)

    if (currentRanking > newRanking) {
        let updateAllOrder = await Boards.updateMany({ no: {$gte: newRanking} }, {$inc: {no:1}})
        let updateSelected = await Boards.findOneAndUpdate({ id: id }, { no: newRanking })
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
        let updateAllOrder = await Boards.bulkWrite([
            {
                "updateMany": {
                    "filter": { no: {$gt: newRanking}},
                    "update" : { $inc: {no: 1}}
                }
            },
            {
                "updateMany": {
                    "filter": { no: {$lte: newRanking}},
                    "update" : { $inc: {no: -1}}
                }
            }
        ])
        let updateSelected = await Boards.findOneAndUpdate({ id: id }, { no: newRanking })
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
}


