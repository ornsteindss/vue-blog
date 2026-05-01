module.exports = {
  'GET /api/posts':                'PostController.find',
  'GET /api/posts/:slug/comments': 'CommentController.find',
  'GET /api/posts/:slug':          'PostController.findOne',
  'POST /api/posts':               'PostController.create',
  'PUT /api/posts/:slug':          'PostController.update',
  'DELETE /api/posts/:slug':       'PostController.destroy',

  'POST /api/comments':            'CommentController.create',
};
