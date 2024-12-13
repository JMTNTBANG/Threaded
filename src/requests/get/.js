module.exports = {
  init: (prefix, website) => {
    website.engine("html", require("ejs").renderFile);
    website.get(prefix, (request, response) => {
        request.session.threaded = { authenticated: true, username: "DEBUG" }
      if (
        !request.session.threaded ||
        !request.session.threaded.authenticated
      ) {
        response.sendFile(`${__dirname.slice(0, -13)}/static/login.html`);
      } else {
        response.render(`${__dirname.slice(0, -13)}/static/home.html`, {
          username: request.session.threaded.username
        });
      }
    });
  },
};
