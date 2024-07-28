const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const axios = require('axios').default;
const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // Check if user is logged in and has valid access token
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));

const connectToURL = async(url)=>{
    const outcome = axios.get(url);
    let result = (await outcome).data;

    return  result;
}

const urlBase = 'https://zubrytskaaly-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai';
setTimeout(() => {
    //Task 10: get books list
    connectToURL(urlBase + '/').then(result => console.log(result))
    //Task 11: get book by isbn
    connectToURL(urlBase + '/isbn/9780714503844').then(result => console.log(result))
    //Task 12: get book by author
    connectToURL(urlBase + '/author/Dante Alighieri').then(result => console.log(result))
    //Task 13: get book by title
    connectToURL(urlBase + '/title/Fairy tales').then(result => console.log(result))
}, 5000)