'use strict'
const db = require('./database')

const GET_GROUP_ASSIGNMENTS_QUERY =
    `SELECT ha.id, module_name, title, assignment_link, deadline FROM homework_assignments ha JOIN modules m ON ha.module_id = m.id`

const GET_GROUP_STUDENTS_QUERY =
    `SELECT users.id, username, full_name, email FROM group_students JOIN users ON group_students.user_id = users.id`

const GET_GROUP_SUBMISSIONS_QUERY =
    `SELECT hs.id, assignment_id, username AS submitter_name, github_link, date, reviewer FROM homework_submissions hs 
        INNER JOIN users u ON hs.submitter_id = u.id
        INNER JOIN homework_assignments ha ON hs.assignment_id = ha.id`

const GET_GROUP_REVIEWS_QUERY =
    `SELECT hr.id, submission_id, reviewer_id, hs.submitter_id, comments, hr.date FROM homework_reviews hr 
        INNER JOIN homework_submissions hs ON hr.submission_id = hs.id
        INNER JOIN homework_assignments ha ON hs.assignment_id = ha.id`

const GET_ASSIGNMENT_SUBMITTERS_QUERY =
    `SELECT u.id, username, full_name FROM homework_submissions hs JOIN users u ON hs.submitter_id = u.id`

const ADD_ASSIGNMENT_QUERY = `INSERT INTO homework_assignments (group_id, module_id, title, assignment_link, deadline)`

const ADD_SUBMISSION_QUERY = `INSERT INTO homework_submissions (assignment_id, submitter_id, github_link, date)`

const ADD_REVIEW_QUERY = `INSERT INTO homework_reviews (submission_id, reviewer_id, comments, date)`

const Add_REVIEWER_QUERY = `UPDATE homework_submissions SET reviewer=? WHERE id=?`

function getGroupAssignments(con, group_id) {
    const id = Number(group_id)
    const sql = GET_GROUP_ASSIGNMENTS_QUERY + ` WHERE group_id = ? ORDER BY ha.id DESC`
    return db.execQuery(con, sql, [id])
}

function getGroupStudents(con, group_id) {
    const id = Number(group_id)
    const sql = GET_GROUP_STUDENTS_QUERY + ` WHERE group_id = ?`
    return db.execQuery(con, sql, [id])
}

function getGroupSubmissions(con, group_id) {
    const id = Number(group_id)
    const sql = GET_GROUP_SUBMISSIONS_QUERY + ` WHERE ha.group_id = ?`
    return db.execQuery(con, sql, [id])
}

function getGroupReviews(con, group_id) {
    const id = Number(group_id)
    const sql = GET_GROUP_REVIEWS_QUERY + ` WHERE ha.group_id = ? ORDER BY hr.id DESC`
    return db.execQuery(con, sql, [id])
}

function getAssignmentSubmitters(con, assignment_id) {
    const id = Number(assignment_id)
    const sql = GET_ASSIGNMENT_SUBMITTERS_QUERY + ` WHERE hs.assignment_id = ?`
    return db.execQuery(con, sql, [id])
}

function addAssignment(con, assignment) {
    const sql = ADD_ASSIGNMENT_QUERY + ` VALUES(?, ?, ?, ?, ?)`
    return db.execQuery(con, sql, [assignment.group_id, assignment.module_id, assignment.title, assignment.assignment_link, assignment.deadline])
}

function addSubmission(con, submission) {
    const sql = ADD_SUBMISSION_QUERY + ` VALUES(?, ?, ?, ?)`
    return db.execQuery(con, sql, [submission.assignment_id, submission.submitter_id, submission.github_link, submission.date])
}

function addReview(con, review) {
    const sql = ADD_REVIEW_QUERY + ` VALUES(?, ?, ?, ?)`
    return db.execQuery(con, sql, [review.submission_id, review.reviewer_id, review.comments, review.date])
}

function addReviewer(con, reviewer, submissionId) {
    const sql = Add_REVIEWER_QUERY
    return db.execQuery(con, sql, [reviewer, submissionId])
}


module.exports = {
    getGroupAssignments,
    getGroupStudents,
    getGroupSubmissions,
    getGroupReviews,
    getAssignmentSubmitters,
    addAssignment,
    addSubmission,
    addReview,
    addReviewer
}
