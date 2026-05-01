const v = require('../validators/post');

function validate(schema, data) {
  const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
  if (error) throw { status: 422, message: error.details.map(d => d.message).join(', ') };
  return value;
}

module.exports = {
  async find(req, res) {
    const result = await PostService.list({ page: req.query.page, limit: req.query.limit, token: req.cookies && req.cookies.jwt });
    return res.json(result);
  },

  async findOne(req, res) {
    const post = await PostService.getBySlug(req.params.slug, req.cookies && req.cookies.jwt);
    if (!post) return res.status(404).json({ error: 'Not found' });
    return res.json(post);
  },

  async create(req, res) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const body = validate(v.create, req.body);
      const post = await PostService.create({ ...body, authorId: req.user.id });
      return res.status(201).json(post);
    } catch (e) {
      return res.status(e.status || 400).json({ error: e.message });
    }
  },

  async update(req, res) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const body = validate(v.update, req.body);
      const post = await PostService.update(req.params.slug, req.user.id, body);
      return res.json(post);
    } catch (e) {
      const status = e.status || (e.message === 'Forbidden' ? 403 : e.message === 'Not found' ? 404 : 400);
      return res.status(status).json({ error: e.message });
    }
  },

  async destroy(req, res) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    try {
      await PostService.softDelete(req.params.slug, req.user.id);
      return res.json({ deleted: true });
    } catch (e) {
      return res.status(e.message === 'Forbidden' ? 403 : 404).json({ error: e.message });
    }
  },
};
