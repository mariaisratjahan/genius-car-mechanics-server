const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const cors = require('cors');

require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.un416.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// main start
async function run() {
    try {
        // client er sthe db connect hoilo
      await client.connect();
    //   console.log('connected successfully');
    const database = client.db("carMechanics");
    const servicesCollection = database.collection("services");
    // GET api---------------------load
    app.get('/services',async(req,res)=>{
        const cursor = servicesCollection.find({});
        const services=await cursor.toArray();
        res.send(services);
    })
    // GET SINGLE API---------------------objectId
    app.get('/services/:id',async(req,res)=>{
        const id=req.params.id;
        console.log(id);
        const query = {_id: ObjectId(id) };
        const service = await servicesCollection.findOne(query);
        res.json(service)


    })
    // POST api-----------------------add/insert
    app.post('/services',async(req,res)=>{
        // const service=[
        //     {
        //         name: "ENGINE DIAGNOSTIC",
        //         price: "300",
        //         description: "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
        //         img: "https://i.ibb.co/dGDkr4v/1.jpg"
        //     }            
        // ]
       console.log("hitting the post");
       const service=req.body;
       console.log(service);
       const result = await servicesCollection.insertOne(service);
       console.log(result);
       res.json(result)
    })
    // delete api----------------------ObjectId
    app.delete('/services/:id',async(req,res)=>{
      id=req.params.id;
      const query = {_id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    })
     
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})