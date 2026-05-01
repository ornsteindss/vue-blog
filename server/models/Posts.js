module.exports = {
  tableName: 'posts',
  attributes: {
    title:     { type: 'string', required: true },
    slug:      { type: 'string', unique: true },
    body:      { type: 'string', required: true },
    authorId:  { type: 'number', required: true },
    deletedAt: { type: 'number', allowNull: true },
  },
};
