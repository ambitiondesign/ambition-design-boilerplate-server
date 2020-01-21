import mysql from 'mysql';
import util from 'util';
import dbConfig from '../config/db.config';

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const config = dbConfig[env];

function makeDb() {
  const connection = mysql.createConnection( config );
  return {
    query( sql, args ) {
      return util.promisify( connection.query )
        .call( connection, sql, args );
    },
    close() {
      return util.promisify( connection.end ).call( connection );
    },
    beginTransaction() {
      return util.promisify( connection.beginTransaction )
        .call( connection );
    },
    commit() {
      return util.promisify( connection.commit )
        .call( connection );
    },
    rollback() {
      return util.promisify( connection.rollback )
        .call( connection );
    }
  };
}

export default makeDb;