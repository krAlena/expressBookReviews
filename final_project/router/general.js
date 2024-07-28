const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to check if the user exists
const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
      return user.username === username;
    });
    return userswithsamename.length > 0;
};

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  else {
    return res.status(404).json({ message: "Unable to register user without username or password." });
  }
 
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let arrBooks = [];
  Object.keys(books).forEach((prop, index) => { arrBooks.push(books[prop]) });
  
  let result = arrBooks.filter(el => el.ISBN == isbn);
  return res.send(result);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let arrBooks = [];
    Object.keys(books).forEach((prop, index) => { arrBooks.push(books[prop]) });
    
    let result = arrBooks.filter(el => el.author == author);
    return res.send(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let arrBooks = [];
    Object.keys(books).forEach((prop, index) => { arrBooks.push(books[prop]) });
    
    let result = arrBooks.filter(el => el.title == title);
    return res.send(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let arrBooks = [];
  Object.keys(books).forEach((prop, index) => { arrBooks.push(books[prop]) });
  
  let result = arrBooks.filter(el => el.ISBN == isbn);
  let review = result.reviews;
  return res.send(review);
});

module.exports.general = public_users;
