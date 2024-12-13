module.exports = {
    init: (prefix, website) => {
      website.get(`${prefix}home.css`, (request, response) => {
        response.sendFile(`${__dirname.slice(0, -13)}/static/home.css`);
      });
    },
  };
  