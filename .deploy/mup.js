module.exports = {
  servers: {
    one: {
      host: '159.203.104.179',
      username: 'root',
      pem: '/Users/aspin/.ssh/id_rsa',
    },
  },

  meteor: {
    name: 'ce-platform',
    path: '../',
    servers: {
      one: {},
    },
    env: {
      PORT: 4000,
      ROOT_URL: 'https://yo-star.xyz',
      MONGO_URL: 'mongodb://localhost/meteor'
    },
    dockerImage: 'aspin/ce-platform',
    deployCheckWaitTime: 60
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};
