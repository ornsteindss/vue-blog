module.exports.policies = {
  'PostController': { create: ['jwtAuth'], update: ['jwtAuth'], destroy: ['jwtAuth'] },
  'CommentController': { create: ['jwtAuth'] },
};
