import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import readlineSync from "readline-sync";
import {
  down,
  left,
  randomIntFromInterval,
  right,
  up,
  inputinfo,
  getUser,
  updateUser,
  createUser,
  getAllUsers,
} from "./app.M.Func.js";

let playerInfo = {
  usrID: "",
  name: "",
  score: "",
  stepChoices: [],
};

let keyRndX;
let keyRndY;
let countSteps = 0;
let hasKey = false;
// console.log(hasKey);
const grid = Array.from(new Array(5), () =>
  Array.from(new Array(5), () => "x")
);
// setting grid 5x5

// set 3doors
[
  [0, 0],
  [0, 4],
  [4, 4],
].forEach(([x, y]) => (grid[x][y] = chalk.bgGreen.black("D")));
//set character
grid[4][0] = chalk.blue.bold("H");
const invalidSquares = [
  [0, 0],
  [0, 4],
  [4, 0],
  [4, 4],
];

// DOWNDOWNDOWNDOWNDOWN

do {
  keyRndX = randomIntFromInterval(0, 4);
  //   console.log(keyRndX);
  keyRndY = randomIntFromInterval(0, 4);
  //   console.log(keyRndY);
} while (invalidSquares.some(([x, y]) => x === keyRndX && y === keyRndY));

grid[keyRndX][keyRndY] = chalk.bgYellow.black("k");
//set character
let player = [4, 0];
let playerRndX = player[0];
let playerRndY = player[1];
let previousPos = "x";
let keyValue = Math.floor(Math.random() * 3 + 1);
let gameOver = false;
const format = (grid) => grid.map((x) => x.join(" ")).join("\n");

export const sleep = (ms = 4000) => new Promise((r) => setTimeout(r, ms));

export async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow(
    "          [][][][][][][][][][][][][][][][][][][]\n          [][]                              [][]\n          [][Hi welcome to my KEY&DOORS game!][]\n          [][]         HAVE A FUN!          [][]\n          [][]                              [][]\n          [][][][][][][][][][][][][][][][][][][]"
  );

  await sleep();
  rainbowTitle.stop();

  console.log(`${chalk.bgBlue("\n  HOW TO PLAY")}
      There is 5x5 grid map. Three ${chalk.bgGreen.black(
        "Door"
      )} icons in the corners.
      Player icon ${chalk.bgBlue.white("Name")} will be user's initial name.
      Use "AWSD" keyboards to control where you want to go. "q" to exit.
      Get your ${chalk.black.bgYellow(
        "Key"
      )}. You will never lose the game. But try less steps to win ...
      `);
}

const pickupKey = () => {
  if (playerRndX === keyRndX && playerRndY === keyRndY) {
    hasKey = true;
    console.log(chalk.yellow.bold("Good, you get the key!"));
    previousPos = "x";
  }

  if (hasKey != true) {
    if (playerRndX === 0 && playerRndY === 0) {
      console.log(chalk.bgRed.white("Get the key first!"));
      grid[playerRndX][playerRndY] = "D";
    } else if (playerRndX === 0 && playerRndY === 4) {
      console.log(chalk.bgRed.white("Get the key first!"));
      grid[playerRndX][playerRndY] = "D";
    } else if (playerRndX === 4 && playerRndY === 4) {
      console.log(chalk.bgRed.white("Get the key first!"));
      grid[playerRndX][playerRndY] = "D";
    }
  } else if ((hasKey = true)) {
    if (playerRndX === 0 && playerRndY === 0) {
      if (keyValue != 1) {
        console.log(chalk.yellow.bold("Wrong door, try again"));
      } else {
        console.log(chalk.red.bold("Congras, you open the door!"));
        return true;
      }
    } else if (playerRndX === 0 && playerRndY === 4) {
      if (keyValue != 2) {
        console.log(chalk.yellow.bold("Wrong door, try again"));
      } else {
        console.log(chalk.red.bold("Congras, you open the door!"));
        return true;
      }
    } else if (playerRndX === 4 && playerRndY === 4) {
      if (keyValue != 3) {
        console.log(chalk.yellow.bold("Wrong door, try again"));
      } else {
        console.log(chalk.red.bold("Congras, you open the door!"));
        return true;
      }
    }
  }
};

let getNameInitial = (string) => {
  let names = string.split(" "),
    initials = names[0].substring(0, 1).toUpperCase();
  return initials;
};
// console.log(getNameInitial("Yan Liu"));
let key; //position??
/////start!
async function main() {
  await welcome();

  let userinfo;

  while (true) {
    userinfo = inputinfo();
    playerInfo.usrID = userinfo[0];
    playerInfo.name = userinfo[1];

    // confirm user from database:  ########################################################
    let playerx = await getUser(playerInfo.usrID);
    if (playerx != undefined) {
      console.log(`User name: ${playerx.usrname}`);
      console.log("The hero information:", playerx);
      // console.log(playerInfo.name);
      // console.log(
      //   playerx.usrname.toLowerCase() == playerInfo.name.toLowerCase()
      // );
      if (playerx.usrname.toLowerCase() == playerInfo.name.toLowerCase()) {
        playerInfo.score = playerx.score;
        break;
      } else {
        console.log("userID already exits, please retype.");
      }
    } else {
      break;
    }
  }
  console.log(playerInfo.score);

  let playerNameInitial = getNameInitial(playerInfo.name);

  grid[playerRndX][playerRndY] = chalk.white.bgBlue(`${playerNameInitial}`);
  console.clear();
  console.log(chalk.magenta.bold("Current Map ⇊"));
  console.log(format(grid));

  console.log(
    chalk.white.bgBlue(
      `where does ${playerInfo.name} want to go?\n` +
        `UP(w) DOWN(s) LEFT(a) RIGHT(d) `
    )
  );

  while (true) {
    key = readlineSync.keyIn("", {
      hideEchoBack: true,
      mask: "",
      limit: "aswdq",
    });

    let player;
    let direction;
    console.clear();
    if (key === "w") {
      grid[playerRndX][playerRndY] = previousPos;
      direction = "Up";
      player = up(playerRndX, playerRndY);
    } else if (key === "s") {
      grid[playerRndX][playerRndY] = previousPos;
      direction = "Down";
      player = down(playerRndX, playerRndY);
    } else if (key === "a") {
      grid[playerRndX][playerRndY] = previousPos;
      direction = "Left";
      player = left(playerRndX, playerRndY);
    } else if (key === "d") {
      grid[playerRndX][playerRndY] = previousPos;
      direction = "Right";
      player = right(playerRndX, playerRndY);
    } else if (key === "q") {
      console.log("Exit");
      process.exit();
    }

    playerRndX = player[0];
    playerRndY = player[1];
    previousPos = grid[playerRndX][playerRndY];
    grid[playerRndX][playerRndY] = chalk.white.bgBlue(playerNameInitial);
    gameOver = pickupKey(grid);
    console.log(chalk.magenta.bold(`Go ${direction}, Current Map ⇊`));
    console.log(format(grid));

    playerInfo.stepChoices.push(key.trim());

    console.log(
      chalk.white.bgBlue(
        `What else would ${playerInfo.name} want to go? ('q' to leave)\n` +
          `UP(w) DOWN(s) LEFT(a) RIGHT(d) `
      )
    );

    if (gameOver) {
      break;
    }
  }

  console.log(
    "%s's step choices included %j",
    playerInfo.name,
    playerInfo.stepChoices
  );
  // console.log(playerInfo.usrID);
  let stepNum = playerInfo.stepChoices.length;
  console.log(chalk.magenta.bold(`Total number of steps is ${stepNum}`));

  // save user score ##############################################################
  if (playerInfo.score == "") {
    playerInfo.score = stepNum;
    createUser(playerInfo);
  } else if (stepNum < playerInfo.score) {
    playerInfo.score = stepNum;
    updateUser(playerInfo);
  }

  let users = await getAllUsers();
  let topplayers = [];
  users.forEach((x) => topplayers.push(x));
  console.log(" ".repeat(10), chalk.white.bgRedBright("~~~ Top Plays ~~~"));
  for (let i = 0; i < topplayers.length; i++) {
    console.log(
      chalk.blue(
        i + 1,
        "\t\t",
        topplayers[i].usrname,
        " ".repeat(20 - topplayers[i].usrname.length),
        topplayers[i].score
      )
    );
  }

  process.exit(); //same as ctrl+C
}

main();
