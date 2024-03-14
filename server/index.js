const express = require("express");
const env = require('dotenv').config();
const schema = require('./schema/schema.js');
const DB = require('./config/db.js');
const app  = express();
const { graphqlHTTP } = require('express-graphql')
// MongoDB connection function 
DB();
app.use('/graphiql' , graphqlHTTP({
      schema ,
      graphiql: process.env.NODE_ENV === 'development', 
}))

const port = process.env.PORT || 4444 ; 


app.get('/' , (req, res) => {
    res.send('Welcome to Node');
})

app.listen(port , () => { console.log(`App is running on port ${port}`)});
