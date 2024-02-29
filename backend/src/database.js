import mysql from "mysql2/promise";

export const db = mysql.createPool({
    host: "localhost",
    user: "hsg-admin",
    password: "123abc",
    database: "high-street-gym",
});