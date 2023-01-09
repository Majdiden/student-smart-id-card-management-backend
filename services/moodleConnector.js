const axios = require('axios');

const moodleConnector = (req, res) => {
    const { url, token } = req.body;
    const moodleApiUrl = `${url}/webservice/rest/server.php`;
    axios.get(moodleApiUrl, {
      params: {
        wstoken: token,
        wsfunction: 'core_course_get_contents',
      },
    }).then((response) => {
      console.log(`Connected to Moodle at ${url}`);
      res.sendStatus(200);
    }).catch((error) => {
      console.error(error.message);
      res.sendStatus(500);
    });
}

module.exports = {moodleConnector}