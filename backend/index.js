
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Fuse = require('fuse.js')
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const bcrypt = require('bcrypt');
const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const PostModel = require('./models/PostsM');
const FModel = require('./models/FriendsM');
const Users = require('./models/iqrausers.js');
const Company = require('./models/company.js');
const Chat = require('./models/chat.js');
const Posts = require('./models/Posts');

const crypto = require('crypto');
const sendEmail = require('./sendEmail');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // Add this line to enable credentials support
}));

app.use(express.json());

const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log(jwtSecret);
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const WebSocket = require('ws');
const JobModel = require('./models/JobsM');
const RatModel = require('./models/RatingsM');
const ReqModel = require('./models/RequestsM');
const iqraFModel = require('./models/iqraFriendsM.js');



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
  
  app.post("/signup/person", async (req, res) => {
    try {
        const { email, password, firstName, lastName,location,industry,Headline,Photo } = req.body;
        
        // Check if the user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            console.log('email exists');
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const Name = firstName + ' ' + lastName;
        const weights = Array.from({length: 100}, () => Math.random());
        const b = Math.floor(Math.random() * 100); // Generates a random integer between 0 and 99
        var ban=0;
        var prem=0;
        // Create a new user document
        let user = new Users({
            email,
            password: hashedPassword,
            firstName,
            lastName,   
            location,
            industry,
            Headline,
            Photo,
            Name,
            weights,
            b,
            ban,
            prem
           
        });
        let result = await user.save();
       
    const use = await Users.find({
        email:email
    }).maxTimeMS(30000);

        console.log(use)
        let Uid= use[0]['_id']
        console.log(Uid)
    let Val=-1;
        const jobs = await JobModel.find({});
        for(var job of jobs)
          {
            let Pid = job['_id']
            let user = new RatModel({
              Uid,
              Pid,
              Val
             
          });
          let result1 = await user.save();
          }
        
        res.status(201).json(result);
    } catch (error) {
        console.error('Person Signup Error:', error);
        // Check if the error is due to validation or internal server error
        if (error.name === 'ValidationError') {
            // Return validation errors
            const errors = Object.values(error.errors).map(err => err.message);
            res.status(400).json({ error: errors });
        } else {
            // Return internal server error
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Endpoint for company signup
app.post("/signup/company", async (req, res) => {
    try {
        console.log(req.body);
        const { email, password, name, locations, industry,type } = req.body;
        
        // Check if the company already exists
        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new company document
        let newCompany = new Company({
            email,
            password: hashedPassword,
            name,
            locations,
            industry,
            type,
            
        });

        // Save the company document
        let result = await newCompany.save();
        res.status(201).json(result);
    } catch (error) {
        console.error('Company Signup Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});





// login
app.post("/login", async (req, res) => {
  try {
      const { email, password } = req.body;
      let user;

      // Check if the user exists in the Users collection
      user = await Users.findOne({ email });

      // If user doesn't exist in Users collection, check in Company collection
      if (!user) {
          const company = await Company.findOne({ email });

          // If user doesn't exist in Company collection, return error
          if (!company) {
              return res.status(400).json({ error: 'User does not exist' });
          }

          // If user exists in Company collection, use company's ID and password for authentication
          user = { _id: company._id, password: company.password };
      }

      // Compare the password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ error: 'Incorrect password' });
      }

      // Generate token
      const token = jwt.sign({ userId: user._id }, '2b35cff4dc0cd006645882f6037eccaa0828d278779e1e53fc7c865c6afe598e', { expiresIn: '1h' });

      // Set the cookie in the response
      res.cookie(String(user._id), token, {
          path: "/",
          expires: new Date(Date.now() + 1000 * 60 * 60), // Token expires in 1 hour
          httpOnly: true,
          sameSite: "lax",
      });

      res.status(200).json({ message: 'Login successful', token });
      // Send login notification emailcd
      const emailContent = `Hello ${user.firstName}, you have successfully logged in!`;
      console.log(user.firstName);
      await sendEmail(user.email, 'Login Notification', emailContent);
      
  } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// CHAT AREA
app.post("/send-message", async (req, res) => {
  try {
      const { sender_id, receiver_id, message } = req.body;

      const newMessage = new Chat({
          sender_id,
          receiver_id,
          message,
          time: Date.now()
      });

      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
  } catch (error) {
      console.error('Send Message Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



app.get("/messages/:userId", async (req, res) => {
  try {
      const { userId } = req.params;

      const messages = await Chat.find({
          $or: [
              { sender_id: userId },
              { receiver_id: userId }
          ]
      });

      res.status(200).json(messages);
  } catch (error) {
      console.error('Retrieve Messages Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/users/:userId', async (req, res) => {
  try {
      const { userId } = req.params;
      const user = await Users.findById(userId); 
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      
      const username = `${user.firstName} ${user.lastName}`;
      res.status(200).json({ username});
  } catch (error) {
      console.error('Get User Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/getfriend/:userId', async(req, res) => {
  try{
  const userId = req.params.userId;
 
  const friends = await iqraFModel.find({
      $or: [
          { Fid1: userId },
          { Fid2: userId }
      ]
  }).maxTimeMS(30000);
     // console.log(friends)
  // Extract Fid and Fid1 values from the result
  const friendIds = friends.map(friend => friend.Fid1 === userId ? friend.Fid2 : friend.Fid1);
  //console.log(friendIds)
      res.json(friendIds)
}catch (error) {
  console.error('Error fetching friends:', error);
  res.status(500).json({ error: 'Internal server error' });
}
});

app.get('/user/:userId', async (req, res) => {
  try {
      const { userId } = req.params;
      const user = await Users.findById(userId); 
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user); // Return the entire user object
  } catch (error) {
      console.error('Get User Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



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

app.get('/getwholefriends/:userId', async(req, res) => {
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
          var sends=[]
        for(var user of friendIds)
          {
          const userIdObject = new mongoose.Types.ObjectId(user);

          const obj = await Users.findById(userIdObject).maxTimeMS(30000)
            sends.push(obj)
          }
          //const jsonToSend = JSON.stringify(sends);
        res.json(sends)
          

      }catch (error) {
          console.error('Error fetching friends:', error);
          res.status(500).json({ error: 'Internal server error' });
      }
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


app.get('/getPending/:userId',  (req, res) => {
  const userId = req.params.userId;
  console.log('node user',userId)


  ReqModel.find({Rid:userId}).maxTimeMS(30000)
      .then(async users => {
        console.log(users)
        var sends=[]
        for(var user of users)
          {
          const userIdObject = new mongoose.Types.ObjectId(user['Sid']);

          const obj = await Users.findById(userIdObject).maxTimeMS(30000)
            sends.push(obj)
          }
          //const jsonToSend = JSON.stringify(sends);
        res.json(sends)

      })
      .catch(err => {
          console.error("Error fetching users:", err);
          res.status(500).json({ error: "An internal server error occurred" });
      });
});


app.get('/getallusers', (req, res) => {



  Users.find({}).maxTimeMS(30000)
      .then(users => res.json(users))
      .catch(err => {
          console.error("Error fetching users:", err);
          res.status(500).json({ error: "An internal server error occurred" });
      });
});
// app.put('/updateWeights', async (req, res) => {
//   const randomWeights = Array.from({length: 100}, () => Math.random());
//   console.log('gone')
//   try {
//     await Users.updateMany(
//       {}, 
//       { $set: { weights: randomWeights } }
//     );
//     console.log('done')
//     res.status(200).send('Documents updated successfully');
//   } catch (err) {
//     console.error('Error updating documents:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });
// app.put('/updateFeatures', async (req, res) => {
//   const randomWeights = Array.from({length: 100}, () => Math.random());
//   console.log('gone')
//   try {
//     await JobModel.updateMany(
//       {}, 
//       { $set: { features: randomWeights } }
//     );
//     console.log('done')
//     res.status(200).send('Documents updated successfully');
//   } catch (err) {
//     console.error('Error updating documents:', err);
//     res.status(500).send('Internal Server Error');
//   }
// });
async function checkreqs(id)
{
  const data  = await ReqModel.find({Rid:id}).maxTimeMS(30000)
  const data1  = await ReqModel.find({Sid:id}).maxTimeMS(30000)

  if(data.length==1)
    {
      return -1
    }
  else if(data1.length==1)
    {
      return 1
    }
    else {
      return 0;
    }
}
app.get('/fetchSimilar/:text', async (req, res) => {
    const searchQuery = req.params.text;
    const data  = await Users.find({}).maxTimeMS(30000)
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
    var b=[]
    const users  = await Users.find({}).maxTimeMS(30000)
    const jobs = await JobModel.find({});
    let Y = new Array(users.length-1).fill().map(() => new Array(jobs.length).fill(0));
    let R = new Array(users.length-1).fill().map(() => new Array(jobs.length).fill(0));
    var k=0;
    for(var user of users)
      {
        if(k!=users.length-1)
          {
            console.log(user['b'])

        W.push(user['weights'])
        b.push(user['b'])
          }
          k+=1;
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
          if(ys[0]['Val']==-1)
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
      console.log(b)
      let data = {
        W: W,
        X: X,
        Y: Y,
        R: R,
        B:b
    };

    fetch('http://localhost:5000/getrec', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then( async data => {
    var W = data['W']
    var B = data['B']
    var X = data['X']
    var l=0;
    for(var user of users) 
      {
        if (l!=user.length-1)
          {
        try  {
          console.log(user['id'])
          await Users.updateOne(
            { _id: user['id'] }, 
            { $set: { weights: W[l], b: B[0][l]} }
          );
      } catch (error) {
          console.error(error);
      } 
    }
    l+=1
      }
      l=0
      for(var job of jobs) 
        {
        
          try  {
            await JobModel.updateOne(
              { _id: job['id'] }, 
              { $set: { features:X[l]} }
            );

        } catch (error) {
            console.error(error);
        } 
      
      l+=1
    }
 
  })
  .catch((error) => {
      console.error('Error:', error);
  });
});
function sigmoid(x){
  return 1 / (1 + Math.exp(-x));
}

app.get('/banUser/:userId',async (req, res) => {
  const userId = req.params.userId;
  try  {
    await Users.updateOne(
      { _id: userId }, 
      { $set: { ban:1} }
    );
  
  } catch (error) {
    console.error(error);
  }       
      
});

app.get('/setPrem/:userId',async (req, res) => {
  const userId = req.params.userId;
  try  {
    await Users.updateOne(
      { _id: userId }, 
      { $set: { prem:1} }
    );
  
  } catch (error) {
    console.error(error);
  }       
      
});

app.get('/UnbanUser/:userId',async (req, res) => {
  const userId = req.params.userId;
  try  {
    await Users.updateOne(
      { _id: userId }, 
      { $set: { ban:0} }
    );
  
  } catch (error) {
    console.error(error);
  }       
      
});
app.get('/getJobs/:id', async (req, res) => {
  const id = req.params.id;
  var W=[]
  var X=[]
  var b=[]
  const user  = await Users.find({_id:id}).maxTimeMS(30000)
  console.log(user)
  const jobs = await JobModel.find({});
  var k=0;
  var sc=[]
  for(var job of jobs)
    {
      let dotProduct = 0;
      for(let i = 0; i < user[0]['weights'].length; i++) {
          dotProduct += user[0]['weights'][i] * job['features'][i];
      }     
       sc.push(sigmoid(dotProduct + user[0]['b']))


    }
    console.log(sc)

    for(var i=0;i<jobs.length-1;i++){
      for(var j=0;j<jobs.length-1;j++)
  {
      if (sc[j]<sc[j+1])
      {
          var temp = jobs[j]
          jobs[j]=jobs[j+1]
          jobs[j+1] = temp
          var temp1 = sc[j]
          sc[j]=sc[j+1]
          sc[j+1] = temp1
      }
  }
    }
    res.json(jobs)

  })
app.post('/upload', async (req, res) => {
    const imageData = req.body.Image; // Assuming you're sending the base64-encoded image data in the request body
    const imageBuffer = Buffer.from(imageData, 'base64');
    const currentDate = new Date();
    console.log(req.body.Description)
    // Convert base64-encoded image data to a buffer  
    // Save the image data to MongoDB
    try {
        const newImage = new PostModel({ Description:req.body.Description,Image:imageData,Uid:req.body.Uid,Date:currentDate,likes:[],comments:[],});
        await newImage.save();
        res.status(201).send('Image uploaded successfully');
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/sendReq', async (req, res) => {
  const Sid = req.body.Sid;
  const Rid = req.body.Rid; 

  try {
    const newReq = new ReqModel({
      Sid: Sid,
      Rid: Rid
    });
    
    // Save the record
    newReq.save((err, savedReq) => {
      if (err) {
        console.error("Error saving record:", err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log("Record saved successfully:", savedReq);
        res.status(201).send("Record added successfully");
  }})
    res.status(201).send('Image uploaded successfully');
  } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).send('Internal Server Error');
  }
});
app.post('/makeFriend', async (req, res) => {
  const Sid = req.body.Sid;
  const Rid = req.body.Rid;

  try {
    const newReq = new FModel({
      Fid1: Sid,
      Fid2: Rid
    });

    // Save the record
    await newReq.save();

    console.log("Record saved successfully");
    res.status(201).send("Record added successfully");
  } catch (error) {
    console.error("Error saving record:", error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/remFriend', async (req, res) => {
  const Sid = req.body.Sid;
  const Rid = req.body.Rid; 

  const query = { Sid: Sid, Rid:Rid};
FModel.findOneAndDelete(query, (err, deletedDoc) => {
  if (err) {
    console.error("Error deleting record:", err);
    res.status(500).send("Internal Server Error");
  } else if (!deletedDoc) {
    console.log("No matching record found");
    res.status(404).send("Record not found");
  } else {
    console.log("Record deleted successfully:", deletedDoc);
    res.status(200).send("Record removed successfully");
  }
});
})
app.post('/remReq', async (req, res) => {
  const Sid = req.body.Sid;
  const Rid = req.body.Rid;
  console.log(Sid, Rid);

  const query = { Sid: Sid, Rid: Rid };

  try {
    const deletedDoc = await ReqModel.findOneAndDelete(query);

    if (!deletedDoc) {
      console.log("No matching record found");
      res.status(404).send("Record not found");
    } else {
      console.log("Record deleted successfully:", deletedDoc);
      res.status(200).send("Record removed successfully");
    }
  } catch (err) {
    console.error("Error deleting record:", err);
    res.status(500).send("Internal Server Error");
  }
});


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

const sendEmailsToUsers = async () => {
  try {
    const users = await Users.find({}); // Fetch all users from the database

    for (const user of users) {
      const emailContent = `Hello ${user.firstName}, this is an auto-generated email!`;
      await sendEmail(user.email, 'Auto-Generated Email', emailContent);
    }

    console.log('All emails sent successfully');
  } catch (error) {
    console.error('Error sending emails:', error);
  } 
};
require('dotenv/config')

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:false}))












console.log("in roites");



app.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  console.log("Fetching user with ID:", userId);
  try {
      const userData = await User.findById(userId).exec();
      if (!userData) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.json(userData);
  } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/singleuser/:userid', async (req, res) => {
  const userId = req.params.userid; // Get the user ID from the request parameters
  try {
    console.log("in single user");
      const userData = await User.findById(userId).exec(); // Find the user by ID
      if (!userData) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.json(userData); // Send the user data as JSON response
  } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/activity/:userId', async (req, res) => {
  console.log("here in /activity");
    try {
      const userId = req.params.userId;
      // Fetch posts associated with the specified user ID
      const posts = await Posts.find({ author: userId }).populate('author', 'firstName lastName headline profilePicture connections').populate('comments.author', 'firstName lastName headline');; // Populate the author field with user's first and last name
      console.log(posts)
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  

  app.get('/experience/:userId',async(req,res)=>{

    const userId = req.params.userId;
    try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const experiences = user.experience;
      res.json(experiences);
  } catch (error) {
      console.error('Error fetching experiences:', error);
      res.status(500).json({ error: 'Internal server error' });
  }




  });
  app.get('/education/:userId',async(req,res)=>{

    const userId = req.params.userId;
    try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const education = user.education;
      res.json(education);
  } catch (error) {
      console.error('Error fetching education:', error);
      res.status(500).json({ error: 'Internal server error' });
  }




  });

  app.delete('/education/:userid/:educationId', async (req, res) => {
    try {
        const { userid, educationId } = req.params;

        // Find the user by userid
        const user = await User.findById(userid);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the index of the experience with the given experienceId
        const educationIndex = user.education.findIndex(edu => edu._id == educationId);
          console.log("exp",educationId);
        if (educationIndex === -1) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        // Remove the experience from the experiences array
        user.education.splice(educationIndex, 1);

        // Save the updated user object
        await user.save();

        return res.status(200).json({ message: 'Experience deleted successfully' });
    } catch (error) {
        console.error('Error deleting experience:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});





  app.post('/createpost',async (req, res) => {
    try {
        // Extract post data from the request body
        const { content,file,author, likes, comments, createdAt } = req.body;
        console.log("in create post");

        // Create a new post instance
        const newPost = new Posts({
            content,
            image:file,
            authorType:"users",
            author,
            likes,
            comments,
            createdAt
            // Add other fields as needed
        });

        // Save the new post to the database
        await newPost.save();

        // Respond with a success message
        res.status(201).json({ message: 'Post created successfully', postId: newPost._id });
    } catch (error) {
        console.error('Error creating post:', error);
        // If an error occurs, respond with an error message
        res.status(500).json({ message: 'Failed to create post' });
    }
});


app.delete('/experience/:userid/:experienceId', async (req, res) => {
    try {
        const { userid, experienceId } = req.params;

        // Find the user by userid
        const user = await User.findById(userid);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the index of the experience with the given experienceId
        const experienceIndex = user.experience.findIndex(exp => exp._id == experienceId);
          console.log("exp",experienceId);
        if (experienceIndex === -1) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        // Remove the experience from the experiences array
        user.experience.splice(experienceIndex, 1);

        // Save the updated user object
        await user.save();

        return res.status(200).json({ message: 'Experience deleted successfully' });
    } catch (error) {
        console.error('Error deleting experience:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/experience/:userid', async (req, res) => {
    const { userid } = req.params; // Extract userid from URL parameters
    const { title, company, startDate, endDate, location, locationType, description } = req.body; // Extract data from request body
    console.log("here in addingn new exp")
    try {
        // Find the user by userid
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new experience
        const newExperience = {
            title: title,
            company: company,
            startDate: startDate,
            endDate: endDate,
            location: location,
            locationType: locationType,
            description: description
        };

         console.log( user.lastName)
        user.experience = user.experience || []; // Initialize experiences array if it's undefined
        console.log("User after initializing experience array:", user);
user.experience.push(newExperience);
console.log("User after pushing newExperience:", user);

        // Save the updated user object
        await user.save();

        // Send a success response
        res.status(201).json({ message: 'Experience added successfully', experience: newExperience });
    } catch (error) {
        console.error('Error adding experience:', error);
        // Send an error response
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.post('/education/:userid', async (req, res) => {
  const { userid } = req.params; // Extract userid from URL parameters
  const { institution, degree, startDate, endDate,fieldOfStudy } = req.body; // Extract data from request body
  console.log("here in addingn new exp",startDate,endDate)
  try {
      // Find the user by userid
      const user = await User.findById(userid);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Create a new experience
      const newEducation = {
        institution:institution,
        degree: degree,
        startDate: startDate,
        endDate: endDate,
       fieldOfStudy: fieldOfStudy
      };

       console.log( user.firstName)
      user.education = user.education || []; // Initialize experiences array if it's undefined
      console.log("User after initializing education array:", user);
user.education.push(newEducation);
console.log("User after pushing neweducation:", user);

      // Save the updated user object
      await user.save();

      // Send a success response
      res.status(201).json({ message: 'education added successfully', education: newEducation });
  } catch (error) {
      console.error('Error adding education:', error);
      // Send an error response
      res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/skills/:userId', async(req,res)=>{
    console.log("adding skill")
    
    try {
        const userId = req.params.userId;
        const { skill } = req.body;
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        user.skills.push(skill);
        await user.save();
        res.status(201).json({ message: 'Skill added successfully' });
      } catch (error) {
        console.error('Error adding skill:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    
    
    });




app.delete('/skills/:userId/:skillId', async (req, res) => {
    console.log("deleting skill")
    try {
        const userId = req.params.userId;
        const skillId = req.params.skillId;
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        user.skills = user.skills.filter((skill) => skill !== skillId);
        await user.save();
        res.status(200).json({ message: 'Skill deleted successfully' });
      } catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
  });
  

  app.post('/like/:postId', async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body; // Assuming you're sending the userId in the request body
  
    try {
      // Retrieve the post document
      const post = await Posts.findById(postId);
  
      // Check if the post exists
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Check if the user already liked the post
      if (post.likes.includes(userId)) {
        return res.status(400).json({ error: 'User already liked the post' });
      }
  
      // Add the user's ObjectId to the likes array
      post.likes.push(userId);
  
      // Save the updated post document
      await post.save();
  
      res.status(200).json({ message: 'Post liked successfully' , post});
    } catch (error) {
      console.error('Error liking post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }


  });


  app.post('/comment/:postId', async (req, res) => {
    const { postId } = req.params;
    const { userId, content, createdDate } = req.body; // Assuming you're sending the userId, content, and createdDate in the request body

    try {
        // Retrieve the post document
        const post = await Posts.findById(postId);

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Add the new comment to the post
        post.comments.push({ content:content, author: userId, createdAt: createdDate });

        // Save the updated post document
        const updatedPost = await post.save();

        // Populate the author fields for comments
        await updatedPost.populate({
            path: 'comments.author',
            select: 'firstName lastName',
        });

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.delete('/delpost/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await Posts.deleteOne({ _id: postId });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





// httpServer.listen(3001, () => {
//     console.log("Server is running on port 3001");
// });








////Company APIS


//get company initial. this is not by id
app.get('/company/:companyId', async (req, res) => {
  const { companyId } = req.params; // Extract company ID from the route parameters
  try {
    // Fetch company data by ID
    const companyData = await Company.findById(companyId).exec();
    
    // Check if the company data is found
    if (!companyData) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    // Send the company data as JSON
    res.json(companyData);
  } catch (error) {
    console.error('Error fetching company data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//fetches company posts
app.get('/Cp/:userId', async (req, res) => {
  console.log("here in /Cp");
  try {
    const userId = req.params.userId;

    // Fetch posts by the specific user
    const userPosts = await CPosts.find({ author: userId })
      .populate('author', 'name tagline')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          model: 'users',
          select: 'firstName lastName headline', // Select the fields for users
          match: { authorType: 'user' } // Filter comments where authorType is 'user'
        }
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          model: 'companies',
          select: 'name tagline', // Select the fields for companies
          match: { authorType: 'company' } // Filter comments where authorType is 'company'
        }
      });

    console.log("userPosts:", userPosts);
    res.json(userPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




//create company posts
app.post('/createcompanypost',async (req, res) => {
  try {
      // Extract post data from the request body
      const { content,file,author, likes, comments, createdAt } = req.body;
      console.log("in create post : ", author);

      // Create a new post instance
      const newPost = new CPosts({
          content,
          image:file,
          author,
          likes,
          comments,
          createdAt
          // Add other fields as needed
      });
      console.log(newPost);
      // Save the new post to the database
      await newPost.save();

      // Respond with a success message
      res.status(201).json({ message: 'Com Post created successfully', postId: newPost._id });
  } catch (error) {
      console.error('Error creating  com post:', error);
      // If an error occurs, respond with an error message
      res.status(500).json({ message: 'Failed to create post' });
  }
});


//finds a single company based on ID
app.get('/singlecomp/:userid', async (req, res) => {
  const userId = req.params.userid; // Get the user ID from the request parameters
  try {
    console.log("in single user");
      const userData = await Company.findById(userId).exec(); // Find the user by ID
      if (!userData) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.json(userData); // Send the user data as JSON response
  } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.post('/Companylike/:postId', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body; // Assuming you're sending the userId in the request body

  try {
    // Retrieve the post document
    const post = await CPosts.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user already liked the post
    if (post.likes.includes(userId)) {
      return res.status(400).json({ error: 'User already liked the post' });
    }

    // Add the user's ObjectId to the likes array
    post.likes.push(userId);

    // Save the updated post document
    await post.save();

    res.status(200).json({ message: 'Post liked successfully' , post});
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }


});


app.post('/Companycomment/:postId', async (req, res) => {
  const { postId } = req.params;
  const { userId, content, createdDate } = req.body; // Assuming you're sending the userId, content, and createdDate in the request body

  try {
      // Retrieve the post document
      const post = await CPosts.findById(postId);

      // Check if the post exists
      if (!post) {
          return res.status(404).json({ error: 'Post not found' });
      }
      console.log("userid in company comment",userId);

      // Add the new comment to the post
      post.comments.push({ content:content, author: userId,authorType:'companies' ,createdAt: createdDate });

      // Save the updated post document
      const updatedPost = await post.save();

       console.log("updated Post:",updatedPost);

      res.status(200).json(updatedPost);
  } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/Companydelpost/:postId', async (req, res) => {
const { postId } = req.params;

try {
  const post = await CPosts.findById(postId);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  console.log("in com del", post)

  await CPosts.deleteOne({ _id: post._id });
  res.status(200).json({ message: 'Post deleted successfully' });
} catch (error) {
  console.error('Error deleting post:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}
});





//JOBS



app.get('/jobs/:companyId', async (req, res) => {
  try {
      // Extract company ID from request parameters
      const { companyId } = req.params;

      // Fetch job posts with matching company ID from the database
      const jobs = await JobModel.find({ Uid: companyId }).populate('Uid','name');

      // Send a success response with the fetched job posts
      res.status(200).json(jobs);
  } catch (error) {
      // Handle errors
      console.error('Error fetching job posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/jobs', async (req, res) => {
  try {
      //const features = Array.from({length: 100}, () => Math.random());
      // Extract data from request body
      const { Description, Date, Image, Uid, features, resumes } = req.body;

      // Create a new job post instance
      const newJob = new JobModel({
          Description,
          Date,
          Image,
          Uid,
          features,
          resumes:[]
      });

      // Save the job post to the database
      const savedJob = await newJob.save();
      const use = await JobModel.find({
        Uid:Uid
    }).maxTimeMS(30000);

        console.log(use)
        let Pid= use[0]['_id']
        console.log(Pid)
    let Val=-1;
        const users= await Users.find({});
        for(var user of users)
          {
            let Uid = user['_id']
            let jo = new RatModel({
              Uid,
              Pid,
              Val
             
          });
          let result1 = await jo.save();
          }
        
      // Send a success response with the saved job post
      res.status(201).json(savedJob);
  } catch (error) {
      // Handle errors
      console.error('Error creating job post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/jobs/:postId', async (req, res) => {
  try {
    // Extract the post ID from the request parameters
    const { postId } = req.params;

    // Find and delete the job post with the specified post ID
    const deletedPost = await JobModel.findByIdAndDelete(postId);

    // Check if the job post exists
    if (!deletedPost) {
      // If the job post does not exist, send a 404 status with a corresponding message
      return res.status(404).json({ message: 'Job post not found' });
    }

    // If the job post was deleted successfully, send a success response with the deleted job post
    res.json({ message: 'Job post deleted successfully', deletedPost });
  } catch (error) {
    // Handle errors
    console.error('Error deleting job post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/upload-resumes/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { resumes } = req.body; // Assuming resumes is an array of base64 encoded strings

    const post = await JobModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Add the base64 encoded resumes to the post's resumes array
    post.resumes.push(...resumes);

    // Save the updated post with the new resumes
    await post.save();

    res.status(200).json({ message: 'Resumes uploaded successfully' });
  } catch (error) {
    console.error('Error uploading resumes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});








httpServer.listen(3001, () => {
    console.log("Server is running on port 3001");
});
