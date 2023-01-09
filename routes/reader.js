var express = require('express');
var router = express.Router();
const {scanToPay} = require('../services/scan-to-pay');
const {scanToAttend} = require('../services/scan-to-attend');
const {scanToIssue} = require('../services/scan-to-issue');
const {issueCard} = require('../services/issueCard');
const {Pay} = require('../services/pay');
const {dbConnector, fetchConnection} = require('../services/dbConnector');
const {fetchStudents} = require('../services/fetchStudents');
const {moodleConnector} = require('../services/moodleConnector');

let connection;

router.get('/scan-to-pay', scanToPay);
router.get('/scan-to-attend', scanToAttend);
router.get('/scan-to-issue', scanToIssue);
router.post('/:id/issue-card', issueCard);
router.post('/pay', Pay);
router.post('/db-connect', dbConnector);
router.get('/connection', fetchConnection);
router.post('/moodle-connect', moodleConnector);
router.get('/students', fetchStudents);

module.exports = router;