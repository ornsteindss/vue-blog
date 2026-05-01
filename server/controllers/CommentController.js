const v = require('../validators/comment');

function validate(schema, data) {
  const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
  if (error) throw { status: 422, message: error.details.map(d => d.message).join(', ') };
  return value;
}

module.exports = {
  async find(req, res) {
    const post = await Posts.findOne({ where: { slug: req.params.slug, deletedAt: null } });
    if (!post) return res.json([]);
    const comments = await Comments.find({ where: { postId: post.id }, sort: 'createdAt ASC' });
    return res.json(comments.map(c => ({ body: c.body, authorName: c.authorName, createdAt: c.createdAt })));
  },

  async create(req, res) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const body = validate(v.create, req.body);
      const post = await Posts.findOne({ where: { slug: body.postSlug, deletedAt: null } });
      if (!post) return res.status(404).json({ error: 'Post not found' });
      const comment = await Comments.create({
        body: body.body,
        postId: post.id,
        authorId: req.user.id,
        authorName: req.user.name,
      }).fetch();
      return res.status(201).json({ body: comment.body, authorName: comment.authorName, createdAt: comment.createdAt });
    } catch (e) {
      return res.status(e.status || 400).json({ error: e.message });
    }
  },
};
