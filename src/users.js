const jwt = require("jsonwebtoken");
const { connectDb } = require("./dbConnect");

exports.createUser = (req, res) => {
  // first, let's do some validation... (email, password)
  if (!req.body || !req.body.email || !req.body.password) {
    // invalid request
    res.status(400).send({
      success: false,
      message: "Invalid request",
    });
    return;
  }
  const newUser = {
    email: req.body.email.toLowerCase(),
    username: req.body.username,
    password: req.body.password,
    isAdmin: false,
    userRole: 5,
  };
  const db = connectDb();
  db.collection("users")
    .add(newUser)
    .then((doc) => {
      const user = {
        // this will become the payload for our JWT
        id: doc.id,
        email: newUser.email,
        isAdmin: false,
        userRole: 5,
      };
      // TODO: create a JWT and send back the token
      const token = jwt.sign(user, "doNotShareYourSecret");
      console.log(token);
      res.status(201).send({
        success: true,
        message: "Account created",
        token, // add this to token later
        id: user.id, //test
      });
    })
    .catch((err) =>
      res.status(500).send({
        success: false,
        message: err.message,
        error: err,
      })
    );
};

exports.loginUser = (req, res) => {
  // first, let's do some validation... (email, password)
  if (!req.body || !req.body.email || !req.body.password) {
    // invalid request
    res.status(400).send({
      success: false,
      message: "Invalid request",
    });
    return;
  }
  const db = connectDb();
  db.collection("users")
    .where("email", "==", req.body.email.toLowerCase())
    .where("password", "==", req.body.password)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        // bad login
        res.status(401).send({
          success: false,
          message: "Invalid email or password",
        });
        return;
      }
      // good login
      const users = snapshot.docs.map((doc) => {
        let user = doc.data();
        user.id = doc.id;
        user.password = undefined;
        return user;
      });
      const token = jwt.sign(users[0], "doNotShareYourSecret");
      const decode = jwt.verify(token, "doNotShareYourSecret");
      res.send({
        success: true,
        message: "Login successful",
        token,
        id: decode.id,
      });
    })
    .catch((err) =>
      res.status(500).send({
        success: false,
        message: err.message,
        error: err,
      })
    );
};

exports.getUsers = (req, res) => {
  // //first make sure the user sent authorization token
  // if (!req.headers.authorization) {
  //   return res.status(403).send({
  //     success: false,
  //     message: "No authorization token found",
  //   });
  // }
  // // TODO: Protect this route with JWT
  // const decode = jwt.verify(req.headers.authorization, "doNotShareYourSecret");
  // console.log("NEW REQUEST BY:", decode.id);
  // if (decode.userRole > 5) {
  //   return res.status(401).send({
  //     success: false,
  //     message: "Not authorized",
  //   });
  // }
  const db = connectDb();
  db.collection("users")
    .get()
    .then((snapshot) => {
      const users = snapshot.docs.map((doc) => {
        let user = doc.data();
        user.id = doc.id;
        //user.password = undefined;
        return user;
      });
      res.send({
        success: true,
        message: "Users returned",
        users,
      });
    })
    .catch((err) =>
      res.status(500).send({
        success: false,
        message: err.message,
        error: err,
      })
    );
};

exports.getMessages = (req, res) => {
  // //first make sure the user sent authorization token
  // if (!req.headers.authorization) {
  //   return res.status(403).send({
  //     success: false,
  //     message: "No authorization token found",
  //   });
  // }
  // // TODO: Protect this route with JWT
  // const decode = jwt.verify(req.headers.authorization, "doNotShareYourSecret");
  // console.log("NEW REQUEST BY:", decode.id);
  // if (decode.userRole > 5) {
  //   return res.status(401).send({
  //     success: false,
  //     message: "Not authorized",
  //   });
  //}
  const db = connectDb();
  db.collection("messages")
    // .where("uidSend","==",req.query.uidSend)
    // .where("uidReceive","==",req.query.uidReceive)
    .get()
    .then((snapshot) => {
      const messages = snapshot.docs.map((doc) => {
        let message = doc.data();
        message.id = doc.id;
        return message;
      });
      res.send({
        success: true,
        message: "Messages returned",
        messages,
        
      });
    })
    .catch((err) =>
      res.status(500).send({
        success: false,
        message: err.message,
        error: err,
      })
    );
};

exports.sendMessage = (req, res) => {
  // //first make sure the user sent authorization token
  // if (!req.headers.authorization) {
  //   return res.status(403).send({
  //     success: false,
  //     message: "No authorization token found",
  //   });
  // }
  // // TODO: Protect this route with JWT
  // const decode = jwt.verify(req.headers.authorization, "doNotShareYourSecret");
  // console.log("NEW REQUEST BY:", decode.id);
  // if (decode.userRole > 5) {
  //   return res.status(401).send({
  //     success: false,
  //     message: "Not authorized",
  //   });
  // }

  const newMessage = {
    text: req.body.text,
    uidSend: req.body.uidSend,
    uidReceive: req.body.uidReceive,
    //createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
  };
  const db = connectDb();
  db.collection("messages")
    .add(newMessage)
    .then((doc) => {
      res.status(201).send(doc.id);
    })
    .catch((err) =>
      res.status(500).send({
        success: false,
        message: err.message,
        error: err,
      })
    );
};
