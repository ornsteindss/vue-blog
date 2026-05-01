module.exports.session = {
  secret: process.env.SESSION_SECRET || 'dev-only-secret-change-in-prod',
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
};
