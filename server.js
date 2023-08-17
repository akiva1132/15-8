const express = require("express");
const { v4: uuidv4 } = require("uuid");
const jsonfile = require("jsonfile");
const app = express();

const bcrypt = require("bcrypt");
const saltRounds = 10;
let fileData = "./data.json";
app.use(express.json());

async function importProduct() {
  const response = await fetch("https://dummyjson.com/products", {
    method: "get",
  });
  if (response.ok) {
    return await response.json();
  }
}

async function sendToStore(user){
  const response = await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "post",
    body: JSON.stringify(user)
  });
  if (response.ok) {
    let res =  await response.json();
    console.log(res)
  }
}



async function getData() {
  let promise = new Promise((resolve, reject) => {
    jsonfile.readFile(fileData, (err, resultData) => {
      if (err) reject(err);
      resolve(resultData);
    });
  });
  return promise;
}

async function checkPassword(password, passwordFromdata) {
  let promise = new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordFromdata).then((check) => {
      if (check === true) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
  return promise;
}

function emailIntegrityCheck(email) {
  const check = email.split("@");
  if (check.length === 2 && check[1].includes(".")) {
    return true;
  }
}

function passwordIntegrityCheck(password) {
  let bigChar = false;
  let smallChar = false;
  let count = 0;
  for (i of password) {
    count++;
    if (i.charCodeAt(0) >= 65 && i.charCodeAt(0) <= 97) {
      bigChar = true;
    } else if (i.charCodeAt(0) >= 97 && i.charCodeAt(0) <= 122) {
      smallChar = true;
    }
  }
  if (bigChar === true && smallChar === true && count >= 8) {
    return true;
  }
}

app.get("/users", async (req, res) => {
  let data = await getData();
  if (data.length > 0) {
    res.json(data);
  } else {
    res.send("data is empty");
  }
});

app.get("/userById/:id", async (req, res) => {
  let data = await getData();
  const id = req.params.id;
  data.forEach((element) => {
    if (element.id == id) {
      res.json(element);
    }
  });
});

app.post("/user", async (req, res) => {
  if (
    passwordIntegrityCheck(req.body.password) &&
    emailIntegrityCheck(req.body.email)
  ) {
    let data = await getData();
    const user = { id: uuidv4() };
    user.email = req.body.email;
    const password = req.body.password;
    const product = await importProduct().then((a) => a.products[Math.floor(Math.random() * 10)].description
    );
    user.product = product;
    bcrypt.hash(password, saltRounds).then(async (hash) => {
      user.password = hash;
      data.push(user);
      await sendToStore(user)
      jsonfile.writeFile(fileData, data, (err, resultData) => {
        if (err) {
          res.send(err);
        }
        res.send("user created");
      });
    });
  } else {
    res.send("invaild pasword or email");
  }
});

app.put("/user", async (req, res) => {
  if (
    passwordIntegrityCheck(req.body.password) &&
    emailIntegrityCheck(req.body.email)
  ) {
    let data = await getData();
    const id = req.body.id;
    let find = false;
    data.forEach((element) => {
      if (element.id === id) {
        find = true;
        element.email = req.body.email;
        element.pasword = bcrypt.hashSync(req.body.password, saltRounds);
      }
    });
    jsonfile.writeFile(fileData, data, (err, resultData) => {
      if (err) {
        res.send(err);
      }
      if (find) {
        res.send("update sucsess");
      } else {
        res.send("id not found");
      }
    });
  } else {
    res.send("invaild pasword or email");
  }
});

app.delete("/user/:id", async (req, res) => {
  let data = await getData();
  const id = req.params.id;
  let tempData = [];
  data.forEach((element) => {
    if (element.id != id) {
      tempData.push(element);
    }
  });
  if (data.length > tempData.length) {
    res.send("delete sucsess");
  }
  jsonfile.writeFile(fileData, tempData, (err, resultData) => {
    if (err) {
      res.send(err);
    }
  });
});

app.post("/connect", async (req, res) => {
  let data = await getData();
  const email = req.body.email;
  const password = req.body.password;
  let find = false;
  data.forEach(async (element) => {
    let result = await checkPassword(password, element.password);
    if (element.email === email && result) {
      find = true;
      res.send(element.email + " user found");
    }
  });
});

app.listen(9051, () => {
  console.log("run...");
});
