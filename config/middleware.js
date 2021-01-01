module.exports = {
  load: {
    before: ['timer', 'responseTime', 'logger', 'cors', 'responses', 'gzip'],
    order: [
    ],
    after: ['parser', 'router'],
  },
  settings: {
    cors: {
      origin: '*',
      enabled: true,
      headers: ["Content-Type", "Authorization", "X-Frame-Options", 'x-access-token', 'enctype']
    },
  },
};
