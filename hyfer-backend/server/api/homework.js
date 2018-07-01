const express = require('express');
const db = require('../datalayer/homework');
const handleError = require('./error')('homework');
const { hasRole } = require('../auth/auth-service');
const { getConnection } = require('./connection');

function getGroupAssignments(req, res) {
  getConnection(req, res)
    .then(con => db.getGroupAssignments(con, req.params.groupId))
    .then(result => res.json(result))
    .catch(err => handleError(err, res));
}

function getGroupStudents(req, res) {
  getConnection(req, res)
    .then(con => db.getGroupStudents(con, req.params.groupId))
    .then(result => res.json(result))
    .catch(err => handleError(err, res));
}

function getGroupSubmissions(req, res) {
  getConnection(req, res)
    .then(con => db.getGroupSubmissions(con, req.params.groupId))
    .then(result => res.json(result))
    .catch(err => handleError(err, res));
}

function getGroupReviews(req, res) {
  getConnection(req, res)
    .then(con => db.getGroupReviews(con, req.params.groupId))
    .then(result => res.json(result))
    .catch(err => handleError(err, res));
}

function getAssignmentSubmitters(req, res) {
  getConnection(req, res)
    .then(con => db.getAssignmentSubmitters(con, req.params.assignmentId))
    .then(result => res.json(result))
    .catch(err => handleError(err, res));
}

function addAssignment(req, res) {
  getConnection(req, res)
    .then(con => db.addAssignment(con, req.body))
    .then(() => res.sendStatus(200))
    .catch(err => handleError(err, res));
}

function addSubmission(req, res) {
  getConnection(req, res)
    .then(con => db.addSubmission(con, req.body))
    .then(() => res.sendStatus(200))
    .catch(err => handleError(err, res));
}

function addReview(req, res) {
  getConnection(req, res)
    .then(con => db.addReview(con, req.body))
    .then(() => res.sendStatus(200))
    .catch(err => handleError(err, res));
}

function addReviewer(req, res) {
  getConnection(req, res)
    .then(con => db.addReviewer(con, req.body.reviewer, req.body.submission_id))
    .then(() => res.sendStatus(200))
    .catch(err => handleError(err, res));
}

const router = express.Router();
router
  .get('/students/:groupId', hasRole('teacher|student'), getGroupStudents)
  .get('/assignments/:groupId', hasRole('teacher|student'), getGroupAssignments)
  .get('/submissions/:groupId', hasRole('teacher|student'), getGroupSubmissions)
  .get('/submitters/:assignmentId', hasRole('teacher|student'), getAssignmentSubmitters)
  .get('/reviews/:groupId', hasRole('teacher|student'), getGroupReviews)
  .post('/assignments', hasRole('teacher|student'), addAssignment)
  .post('/submissions', hasRole('teacher|student'), addSubmission)
  .post('/reviews', hasRole('teacher|student'), addReview)
  .patch('/addReviewer', hasRole('teacher'), addReviewer);

module.exports = router;
