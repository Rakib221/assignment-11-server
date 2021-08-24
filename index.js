const express = require('express')
const cors=require('cors')
const bodyParser=require('body-parser')
require('dotenv').config()
const ObjectId= require('mongodb').ObjectId
const app = express()
const port =3050
app.use(cors())
app.use(bodyParser.json())


const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tmhor.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("assignmentDatabase").collection("assignmentDatabaseCollections");
  const  OrderCollection = client.db("assignmentDatabase").collection("saveOrder");
  const  AdminCollection = client.db("assignmentDatabase").collection("addAdmin");
  const  ReviewCollection = client.db("assignmentDatabase").collection("addReview");
 console.log("connected")

  app.post("/addService",(req, res) => {
    let added=req.body;
    serviceCollection.insertOne(added)
    .then(result=> {
      res.send(result.insertedCount > 0)
    })
  })
  app.post("/addadmin",(req, res) => {
    let admin=req.body;
    AdminCollection.insertOne(admin)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
   
  })
  app.get("/findAdmin",(req,res)=>{
    AdminCollection.find().toArray((error,doc)=>{
      res.send(doc)
    })
  })
  app.post("/addreview",(req, res) => {
    let review=req.body;
    ReviewCollection.insertOne(review)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
   
  })
  app.get('/showReview',(req,res)=>{
   ReviewCollection.find()
    .toArray((error,doc)=>{
      res.send(doc)
    })
      })
app.delete("/deleteUserOrder/:id",(req,res)=>{
  let id=ObjectId(req.params.id)
  OrderCollection.findOneAndDelete({_id:id})
})
app.patch("/update",(req,res)=>{
let id= ObjectId(req.body.id);
  OrderCollection.updateOne({_id:id},
  {
    $set:{status:req.body.status}
  })


})
  app.delete('/deleteOrder/:id',(req,res)=>{

    let id=ObjectI(req.params.id)
    OrderCollection.findOneAndDelete({_id:id})
   })
  app.post("/addorder",(req, res) => {
    let add=req.body;
    OrderCollection.insertOne(add)
    .then(result=>{
      res.send(result.insertedCount > 0)
      console.log(result)
    })
  })
  app.get("/showOrder",(req,res)=>{
      OrderCollection.find()
      .toArray((error,doc)=>{
        res.send(doc)
      })
     })


  app.get('/showservices',(req,res)=>{
serviceCollection.find()
.toArray((error,doc)=>{
  res.send(doc)
})
  })
  
});

app.get('/', (req, res) => {
  res.send('Hello World heroku!');
});
    
app.listen(process.env.PORT|| port)

