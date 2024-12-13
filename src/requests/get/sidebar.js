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
            (err, joined_channels, fields) => {
              if (err) throw err;
              database.query(
                "SELECT * FROM threaded_data.channels",
                (err, channels, fields) => {
                  if (err) throw err;
                  let payload = '<link rel="stylesheet" href="sidebar.css" />'
                  for (jchannel in joined_channels) {
                    for (channel in channels) {
                        if (channels[channel].ID == joined_channels[jchannel].CHANNELID) {
                            payload += `<div><p>${channels[channel].NAME}</p></div><br>` 
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
