const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
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
    const username = req.body.username;
    const password = req.body.password;
    console.log(req.body)

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password

        }, 'access', { expiresIn: 60 * 60 });

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
    const review = req.params.review;
    const user = req.session.authorization.username;

    console.log(isbn);
    console.log(review);
    console.log(user)
    
    let totalBooks = Object.keys(books).length;
    let totalReviews = 0;
    let match = false;
    if (isbn > 0 && isbn <= totalBooks){
        // Book number is within range
        // Bheck if there is an existing review from this user
        totalReviews = Object.keys(books[isbn].reviews).length;
        for (let reviewInd = 0; reviewInd < totalReviews;  reviewInd++){
            if(books[isbn].reviews[reviewInd].user === user){
                // there is an existing review fron that user
                books[isbn].reviews[reviewInd].review = review;
                res.send(`Successfully updated the review for book ${books[isbn].title} from user ${username}`);
                match = true;
            }
        }
        if(match == false){
            // this is the first time this user submits a revier for this book
            books[isbn].reviews[reviewInd].user = username;
            books[isbn].reviews[reviewInd].review = review;
            res.send(`Successfully added a review for book ${books[isbn].title} from user ${username}`);                
        }
    }
    else{
         res.send("Invalid ISNB Number");       
    }  
  
    //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
