import { Buffer } from 'buffer';

export const config = {
  db: {
    // entities: [`${__dirname}/../../entity/**/*.{js,ts}`],
    // subscribers: [`${__dirname}/../../subscriber/**/*.{js,ts}`],
    // migrations: [`${__dirname}/../../migration/**/*.{js,ts}`],
  },
  graphql: {
    debug: true,
    playground: {
      settings: {
        'request.credentials': 'include',
      },
    },
    autoSchemaFile: true,
    autoTransformHttpErrors: true,
    // cors: { credentials: true },
    // sortSchema: true,
    // installSubscriptionHandlers: true,
  },
  hello: 'world',
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  grpcServerUrl: process.env.PORT_GRPC_URL,
  saltRounds: 7,
  jwt: {
    // publicKey: Buffer.from(process.env['JWT_PUBLIC'], 'base64').toString('utf-8'),
    privateKey: Buffer.from(process.env.JWT_SECRET, 'base64').toString('utf-8'),
    expiresIn: '30d',
    refreshExpiresIn: '7d',
  },
};
