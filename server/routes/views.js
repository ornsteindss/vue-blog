module.exports = {
  'GET /':                      'ViewController.home',
  'GET /post/:slug':            'ViewController.post',
  'GET /login':                 'ViewController.login',
  'GET /register':              'ViewController.register',
  'GET /reset-password':        'ViewController.resetPassword',
  'GET /reset-password/:token': 'ViewController.confirmReset',
};
