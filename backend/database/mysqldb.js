const mysql = require('promise-mysql');
const mysqlConnection = async() => {
    try {
        const conexion = await mysql.createConnection({
            host: process.env.HOSTMYSQL,
            port: process.env.PORTMYSQL,
            database: process.env.DBMYSQL,
            user: process.env.USERMYSQL,
            password: process.env.PASSWORDMYSQL,
        });
        console.log('Conexion a la base de datos correcta')
        return conexion;
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar MySQL DB');
    }
}

module.exports = {
    mysqlConnection
}