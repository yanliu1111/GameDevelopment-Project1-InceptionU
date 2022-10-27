import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require("express");
const app = express();
const cors = require("cors");
import bodyParser from "body-parser";

const mssql = require("mssql");
const config = {
  user: "sa",
  password: "Vic2006",
  server: "localhost",
  database: "inceptionU2022",
  encrypt: false,
};

mssql.connect(config, function (err) {
  if (err) console.log(err);
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/getAllUsers", (req, res) => {
  const request = new mssql.Request();
  request.query(
    "select top 5 * from userinfo order by score",
    function (error, results) {
      res.send(results);
    }
  );
});

app.get("/getUser/:id", function (req, res) {
  const request = new mssql.Request();
  request
    .input("id", mssql.VarChar(3), req.params.id)
    .query(
      "select * from userinfo where usrid = @id",
      function (error, results) {
        res.send(results);
      }
    );
});

app.all("/createUser", function (req, res) {
  const request = new mssql.Request();
  request
    .input("usrid", mssql.VarChar(3), req.body.usrID)
    .input("usrname", mssql.VarChar(50), req.body.name)
    .input("usrscore", mssql.Int, req.body.score)
    .query(
      "insert into userinfo values(@usrid,@usrname,@usrscore)",
      function (error, results) {
        if (error) console.log(error);
        console.log("createUser: ", results);
      }
    );
});

app.all("/updateUser", function (req, res) {
  const request = new mssql.Request();
  request
    .input("userid", mssql.VarChar(3), req.body.usrID)
    .input("score", mssql.Int, req.body.score)
    .query(
      "update userinfo set score=@score where usrid=@userid",
      function (error, results) {
        if (error) console.log(error);
        console.log("updateUser: ", results);
      }
    );
});

app.listen(8080, function () {
  console.log("server is running at http://127.0.0.1:8080");
});
