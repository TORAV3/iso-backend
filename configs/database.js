module.exports = {
    development: {
        username: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME,
        host: process.env.DBHOST,
        dialect: process.env.DBDIALECT
    },
    // production: {
    //   username: 'root',
    //   password: 'password',
    //   database: 'mydatabase',
    //   host: '127.0.0.1',
    //   dialect: 'mysql'
    // }
};
