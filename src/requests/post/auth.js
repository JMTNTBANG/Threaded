const func = require("../../static/func.js");

module.exports = {
  init: (prefix, website) => {
    website.post(`${prefix}auth`, (request, response) => {
      const username = request.body.username;
      const password = request.body.password;
      console.log(`Authenticating ${request.ip} with Username ${username}`);
      func.connectToMySQL(response, (error, database) => {
        if (error) throw error;
        database.query(
          "SELECT * FROM threaded_data.users WHERE USERNAME = ? AND PASSWORD = ?",
          [username, password],
          (err, results, fields) => {
            if (err) throw err;
            if (results.length > 0) {
              console.log(
                `Successfully Authenticated ${request.ip} with Username ${username}`
              );
              request.session.threaded = {
                authenticated: true,
                username: username,
                userid: results[0].id,
              };
              response.redirect(prefix);
            } else {
              console.error(
                `Failed to Authenticate ${request.ip} with Username ${username}`
              );
              response.send(
                func.sendError("Incorrect Username and/or Password")
              );
            }
          }
        );
      });
    });
  },
};
