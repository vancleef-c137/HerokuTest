const express = require("express");
const app = express();
const cors = require("cors");
//const pool = require("./db");
var path = require('path');
const { Pool } = require('pg');
require ('dotenv').config()
//middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES//


//create a todo
// connect to DB 




const db = new Pool({
  connectionString: process.env.DATABASE_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

// if prodcution use front
// if(process.env.NODE_ENV==='production'){
//     app.use(express.static(path.resolve(__dirname, "./client/build")));
// }
app.use(express.static(path.resolve(__dirname, "./client/build")));



//welcome
app.get('/', (req, res) => {
    res.send('<h1>Hello Salesforce Devs from Express</h1>');
  });




app.post("/todos", async(req,res) =>{
    //await
    //awaitoooo
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            //"INSERT INTO salesforce.todos__c(description__c, externalid__c) VALUES($1, '3') RETURNING *"
         [description]
         );
         res.json(newTodo.rows[0]);
        
    } catch (error) {
        console.error(error.message);
    }
})



// get all todos 

app.get("/todos", async(req,res)=>{
    try {
        const allTodos = await pool.query("SELECT * FROM salesforce.todos__c");
        res.json(allTodos.rows);
    } catch (error) {
        console.error(error.message);
    }
})


// get a todo

app.get("/todos/:id", async(req,res)=>{
    try {
        const {id} = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        res.json(todo.rows[0]);
    } catch (error) {
        console.error(error.message)
    }
})


// update a todo


app.put("/todos/:id", async(req,res)=>{
    try {
        const {id} =req.params;
        const {description} = req.body;
        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2",
            [description, id]
            );
            res.json("Todo was updated!");
    } catch (error) {
        console.error(error.message);
    }
})



// delete a todo


app.delete("/todos/:id", async(req,res)=>{
    try {
        const {id} = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id =$1", [id]
);
res.json("Todo was Deleted!");
    } catch (error) {
        console.error(error.message);
    }
})




app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });