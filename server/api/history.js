'use strict'
const db = require('../datalayer/history')
const connection = require('./connection')
const states = require('../datalayer/states')

function getHistory(req, res) {
  const running_module_id = req.params.moduleId
  const groupId = req.params.groupId
  const sundays = req.body.sundays
  return connection.getConnection(req, res)
    .then(con => db.getHistory(con, running_module_id))
    .then(history => {
      return connection.getConnection(req, res)
        .then(con => states.getStudentsState(con, groupId))
        .then(students => {
          const lookup = {}
          const out = {}
          for (const student of students) {
            for (const date of sundays) {
              const att = {
                attendance: 0,
                homework: 0,
                group_id: student.group_id,
                full_name: student.full_name,
                user_id: student.user_id,
                username: student.username,
                running_module_id: running_module_id,
                date: date
              }
              lookup[date + '_' + student.user_id] = att
              const grouped = out[student.full_name] || (out[student.full_name] = [])
              grouped.push(att)
            }
          }
          for (const h of history) {
            const att = lookup[h.date + '_' + h.user_id]
            if (att) {
              att.attendance = h.attendance
              att.homework = h.homework
            }
          }
          res.json(out)
        })
    })
    .catch(err => console.error(err))
}

function orderAndGetList(histories) {
  const list = []
  let arr = []
  for (const key in histories) {
    for (const history of histories[key]) {
      const [date, group_id, running_module_id, user_id, attendance, homework] =
        [history.date, history.group_id, history.running_module_id, history.user_id, history.attendance, history.homework]
      arr.push(date, group_id, running_module_id, user_id, attendance, homework)
      list.push(arr)
      arr = []
    }
  }
  return list
}

function saveAttendances(req, res) {
  connection.getConnection(req, res)
    .then(con => {
      const list = orderAndGetList(req.body)
      return db.saveHistory(con, list)
        .then(val => {
          res.status(200).json(val)
        })
    })
    .catch(err => {
      console.log('err: ', err)
      res.status(400).json(err)
    })
}

module.exports = {
  getHistory,
  saveAttendances
}
