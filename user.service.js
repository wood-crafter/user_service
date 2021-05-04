const db = require('./db')
const connection = db.getConnection()

// const emailExists = (email, onFinish) => {
//   connection.query('SELECT * FROM users WHERE email = ?', email, (e, results, fields) => {
//     if (e) {
//       onFinish(e, null)
//     } else {
//       onFinish(null, results.length)
//     }
//   })
// }

const emailExists = email => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users WHERE email = ?', email, (e, results, fields) => {
      if (e) {
        reject(e)
      } else {
        resolve(results.length !== 0)
      }
    })
  })
}

const idExists = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users WHERE id = ?', id, (e, results, fields) => {
      if(e){
        reject(e)
      } else {
        resolve(results.length > 0)
      }
    })
  })
}

const update = (user) => {
  return new Promise((resolve, reject) => {
    connection.query('UPDATE users SET ? WHERE id = ?', [user, user.id], (e) => {
      if(e){
        console.error(e)
        reject(e)
      } else {
        resolve()
      }
    })
  })
}

const remove = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('DELETE FROM users WHERE id = ?', id, e => {
      if(e){
        console.error(e)
        reject(e)
      } else {
        resolve()
      }
    })
  })
}

const addOne = user => {
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO users set ?', user, (e) => {
      if (e) {
        reject(e)
      } else {
        resolve()
      }
    })
  })
}

const findAll = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users', (e, results, fileds) => {
      if (e) {
        reject(e)
      } else {
        resolve(results)
      }
    })
  })
}

const findOne = (id) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users WHERE id = ?', id, (e, result, fields) => {
      if (e) {
        reject(e)
      } else {
        resolve(result)
      }
    })
  })
}

module.exports = {
  findAll,
  findOne,
  emailExists,
  addOne,
  idExists,
  update,
  remove
}
