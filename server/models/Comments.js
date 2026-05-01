module.exports = {
  tableName: 'comments',
  attributes: {
    body:     { type: 'string', required: true },
    postId:   { type: 'number', required: true },
    authorId: { type: 'number', required: true },
    authorName: { type: 'string', required: true },
  },
};
