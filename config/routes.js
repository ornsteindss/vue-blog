const views = require('../server/routes/views');
const auth  = require('../server/routes/auth');
const api   = require('../server/routes/api');

module.exports.routes = { ...views, ...auth, ...api };
