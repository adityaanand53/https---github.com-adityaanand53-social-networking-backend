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
      headers: ["content-type", "Authorization", "X-Frame-Options", 'x-access-token', 'enctype']
    },
  },
};
