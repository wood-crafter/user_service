const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const usersService = require('./user.service')
const { resolve } = require('path')

const app = express()
app.use(bodyParser.json())

const readFileName = () => {
  return new Promise((resolve, reject) => {
    fs.readdir('songs', (e, files) => {
      if (e) {
        console.error(e)
        reject(500)
      } else {
        resolve(files)
      }
    })
  })
}

app.get('/files', (req, res) => {

  readFileName()
    .then(files => {
      console.info(files)
      res.send(files)
    })
    .catch(statusCode => {
      console.error(statusCode)
      res.sendStatus(500)
    })
})

app.get('/files/:filename', (req, res) => {
  const filename = req.params.filename
  const filePath = path.join(__dirname, 'songs', filename)

  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      console.error(err)
      return res.sendStatus(err.code === 'ENOENT' ? 404 : 400)
    }

    res.sendFile(filePath, (e) => {
      if (e) {
        console.error(e)
        return res.sendStatus(500)
      }

      console.info('Sent file')
    })
  })
})

app.delete('/users/:id', (req, res) => {
  const id = req.params.id

  usersService.remove(id)
    .then(() => {
      res.sendStatus(200)
    })
    .catch(e => {
      console.sendStatus(500)
    })
})

app.put('/users', (req, res) => {
  const user = req.body

  const updateUserService = usersService.idExists(user.id)
    .then(idExists => {
      return new Promise((resolve, reject) => {
        if (!idExists) {
          reject(409)
          return
        }
        usersService.update(user)
          .then(() => {
            console.info("Updated!")
            resolve()
          })
          .catch(() => {
            reject(500)
          })
      })
    })

    updateUserService
      .then(() => {
        res.sendStatus(200)
      })
      .catch(errorCode => {
        res.sendStatus(errorCode)
      })
})


app.post('/users', (req, res) => {
  const user = req.body

  const servicePromise = usersService.emailExists(user.email)
    .then(isExisted => {
      return new Promise((resolve, reject) => {
        if (isExisted) {
          reject(409)
          return
        }

        usersService.addOne(user)
          .then(() => {
            console.info('Inserted!')
            resolve()
          }).catch(() => {
            reject(500)
          })
      })
    })

  servicePromise
    .then(() => {
      res.sendStatus(201)
    })
    .catch(errorCode => {
      res.sendStatus(errorCode)
    })
})

app.get('/users/:id', (req, res) => {
  const id = req.params.id

  usersService.findOne(id)
    .then(user => {
      res.send(user)
    })
    .catch((e) => {
      console.error(e)
      res.sendStatus(404)
    })
})
app.get('/users', (_, res) => {
  usersService.findAll()
    .then(users => {
      res.send(users)
    })
    .catch(e => {
      console.log(e)
      res.sendStatus(404)
    })
})

app.all('*', (_, res) => {
  res.status(418)
    .send(`418 | I'm a teapot!`)
})

const PORT = 8081
app.listen(PORT, () => {
  console.info(`Server started: http://localhost:${PORT}`)
})