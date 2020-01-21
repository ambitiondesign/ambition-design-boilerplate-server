export default {

  // If using onine database
  // development: {
  //   use_env_variable: 'DATABASE_URL'
  // },

  development: {
    database: 'adportal',
    user: 'root',
    password: 'password',
    host: '127.0.0.1'
  },

  test: {
    database: 'adportal_test',
    user: 'root',
    password: 'password',
    host: '127.0.0.1'
  },

  production: {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
};