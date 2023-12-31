const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000
//middleware
//car-service
//1mXQIropE1TfCCRL
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.CAR_USER}:${process.env.CAR_PASS}@cluster0.o8biysy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection = client.db('CarCarCar').collection('service');
    const bookingCollection = client.db('CarCarCar').collection('bookings');

    app.get('/service', async(req, res)=> {
      const cursor = serviceCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/service/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}

      const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: {  title: 1, service_id: 1, price:1, img:1, title:1 },
      };

      const result = await serviceCollection.findOne(query, options)
      res.send(result)
    })

    //sum data
    app.get('/bookings', async(req, res)=> {
      console.log(req.query.email);
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await bookingCollection.find().toArray();
      res.send(result);
    })

    //bookings
    app.post('/bookings', async(req, res)=> {
      const booking = req.body;
      console.log(booking)
      const result = await bookingCollection.insertOne(booking);
      res.send(result)

    })
    //update
    app.patch('/bookings/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const updatedBooking = req.body;
      console.log(updatedBooking)
      const updateDoc = {
      $set: {
        status: updatedBooking.status
      },
    };
    const result = await bookingCollection.updateOne(filter, updateDoc);
    res.send(result)
    })
    //delete
    app.delete('/bookings/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await bookingCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=> {
    res.send('CAR SERVICE IS RUNNING')
})
app.listen(port, ()=> {
    console.log(`CAR SERVICE is running on port, ${port}`)
})