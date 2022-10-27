import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import readlineSync from "readline-sync";
import fetch from "node-fetch";

export const up = (x, y) => {
  if (x > 0) x--;
  return [x, y];
};

export const right = (x, y) => {
  if (y < 4) y++;
  return [x, y];
};

export const down = (x, y) => {
  if (x < 4) x++;
  return [x, y];
};

export const left = (x, y) => {
  if (y > 0) y--;
  return [x, y];
};
export const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const inputinfo = () => {
  const num1 = readlineSync.keyIn(
    "Set your" +
      chalk.white.bgBlue(" 3 ") +
      "digital UserID " +
      chalk.white.bgBlue("[0 - 5][0 - 5][0 - 5]: "),
    {
      limit: "$<0-5>",
    }
  );
  console.clear();
  const num2 = readlineSync.keyIn(
    "Set your" +
      chalk.white.bgBlue(" 3 ") +
      "digital UserID " +
      chalk.white.bgBlue("[0 - 5][0 - 5][0 - 5]: ") +
      num1,
    {
      limit: "$<0-5>",
    }
  );
  console.clear();
  const num3 = readlineSync.keyIn(
    "Set your" +
      chalk.white.bgBlue(" 3 ") +
      "digital UserID " +
      chalk.white.bgBlue("[0 - 5][0 - 5][0 - 5]: ") +
      num1 +
      num2,
    {
      limit: "$<0-5>",
    }
  );

  // console.log(chalk.magenta.bold("Current Map ⇊"));
  // console.log(format(grid));
  // console.log(keyValue); //Random KeyValue

  const answer = readlineSync.question(
    chalk.magenta.bold("Hello, player's name? ")
  );

  return [num1 + num2 + num3, answer];
};

export const getAllUsers = async () => {
  let user = [];
  await fetch("http://127.0.0.1:8080/getAllUsers")
    .then((res) => res.text())
    .then((res) => {
      user = JSON.parse(res).recordset;
    });
  return user;
};

export const getUser = async (x) => {
  let user = {};
  await fetch(`http://127.0.0.1:8080/getUser/${x}`)
    .then((res) => res.text())
    .then((res) => {
      user = JSON.parse(res).recordset[0];
    });
  return user;
};

export const updateUser = (user) =>
  fetch("http://127.0.0.1:8080/updateUser", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

export const createUser = (user) =>
  fetch("http://127.0.0.1:8080/createUser", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
