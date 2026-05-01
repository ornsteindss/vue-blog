const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports = {
  async signup({ email, password, name }) {
    const existing = await Users.findOne({ email });
    if (existing) throw new Error('Email already in use');
    const hash = await bcrypt.hash(password, 10);
    const user = await Users.create({ email, password: hash, name }).fetch();
    return this._token(user);
  },

  async login({ email, password }) {
    const user = await Users.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error('Invalid credentials');
    return this._token(user);
  },

  async requestReset(email) {
    const user = await Users.findOne({ email });
    if (!user) return;
    const token = crypto.randomBytes(32).toString('hex');
    await Users.updateOne({ id: user.id }).set({
      resetToken: token,
      resetExpires: Date.now() + 3600000,
    });
    await MailService.sendPasswordReset(email, token);
  },

  async confirmReset({ token, password }) {
    const user = await Users.findOne({ resetToken: token });
    if (!user || user.resetExpires < Date.now()) throw new Error('Token invalid or expired');
    const hash = await bcrypt.hash(password, 10);
    await Users.updateOne({ id: user.id }).set({ password: hash, resetToken: null, resetExpires: null });
  },

  _token(user) {
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  },
};
