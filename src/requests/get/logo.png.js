module.exports = {
    init: (prefix, website) => {
      website.get(`${prefix}logo.png`, (request, response) => {
        response.sendFile(`${__dirname.slice(0, -13)}/static/logo.png`);
      });
    },
  };
  