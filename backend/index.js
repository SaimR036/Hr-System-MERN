
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
const UserModel = require('./models/UsersM');
const PostModel = require('./models/PostsM');
const FModel = require('./models/FriendsM');
const Users = require('./models/iqrausers.js');
const Company = require('./models/company.js');
const Chat = require('./models/chat.js');
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

          const obj = await UserModel.findById(userIdObject).maxTimeMS(30000)
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

          const obj = await UserModel.findById(userIdObject).maxTimeMS(30000)
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
app.get('/getallusers', (req, res) => {



  UserModel.find({}).maxTimeMS(30000)
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
//     await UserModel.updateMany(
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
    const data  = await UserModel.find({}).maxTimeMS(30000)
    console.log(searchQuery)
    const options = {
      keys: ['Name'],
      includeScore: true,
      limit: 3 // Limit the number of results
    };
    const fuse = new Fuse(data, options);
    const result = fuse.search(searchQuery);
    for(var item of result)
      {
        var check  = await checkreqs(item['item']['id'])
        if(check==0)
          { 
            var userId = item['item']['id']
            console.log(userId)
            const friends = await FModel.find({
              $or: [
                  { Fid1: userId },
                  { Fid2: userId }
              ]
          }).maxTimeMS(30000);
            if(friends.length==1)
              {
                  item.flag=2;
              }
          }
          else if(check==-1)
            {
              item.flag = 0;
            }
            else if(check==1)
              {
                item.flag=1;
              }
              else{
                item.flag=-1;
              }
              
      }
    console.log(result)
    res.json(result);
  });
app.get('/ai', async (req, res) => {

    var W=[]
    var X=[]
    var b=[]
    const users  = await UserModel.find({}).maxTimeMS(30000)
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
          await UserModel.updateOne(
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
    await UserModel.updateOne(
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
    await UserModel.updateOne(
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
    await UserModel.updateOne(
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
  const user  = await UserModel.find({_id:id}).maxTimeMS(30000)
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
        const newImage = new PostModel({ Description:req.body.Description,Image:imageData,Uid:req.body.Uid,Date:currentDate});
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

httpServer.listen(3001, () => {
    console.log("Server is running on port 3001");
});
