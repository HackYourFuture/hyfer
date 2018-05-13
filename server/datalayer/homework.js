'use strict'
const db = require('./database')

const GET_GROUP_HOMEWORK_QUERY =
    `SELECT h.id, module_name, title, deadline FROM homework h  JOIN modules m ON h.module_id = m.id`

const GET_GROUP_STUDENTS_QUERY =
    `SELECT users.id, username, full_name, email FROM group_students JOIN users ON group_students.user_id = users.id`

const GET_GROUP_SUBMISSIONS_QUERY =
    `SELECT s.id, homework_id, student_id, username, github_link, date FROM submissions s JOIN users u ON s.student_id = u.id`

const GET_GROUP_REVIEWS_QUERY =
    `SELECT r.id, r.homework_id AS submission_id, reviewer_id, s.student_id AS submitter_id, comments, r.date FROM reviews r JOIN submissions s ON r.homework_id = s.id`

const ADD_HOMEWORK_QUERY = `INSERT INTO homework (group_id, module_id, title, deadline)`

const ADD_SUBMISSION_QUERY = `INSERT INTO submissions (homework_id, group_id, student_id, github_link, date)`

const ADD_REVIEW_QUERY = `INSERT INTO reviews (homework_id, group_id, student_id, reviewer_id, comments, date)`

function getGroupHomework(con, group_id) {
    const id = Number(group_id)
    const sql = GET_GROUP_HOMEWORK_QUERY + ` WHERE group_id = ? ORDER BY h.id DESC`
    return db.execQuery(con, sql, [id])
}

function getGroupStudents(con, group_id) {
    const id = Number(group_id)
    const sql = GET_GROUP_STUDENTS_QUERY + ` WHERE group_id = ?`
    return db.execQuery(con, sql, [id])
}

function getGroupSubmissions(con, group_id) {
    const id = Number(group_id)
    const sql = GET_GROUP_SUBMISSIONS_QUERY + ` WHERE group_id = ?`
    return db.execQuery(con, sql, [id])
}

function getGroupReviews(con, group_id) {
    const id = Number(group_id)
    const sql = GET_GROUP_REVIEWS_QUERY + ` WHERE r.group_id = ? ORDER BY r.id DESC`
    return db.execQuery(con, sql, [id])
}

function addHomework(con, homework) {
    const sql = ADD_HOMEWORK_QUERY + ` VALUES(?, ?, ?, ?)`
    return db.execQuery(con, sql, [homework.group_id, homework.module_id, homework.title, homework.deadline])
}

function addSubmission(con, submission) {
    const sql = ADD_SUBMISSION_QUERY + ` VALUES(?, ?, ?, ?, ?)`
    return db.execQuery(con, sql, [submission.homework_id, submission.group_id, submission.student_id, submission.github_link, submission.date])
}

function addReview(con, review) {
    const sql = ADD_REVIEW_QUERY + ` VALUES(?, ?, ?, ?, ?, ?)`
    return db.execQuery(con, sql, [review.homework_id, review.group_id, review.student_id, review.reviewer_id, review.comments, review.date])
}


module.exports = {
    getGroupHomework,
    getGroupStudents,
    getGroupSubmissions,
    getGroupReviews,
    addHomework,
    addSubmission,
    addReview
}
