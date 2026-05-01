const jwt = require('jsonwebtoken');

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-');
}

async function uniqueSlug(title) {
  let slug = slugify(title);
  let i = 1;
  while (await Posts.findOne({ where: { slug } })) {
    slug = slugify(title) + '-' + i++;
  }
  return slug;
}

function extractUserId(token) {
  if (!token) return null;
  try { return jwt.verify(token, process.env.JWT_SECRET).id; } catch { return null; }
}

function safePost(p, authorName, userId) {
  return {
    slug:       p.slug,
    title:      p.title,
    body:       p.body,
    createdAt:  p.createdAt,
    authorName: authorName,
    isOwner:    userId != null && userId === p.authorId,
  };
}

module.exports = {
  async list({ page = 1, limit = 10, token = null }) {
    const skip = (page - 1) * limit;
    const userId = extractUserId(token);
    const [posts, total] = await Promise.all([
      Posts.find({ where: { deletedAt: null }, skip, limit, sort: 'createdAt DESC' }),
      Posts.count({ where: { deletedAt: null } }),
    ]);
    const ids = [...new Set(posts.map(p => p.authorId))];
    const authors = ids.length ? await Users.find({ where: { id: ids } }) : [];
    const nameOf = {};
    authors.forEach(a => { nameOf[a.id] = a.name; });
    return {
      posts: posts.map(p => safePost(p, nameOf[p.authorId] || 'Unknown', userId)),
      total,
      page:  Number(page),
      limit: Number(limit),
    };
  },

  async getBySlug(slug, token = null) {
    const post = await Posts.findOne({ where: { slug, deletedAt: null } });
    if (!post) return null;
    const userId = extractUserId(token);
    const author = await Users.findOne({ id: post.authorId });
    return safePost(post, author ? author.name : 'Unknown', userId);
  },

  async create({ title, body, authorId }) {
    const slug = await uniqueSlug(title);
    const post = await Posts.create({ title, body, slug, authorId, deletedAt: null }).fetch();
    const author = await Users.findOne({ id: authorId });
    return safePost(post, author ? author.name : 'Unknown', authorId);
  },

  async update(slug, authorId, { title, body }) {
    const post = await Posts.findOne({ where: { slug, deletedAt: null } });
    if (!post) throw new Error('Not found');
    if (post.authorId !== authorId) throw new Error('Forbidden');
    const updated = await Posts.updateOne({ id: post.id }).set({ title, body });
    return { slug: updated.slug, title: updated.title, body: updated.body };
  },

  async softDelete(slug, authorId) {
    const post = await Posts.findOne({ where: { slug, deletedAt: null } });
    if (!post) throw new Error('Not found');
    if (post.authorId !== authorId) throw new Error('Forbidden');
    await Posts.updateOne({ id: post.id }).set({ deletedAt: Date.now() });
  },
};
