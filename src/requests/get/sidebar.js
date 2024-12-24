const func = require("../../static/func");
module.exports = {
  init: (prefix, website) => {
    website.engine("html", require("ejs").renderFile);
    website.get(`${prefix}sidebar`, (request, response) => {
      if (
        !request.session.threaded ||
        !request.session.threaded.authenticated
      ) {
        response.redirect("/");
      } else {
        func.connectToMySQL(response, (error, database) => {
          if (error) throw error;
          database.query(
            "SELECT * FROM threaded_data.member_list WHERE USERID = ?",
            [request.session.threaded.userid],
            (err, joined_screws, fields) => {
              if (err) throw err;
              database.query(
                "SELECT * FROM threaded_data.screws",
                (err, screws, fields) => {
                  if (err) throw err;
                  let payload = '<link rel="stylesheet" href="sidebar.css" />'
                  for (jscrew in joined_screws) {
                    for (screw in screws) {
                        if (screws[screw].ID == joined_screws[jscrew].SCREWID) {
                            payload += `<div><p onclick="window.top.postMessage('/chat?screw=${screws[screw].ID}', '*')">${screws[screw].NAME}</p></div><br>` 
                        }
                    }
                  }
                  response.send(payload)
                  response.end()
                }
              );
            }
          );
        });
      }
    });
  },
};
