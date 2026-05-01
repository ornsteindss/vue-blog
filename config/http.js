module.exports.http = {
  middleware: {
    order: ['cookieParser', 'bodyParser', 'router', 'www', 'favicon'],
  },
};
