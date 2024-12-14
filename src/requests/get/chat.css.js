module.exports = {
    init: (prefix, website) => {
      website.get(`${prefix}chat.css`, (request, response) => {
        response.sendFile(`${__dirname.slice(0, -13)}/static/chat.css`);
      });
    },
  };
  