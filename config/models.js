module.exports.models = {
  migrate: 'alter',
  attributes: {
    createdAt: { type: 'number', autoCreatedAt: true },
    updatedAt: { type: 'number', autoUpdatedAt: true },
    id: { type: 'number', autoIncrement: true },
  },
  cascadeOnDestroy: false,
};
