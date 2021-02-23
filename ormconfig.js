module.exports = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  port: 3306,
  database: process.env.MYSQL_DATABASE,
  synchronize: true,
  // logging: process.env.NODE_ENV !== 'production',
  logging: false,
  entities: ['dist/entity/**/*.js'],
  migrations: ['dist/migration/**/*.js'],
  subscribers: ['dist/subscriber/**/*.js'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
