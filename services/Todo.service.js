const { MYSQL_DB } = require('../mysql/mysql')

module.exports = {
    createTodo,
}

function createTodo(req, res) {
    const name = req.body.name
    const board_id = req.body.board_id

    let sqlLastItem = "SELECT * FROM todos ORDER BY no DESC LIMIT 1"

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
