// 服务器代码
/*
    启动服务器nodemon server.js

    访问服务器：http://localhost:3000
 */
const express = require("express");
const app = express();
app.use(express.static("build", { maxAge: 1000 * 3600 }));
app.listen(3000);
