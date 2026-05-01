module.exports = {
  async home(req, res) {
    const { posts, total } = await PostService.list({ page: 1, limit: 10 });
    return res.view('pages/home', { posts, total });
  },

  async post(req, res) {
    const post = await Posts.findOne({ where: { slug: req.params.slug, deletedAt: null } });
    if (!post) return res.notFound();
    const [comments, author] = await Promise.all([
      Comments.find({ where: { postId: post.id }, sort: 'createdAt ASC' }),
      Users.findOne({ id: post.authorId }),
    ]);
    const safePost = { slug: post.slug, title: post.title, body: post.body, createdAt: post.createdAt };
    const safeComments = comments.map(c => ({ body: c.body, authorName: c.authorName, createdAt: c.createdAt }));
    return res.view('pages/post', { post: safePost, comments: safeComments, author: author || { name: 'Unknown' } });
  },

  login:         (req, res) => res.view('pages/login'),
  register:      (req, res) => res.view('pages/register'),
  resetPassword: (req, res) => res.view('pages/reset-password'),
  confirmReset:  (req, res) => res.view('pages/confirm-reset', { token: req.params.token }),
};
