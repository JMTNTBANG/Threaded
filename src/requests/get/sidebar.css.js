module.exports = {
    init: (prefix, website) => {
      website.get(`${prefix}sidebar.css`, (request, response) => {
        response.sendFile(`${__dirname.slice(0, -13)}/static/sidebar.css`);
      });
    },
  };
  