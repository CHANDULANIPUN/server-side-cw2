const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new SQLite database in the specified path
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
    if(err){
        console.error('Error opening database ' + err.message);
    }
    else{
        console.log('Connected to the SQLite database.');
    }
}
);

// Create a table 
db.serialize(() =>{
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        role_id INTEGER,
        FOREIGN KEY (role_id) REFERENCES user_roles(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS role_permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role_id INTEGER,
        permission TEXT NOT NULL,
        FOREIGN KEY (role_id) REFERENCES user_roles(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        api_key TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_used DATETIME,
        usage_count INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
});

// Funtion to close the database connection
const closeDatabase = () => {
    db.close((err) => {
        if(err){
            console.error('Error closing database ' + err.message);
        }
        else{
            console.log('Closed the database connection.');
        }
    });
};

// Export the database connection and close function
module.exports = {
    db,
    closeDatabase
};