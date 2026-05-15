const express = require("express")
const cors = require("cors");
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://wanderlust:wanderlust@cluster0.8xvidah.mongodb.net/?appName=Cluster0";
const app = express()
// app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://wanderlust-snowy-rho.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());



const PORT = 5000;


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
    //await client.connect();
  
    const db = client.db("wanderlust")
    const destinationCollection = db.collection('destination')

    app.get("/destination", async(req, res)=> {
      const destinationResult = await destinationCollection.find().toArray();
      res.json(destinationResult)
    })


    app.post('/destination', async(req, res)=> {
        const destinationData = req.body
        console.log("destintion data server theke aise")
        const result = await destinationCollection.insertOne(destinationData)
        res.json(result)
    })

app.get("/destination/:id", (req, res, next) => {

  const header = req.headers.authorization

  if (header === "logged in") {
    next()
  } else {
    return res.status(401).json({
      message: "Unauthorized"
    })
  }

}, async (req, res) => {

  const { id } = req.params

  const result = await destinationCollection.findOne({
    _id: new ObjectId(id)
  })

  res.json(result)

})


    app.patch("/destination/:id", async (req, res) => {
      const {id} = req.params // j destination er data update korchi tar id 
      const updateData = req.body // ei body moddhe form er update data gula asbe

      const result = await destinationCollection.updateOne(
        {_id: new ObjectId(id)}, // for detected that field
        {$set:updateData}
      )

      res.json(result) // res.json kore data ta pathiye dibo
    })


    app.delete('/destination/:id', async(req, res)=>{
      const {id} = req.params
      const result = await destinationCollection.deleteOne({_id: new ObjectId(id)})
      res.json(result)
    })



    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.log(err);
  }
}
run().catch(console.dir);







app.get('/', (req, res)=> {
    res.send("Server is running fine")
})
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})