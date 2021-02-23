const isTestEnv = process.env.NODE_ENV === 'test';

module.exports = {
  type: !isTestEnv ? 'mysql' : 'sqlite',
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  port: 3306,
  database: !isTestEnv ? process.env.MYSQL_DATABASE : ':memory:',
  synchronize: true,
  // logging: process.env.NODE_ENV !== 'production',
  logging: false,
  entities: ['{dist,src}/entity/*{.ts,.js}'],
  migrations: ['dist/migration/**/*.js'],
  subscribers: ['dist/subscriber/**/*.js'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
