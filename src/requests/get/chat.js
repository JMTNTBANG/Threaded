const func = require("../../static/func");
const url = require("url");
module.exports = {
  init: (prefix, website) => {
    website.engine("html", require("ejs").renderFile);
    website.get(`${prefix}chat`, (request, response) => {
      if (
        !request.session.threaded ||
        !request.session.threaded.authenticated
      ) {
        response.redirect("/");
      } else {
        const query = url.parse(request.url, true).query;
        if (!query.channel) {
          response.send("<h1>Please Select a Channel</h1>");
          response.end();
        } else {
          func.connectToMySQL(response, (error, database) => {
            if (error) throw error;
            database.query(
              "SELECT * FROM threaded_data.channels WHERE ID = ?",
              [query.channel],
              (err, channels, fields) => {
                if (err) throw err;
                database.query(
                  "SELECT * FROM threaded_data.posts WHERE CHANNELID = ?", [query.channel],
                  (err, posts, fields) => {
                    if (err) throw err;
                    let payload =
                      '<link rel="stylesheet" href="chat.css" />';
                    for (post in posts) {
                        payload += `<div><h1>${posts[post].NAME}</h1><p>${posts[post].CONTENT}</p></div><br>`
                    }
                    response.send(payload);
                    response.end();
                  }
                );
              }
            );
          });
        }
      }
    });
  },
};
