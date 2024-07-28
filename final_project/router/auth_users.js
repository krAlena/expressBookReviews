const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 3600 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (isbn){
    let arrBooks = [];
    Object.keys(books).forEach((prop, index) => { arrBooks.push(books[prop]) });
    
    let bookForEditIndex = arrBooks.findIndex(el => el.ISBN == isbn);
    if (bookForEditIndex >= 0){
        let bookForEdit = arrBooks[bookForEditIndex];
        let newReview = {};
        newReview.review = req.body.review;
        let userName = req.session.authorization.username;
        bookForEdit.reviews[userName] = newReview;

        let bookNumberInDB = bookForEditIndex + 1;
        books[bookNumberInDB] = bookForEdit;
        return res.send(bookForEdit);
    }
    else{
        return res.status(208).json({ message: "There is no book with this isbn." });
    }
  }
  else {
    return res.status(208).json({ message: "Invalid isbn." });
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
