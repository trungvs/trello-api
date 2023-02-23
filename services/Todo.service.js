const { MYSQL_DB } = require('../mysql/mysql')

module.exports = {
    createTodo,
    getTodoById,
    editTodo,
    deleteTodo,
    rankTodo
}

function createTodo(req, res) {
    const name = req.body.name
    const board_id = req.body.board_id

    let sqlLastItem = `SELECT * FROM todos WHERE board_id = ${board_id} ORDER BY no DESC LIMIT 1`

    MYSQL_DB.query(sqlLastItem, (err, results) => {
        if (err) {
            console.log(err)
        } else {
            let sql = `
            INSERT INTO todos (id, name, no, board_id) 
            VALUES (id,"${name}", ${results[0] ? results[0].no + 1 : 1}, ${board_id})
            `
            MYSQL_DB.query(sql, (err, results) => {
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
    })
}

function getTodoById(req, res) {
    let id = req.params.id

    let sql = `SELECT * FROM todos WHERE id = ${id}`
    MYSQL_DB.query(sql, (err, results) => {
        if (err) {
            res.send({
                code: 201,
                mesage: "Thao tác thất bại"
            })
        } else {
            res.send({
                code: 200,
                mesage: "Thao tác thành công",
                data: results[0]
            })
        }
    })
}

function editTodo(req, res) {
    let id = req.params.id
    let name = req.body.name

    let sql = 
    `
    UPDATE todos
    SET name = "${name}"
    WHERE id = ${id}
    `
    MYSQL_DB.query(sql, (err, results) => {
        if (err) {
            res.send({
                code: 201,
                mesage: "Thao tác thất bại"
            })
        } else {
            res.send({
                code: 200,
                mesage: "Thao tác thành công",
            })
        }
    })
}

function deleteTodo(req, res) {
    let id = req.params.id
    let sql = `DELETE FROM todos WHERE id = ${id}`

    MYSQL_DB.query(sql, (err, results) => {
        if (err) {
            res.send({
                code: 201,
                mesage: "Thao tác thất bại"
            })
        } else {
            res.send({
                code: 200,
                mesage: "Thao tác thành công",
            })
        }
    })
}

function rankTodo(req, res) {
    let id = req.params.id
    let board_id = Number(req.body.board_id)
    let currentRanking = Number(req.body.currentRanking)
    let newRanking = Number(req.body.newRanking)

    let sql = `
    UPDATE todos
    SET no = no + 1
    WHERE no >= ${newRanking} AND board_id = ${board_id}
    `
    MYSQL_DB.query(sql, (err, results) => {
        if (err) {
            res.send({
                code: 201,
                mesage: "Thao tác thất bại"
            })
        } else {
            let updateRankingSql = `UPDATE todos SET no = ${newRanking}, board_id = ${board_id} WHERE id = ${id}`
            MYSQL_DB.query(updateRankingSql, (err, results) => {
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
    })

    // if (currentRanking > newRanking) {
    //     let sql = `
    //     UPDATE todos
    //     SET no = no + 1
    //     WHERE no >= ${newRanking} AND board_id = ${board_id}
    //     `
    //     MYSQL_DB.query(sql, (err, results) => {
    //         if (err) {
    //             res.send({
    //                 code: 201,
    //                 mesage: "Thao tác thất bại"
    //             })
    //         } else {
    //             let updateRankingSql = `UPDATE todos SET no = ${newRanking}, board_id = ${board_id} WHERE id = ${id}`
    //             MYSQL_DB.query(updateRankingSql, (err, results) => {
    //                 if (err) {
    //                     res.send({
    //                         code: 201,
    //                         mesage: "Thao tác thất bại"
    //                     })
    //                 } else {
    //                     res.send({
    //                         code: 200,
    //                         mesage: "Thao tác thành công"
    //                     })
    //                 }
    //             })
    //         }
    //     })
    // } else if (currentRanking < newRanking) {
    //     let sql = `
    //     UPDATE todos
    //     SET no = (
    //         case when no > ${newRanking} then no + 1
    //         when no <= ${newRanking} then no - 1
    //         end
    //     )
    //     WHERE board_id = ${board_id}
    //     `
    //     MYSQL_DB.query(sql, (err, results) => {
    //         console.log(sql)
    //         if (err) {
    //             res.send({
    //                 code: 201,
    //                 mesage: "Thao tác thất bại"
    //             })
    //         } else {
    //             let updateRankingSql = `UPDATE todos SET no = ${newRanking}, board_id = ${board_id} WHERE id = ${id}`
    //             MYSQL_DB.query(updateRankingSql, (err, results) => {
    //                 if (err) {
    //                     res.send({
    //                         code: 201,
    //                         mesage: "Thao tác thất bại"
    //                     })
    //                 } else {
    //                     res.send({
    //                         code: 200,
    //                         mesage: "Thao tác thành công"
    //                     })
    //                 }
    //             })
    //         }
    //     })
    // }


}