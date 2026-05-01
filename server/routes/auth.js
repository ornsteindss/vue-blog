module.exports = {
  'POST /auth/signup':       'AuthController.signup',
  'POST /auth/login':        'AuthController.login',
  'POST /auth/logout':       'AuthController.logout',
  'POST /auth/reset':        'AuthController.requestReset',
  'POST /auth/reset/:token': 'AuthController.confirmReset',
};
