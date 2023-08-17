const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

const bcrypt = require("bcrypt");
const saltRounds = 10;
let data = [];
app.use(express.json());

app.get("/users", (req, res) => {
  if (data.length > 0) {
    res.send(JSON.stringify(data));
  } else {
    res.send("data is empty");
  }
});

app.get("/userById/:id", (req, res) => {
  const id = req.params.id;
  data.forEach((element) => {
    if (element.id == id) {
      res.json(element);
    }
  });
});

app.post("/user", (req, res) => {
  const user = { id: uuidv4() };
  user.email = req.body.email;
  const password = req.body.password;
  bcrypt.hash(password, saltRounds).then((hash) => {
    user.password = hash;
    data.push(user);
    res.send("user created");
  });
});

app.put("/user", (req, res) => {
  const id = req.body.id;
  data.forEach((element) => {
    if (element.id === id) {
      element.email = req.body.email;
      element.pasword = bcrypt.hashSync(req.body.password, saltRounds);
      res.send("update sucsess");
    }
  });
});

app.delete("/user", (req, res) => {
  const id = req.body.id;
  let tempData = [];
  data.forEach((element) => {
    if (element.id != id) {
      tempData.push(element);
    }
  });
  if (data.length > tempData.length) {
    res.send("delete sucsess");
  }
  data = tempData;
});

app.post("/connect", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  data.forEach((element) => {
    bcrypt.compare(password, element.password).then((check) => {
      if (check && element.email === email) {
        res.send(element.email + "is in the system");
      }
    });
  });
});

app.listen(8080, () => {
  console.log("run...");
});
