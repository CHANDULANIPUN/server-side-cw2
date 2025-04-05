class User {
    constructor(userId, username, password, apiKey) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.apiKey = apiKey;
    }
}

module.exports = User;