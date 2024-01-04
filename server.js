const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT =  3000;
const ejs = require("ejs");

app.set("view engine","ejs");

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/money_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a schema for transactions
const transactionSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  category : String,
  type: String // 'income' or 'expense'
  
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render(__dirname + '/views/home.ejs');
});

app.post("/index", (req,res)=>{
  res.render("addTransaction");
})

app.post('/addTransaction', async (req, res) => {
  const { description, amount,category, type } = req.body;

  try{
    const newTransaction = new Transaction({ description, amount, category,type });

    await newTransaction.save();

    res.render("done");
  }catch(error){
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  

  
});

app.post('/getTransactions',async function fetchdata(req,res) {
  try{
    const transactions = await Transaction.find();
    
    res.render("listOfTransactions",{transactions});
  }catch(err){
    res.json(err);
  }

  
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
