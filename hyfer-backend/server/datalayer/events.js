const { execQuery } = require('./database');

function insertSyncEvent(con, eventName, currentUser) {
  return execQuery(
    con,
    'INSERT INTO events (event_name, username) VALUES (?,?)',
    [eventName, currentUser]
  );
}

module.exports = {
  insertSyncEvent,
};

