'use strict'
const db = require('../datalayer/homework')
const getConnection = require('./connection').getConnection

function getGroupAssignments(req, res) {
    getConnection(req, res)
        .then(con => db.getGroupAssignments(con, req.params.groupId))
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err))
}

function getGroupStudents(req, res) {
    getConnection(req, res)
        .then(con => db.getGroupStudents(con, req.params.groupId))
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err))
}

function getGroupSubmissions(req, res) {
    getConnection(req, res)
        .then(con => db.getGroupSubmissions(con, req.params.groupId))
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err))
}

function getGroupReviews(req, res) {
    getConnection(req, res)
        .then(con => db.getGroupReviews(con, req.params.groupId))
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err))
}

function getAssignmentSubmitters(req, res) {
    getConnection(req, res)
        .then(con => db.getAssignmentSubmitters(con, req.params.assignmentId))
        .then(result => res.json(result))
        .catch(err => res.status(500).json(err))
}

function addAssignment(req, res) {
    getConnection(req, res)
        .then(con => db.addAssignment(con, req.body))
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err))
}

function addSubmission(req, res) {
    getConnection(req, res)
        .then(con => db.addSubmission(con, req.body))
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err))
}

function addReview(req, res) {
    getConnection(req, res)
        .then(con => db.addReview(con, req.body))
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err))
}

function addReviewer(req, res) {
    getConnection(req, res)
        .then(con => db.addReviewer(con, req.body.reviewer, req.body.submission_id))
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).json(err))
}

module.exports = {
    getGroupAssignments,
    getGroupSubmissions,
    getGroupReviews,
    getGroupStudents,
    getAssignmentSubmitters,
    addAssignment,
    addSubmission,
    addReview,
    addReviewer
}
