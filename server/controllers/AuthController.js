const v = require('../validators/auth');

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'strict',
  maxAge:   7 * 24 * 60 * 60 * 1000,
  secure:   process.env.NODE_ENV === 'production',
};

function validate(schema, data) {
  const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
  if (error) throw { status: 422, message: error.details.map(d => d.message).join(', ') };
  return value;
}

module.exports = {
  async signup(req, res) {
    try {
      const body = validate(v.signup, req.body);
      const { token, user } = await AuthService.signup(body);
      res.cookie('jwt', token, COOKIE_OPTS);
      return res.json({ user });
    } catch (e) {
      return res.status(e.status || 400).json({ error: e.message });
    }
  },

  async login(req, res) {
    try {
      const body = validate(v.login, req.body);
      const { token, user } = await AuthService.login(body);
      res.cookie('jwt', token, COOKIE_OPTS);
      return res.json({ user });
    } catch (e) {
      return res.status(e.status || 401).json({ error: e.message });
    }
  },

  async logout(_req, res) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict' });
    return res.json({ ok: true });
  },

  async requestReset(req, res) {
    try {
      const body = validate(v.requestReset, req.body);
      await AuthService.requestReset(body.email);
      return res.json({ message: 'If that email exists, a reset link was sent.' });
    } catch (e) {
      return res.status(e.status || 400).json({ error: e.message });
    }
  },

  async confirmReset(req, res) {
    try {
      const body = validate(v.confirmReset, req.body);
      await AuthService.confirmReset({ token: req.params.token, password: body.password });
      return res.json({ message: 'Password updated' });
    } catch (e) {
      return res.status(e.status || 400).json({ error: e.message });
    }
  },
};
