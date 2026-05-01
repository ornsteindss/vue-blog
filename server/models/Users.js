module.exports = {
  tableName: 'users',
  attributes: {
    email:        { type: 'string', required: true, unique: true },
    password:     { type: 'string', required: true },
    name:         { type: 'string', required: true },
    resetToken:   { type: 'string', allowNull: true },
    resetExpires: { type: 'number', allowNull: true },
  },
};
