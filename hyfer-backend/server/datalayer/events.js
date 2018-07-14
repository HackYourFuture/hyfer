const { execQuery } = require('./database');

function insertSyncEvent(con, eventName, username) {
  return execQuery(
    con,
    'INSERT INTO events (event_name, username) VALUES (?,?)',
    [eventName, username]
  );
}

module.exports = {
  insertSyncEvent,
};

