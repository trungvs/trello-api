const { MYSQL_DB } = require('../mysql/mysql')


MYSQL_DB.query("SELECT * FROM boards", (err, results) => {
    console.log("connected")
})
module.exports = {
    getAllBoard,
    createBoard,
    editBoard,
    deleteBoard
}

function getAllBoard(req, res) {
    let sql = "SELECT * FROM boards ORDER BY no ASC"
    MYSQL_DB.query(sql, (err, boards) => {
        if (err) {
            console.log(err)
        } else {
            let sql = "SELECT * FROM todos"
            MYSQL_DB.query(sql, (err, todos) => {
                if (err) {
                    console.log(err)
                } else {
                    res.send({
                        code: 200,
                        mesage: "Thao tác thành công",
                        data: {
                            boards: boards,
                            todos: todos
                        }
                    })
                }
            })
        }
    })
}

function createBoard(req, res) {
    const name = req.body.name

    let sqlLastItem = "SELECT * FROM boards ORDER BY no DESC LIMIT 1"

    MYSQL_DB.query(sqlLastItem, (err, results) => {
        if (err) {
            console.log(err)
        } else {
            let sql = `
            INSERT INTO boards(id, name, no) 
            VALUES(id,"${name}", ${results[0] ? results[0].no + 1 : 1})
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

function editBoard(req, res) {
    const id = req.params.id
    const name = req.body.name

    let sql = `
    UPDATE boards
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
                mesage: "Thao tác thành công"
            })
        }
    })
}

function deleteBoard(req, res) {
    const id = req.params.id
    let sql = `DELETE FROM boards WHERE id = ${id}`

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


