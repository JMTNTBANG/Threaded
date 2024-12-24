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
        if (!query.screw) {
          response.send("<h1>Please Select a Screw</h1>");
          response.end();
        } else {
          func.connectToMySQL(response, (error, database) => {
            if (error) throw error;
            database.query(
              "SELECT * FROM threaded_data.threads WHERE SCREWID = ?",
              [query.screw],
              (err, threads, fields) => {
                if (err) throw err;
                let payload = '<link rel="stylesheet" href="chat.css" />';
                for (thread in threads) {
                  payload += `<div><h1>${threads[thread].NAME}</h1><p>${threads[thread].CONTENT}</p></div><br>`;
                }
                response.send(payload);
                response.end();
              }
            );
          });
        }
      }
    });
  },
};
