const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

function encryptionPassword(password){
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
      return hash
    });
  });
}


// bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
// //   result == true
//   console.log(result);
// });
// bcrypt.compare(someOtherPlaintextPassword, hash, function (err, result) {
//   // result == false
// });

count = 4;
let data1 = [
  { id: uuidv4(), email: "vfev", password: 12345 },
  { id: uuidv4(), email: "fvfrttt", password: 143345 },
  { id: uuidv4(), email: "yujng", password: 12645765 },
];
let data = [];

function readAllUsers() {
  app.get("/users", (req, res) => {
    if (data.length > 0) {
      res.write(JSON.stringify(data));
    } else {
      res.write("data is empty");
    }
    res.end();
    console.log(data);
  });
}

function getUserById() {
  app.use(express.json());
  app.get("/userById", (req, res) => {
    const id = req.body.id;
    data.forEach((element) => {
      if (element.id == id) {
        res.write(JSON.stringify(element));
      }
    });
    res.end();
  });
}

function createUser() {
  app.use(express.json());
  app.post("/createUser", (req, res) => {
    const user = { id: uuidv4() };
    user.email = req.body.email;
    user.password = encryptionPassword(req.body.password);
    data.push(user);
    res.write("user created");
    console.log(data);
    count++;
    res.end();
  });
}

function updatingUser() {
  app.use(express.json());
  app.put("/updatingUser", (req, res) => {
    const id = req.body.id;
    data.forEach((element) => {
      if (element.id == id) {
        element.email = req.body.email;
        element.pasword = req.body.pasword;
        res.write("update sucsess");
      }
    });
    res.end();
  });
}

function removeUser() {
  app.use(express.json());
  app.post("/removeUser", (req, res) => {
    const id = req.body.id;
    console.log(id);
    let tempData = [];
    data.forEach((element) => {
      if (element.id != id) {
        tempData.push(element);
      }
    });
    if (data.length > tempData.length) {
      res.write("delete sucsess");
    }
    console.log(data);
    data = tempData;
    console.log(data);
    res.end();
  });
}

function connect() {
  app.use(express.json());
  app.get("/connect", (req, res) => {
    const id = req.body.id;
    const password = req.body.password;
    console.log(id, password);
    data.forEach((element) => {
      if (element.id == id && element.password == password) {
        res.write(element + "is in the system");
      }
    });
    res.end();
  });
}

readAllUsers();
getUserById();
createUser();
updatingUser();
removeUser();
connect();

app.listen(8080, () => {
  console.log("run...");
});
