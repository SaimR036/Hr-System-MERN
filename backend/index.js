
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Fuse = require('fuse.js')
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const UserModel = require('./models/UsersM');
const PostModel = require('./models/PostsM');
const FModel = require('./models/FriendsM');

app.use(express.json());

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const WebSocket = require('ws');
const JobModel = require('./models/JobsM');
const RatModel = require('./models/RatingsM');
/*
        const wss = new WebSocket.Server({ noServer: true });
        
        function startChangeStreams() {
            const changeStream = UserModel.watch();
            changeStream.on('change', (change) => {
              console.log('Change occurred:', change);
        
              wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify(change));
                }
              });
        
            });
            changeStream.on('error', (err) => {
              console.error('Change stream error:', err);
            });
          }
        
        const server = app.listen(3000, () => console.log("listening on port 3000"))
        
        server.on('upgrade', (request, socket, head) => {
            wss.handleUpgrade(request, socket, head, (socket) => {
              wss.emit('connection', socket, request);
            });
          });
        
*/


mongoose.connect('mongodb://localhost:27017/project', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected successfully");
   

        
        
      
        
        
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

    const imageSchema = new mongoose.Schema({
      name: String,
      data: String
  });
  
  const ImageModel = mongoose.model('Image', imageSchema);
  
  // Route to handle image upload
  



// Route to fetch image by ID
app.get('/image/:id', async (req, res) => {
    const imageId = req.params.id;

    try {
        // Query the database for the image with the given ID
        const image = await ImageModel.findById(imageId);

        // If the image is not found, return 404
        if (!image) {
            return res.status(404).send('Image not found');
        }
        console.log(image.date)
        // Send the image data in the response
        res.setHeader('Content-Type', 'image/jpeg'); // Set the appropriate content type (adjust as needed)
        res.json({ imageData: image.data });
    } catch (error) {
        console.error("Error retrieving image:", error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/getposts/:userId', (req, res) => {
    const userId = req.params.userId;
    console.log('node post',userId)
    PostModel.find({ Uid: userId }).maxTimeMS(30000)
        .then(users => res.json(users))
        .catch(err => {
            console.error("Error fetching users:", err);
            res.status(500).json({ error: "An internal server error occurred" });
        });
});
app.get('/getfriends/:userId', async(req, res) => {
    try{
    const userId = req.params.userId;
    console.log('node post',userId)
    const friends = await FModel.find({
        $or: [
            { Fid1: userId },
            { Fid2: userId }
        ]
    }).maxTimeMS(30000);
        console.log(friends)
    // Extract Fid and Fid1 values from the result
    const friendIds = friends.map(friend => friend.Fid1 === userId ? friend.Fid2 : friend.Fid1);
    console.log(friendIds)
        res.json(friendIds)
}catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Internal server error' });
}
});



app.get('/getuser/:userId', (req, res) => {
    const userId = req.params.userId;
    console.log('node user',userId)

    const userIdObject = new mongoose.Types.ObjectId(userId);

    UserModel.findById(userIdObject).maxTimeMS(30000)
        .then(users => res.json(users))
        .catch(err => {
            console.error("Error fetching users:", err);
            res.status(500).json({ error: "An internal server error occurred" });
        });
});
app.put('/updateWeights', async (req, res) => {
  const randomWeights = Array.from({length: 100}, () => Math.random());
  console.log('gone')
  try {
    await UserModel.updateMany(
      {}, 
      { $set: { weights: randomWeights } }
    );
    console.log('done')
    res.status(200).send('Documents updated successfully');
  } catch (err) {
    console.error('Error updating documents:', err);
    res.status(500).send('Internal Server Error');
  }
});
app.put('/updateFeatures', async (req, res) => {
  const randomWeights = Array.from({length: 100}, () => Math.random());
  console.log('gone')
  try {
    await JobModel.updateMany(
      {}, 
      { $set: { features: randomWeights } }
    );
    console.log('done')
    res.status(200).send('Documents updated successfully');
  } catch (err) {
    console.error('Error updating documents:', err);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/fetchSimilar/:text', async (req, res) => {
    const searchQuery = req.params.text;
    const data  = await UserModel.find({}).maxTimeMS(30000)
    console.log(searchQuery)
    const options = {
      keys: ['Name'],
      includeScore: true,
      limit: 3 // Limit the number of results
    };
    const fuse = new Fuse(data, options);
    const result = fuse.search(searchQuery);
    console.log(result)
    res.json(result);
  });
app.get('/ai', async (req, res) => {

    var W=[]
    var X=[]

    const users  = await UserModel.find({}).maxTimeMS(30000)
    const jobs = await JobModel.find({});
    let Y = new Array(users.length-1).fill().map(() => new Array(jobs.length).fill(0));
    let R = new Array(users.length-1).fill().map(() => new Array(jobs.length).fill(0));

    for(var user of users)
      {
        W.push(user['weights'])
      }
    var i=0;var j=0;
    for(var job of jobs) {
      X.push(job['features'])
      for(var user of users)
        {
          const ys  = await RatModel.find({Uid:user['id'],Pid:job['id']}).maxTimeMS(30000)
          if(ys.length!=0)
            {

          Y[i][j] = ys[0]['Val']
          if(ys['Val']==-1)
            {
              R[i][j] = 0
            }
            else{
              R[i][j] = 1
            }
          }
          
            j++;
        }
        j=0;
        i++;
      }
      console.log(W)
      let data = {
        W: W,
        X: X,
        Y: Y,
        R: R
    };

    fetch('http://localhost:5000/getrec', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
      console.log(data);
  })
  .catch((error) => {
      console.error('Error:', error);
  });
});
  
app.post('/upload', async (req, res) => {
    const imageData = req.body.Image; // Assuming you're sending the base64-encoded image data in the request body
    const imageBuffer = Buffer.from(imageData, 'base64');
    const currentDate = new Date();
    console.log(req.body.Description)
    // Convert base64-encoded image data to a buffer  
    // Save the image data to MongoDB
    try {
        const newImage = new PostModel({ Description:req.body.Description,Image:imageData,Uid:req.body.Uid,Date:currentDate});
        await newImage.save();
        res.status(201).send('Image uploaded successfully');
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).send('Internal Server Error');
    }
});
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = require('stripe')('sk_test_51LaJyyJRoEbhRvRPter71NYTMl5ZKKFrd6IOEPbfaMbYjZx4g5Zyw7l7o3Wp6Dj1RSNfA4kBbrhLT7fFq68Ycdg000rszxVZi5');
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:3000';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1PGytRJRoEbhRvRPD692b7yn',
        quantity: 1,
      },
    ],
    mode: 'payment',
    return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.send({clientSecret: session.client_secret});
});

app.get('/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});


httpServer.listen(3001, () => {
    console.log("Server is running on port 3001");
});
