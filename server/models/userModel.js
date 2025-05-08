class User {
    constructor(userId, username, password, apiKey, email) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.apiKey = apiKey;
        this.email = email;
    }
}

module.exports = User;