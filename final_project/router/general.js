const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let totalBooks = Object.keys(books).length;
    if (isbn > 0 && isbn <= totalBooks){
        res.send(books[isbn]);
    }
    else{
        res.send("Invalid ISNB Number");     
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    const author = req.params.author;
    let filtered_books = {};
    numBooks = 0;
    let totalBooks = Object.keys(books).length

    for (bookNum = 1; bookNum <= totalBooks; bookNum++){   
        if (books[bookNum].author === author){
            filtered_books[numBooks] = books[bookNum];
            numBooks++;
        }
    }
  res.send(filtered_books);

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    const title = req.params.title;
    let filtered_books = {};
    numBooks = 0;
    let totalBooks = Object.keys(books).length;

    for (bookNum = 1; bookNum <= totalBooks; bookNum++){   
        if (books[bookNum].title === title){
            filtered_books[numBooks] = books[bookNum];
            numBooks++;
        }
    }
  res.send(filtered_books);   
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

    const isbn = req.params.isbn;
    let totalBooks = Object.keys(books).length;
    if (isbn > 0 && isbn <= totalBooks){
        res.send(books[isbn].reviews);
    }
    else{
         res.send("Invalid ISNB Number");       
    }


});

module.exports.general = public_users;
