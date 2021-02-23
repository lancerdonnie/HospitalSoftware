module.exports = {
  type: process.env.NODE_ENV !== 'test' ? 'mysql' : 'sqlite',
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  port: 3306,
  database: process.env.NODE_ENV !== 'test' ? process.env.MYSQL_DATABASE : ':memory:',
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
