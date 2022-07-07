const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27017/todoslistDB');
const itemsSchema = {
  name: String
};
const Item = mongoose.model('Item', itemsSchema);

const Item1 = new Item({
  name: 'Welcome to your To Do List!!'
});
const Item2 = new Item({
  name: 'Hit the + button to add new items'
});
const Item3 = new Item({
  name: '<--- Hit this to delete an item'
});
const defaultItems = [Item1,Item2,Item3];

app.get("/", (req,res) =>{
  const day = date.getDate();
  Item.find((err,items)=>{
    if(items.length === 0){
      Item.insertMany(defaultItems, (err) =>{
        if (err){
          console.log(err);
        }else{
          console.log("Item added successfully");
        }
        res.redirect("/");
      });
    }else{
        res.render("list", {listTitle: day, newListItems: items});
    }
  });

});

app.post("/" , (req,res) => {
  const itemName = req.body.newItem
  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete" , (req,res) =>{
  const checkedItem = req.body.checkbox;
  Item.findByIdAndRemove(checkedItem,(err)=>{
    if (err){
      console.log(err);
    }else{
      console.log("Item removed successfully");
    }
    res.redirect("/");
  });
});

app.get("/work", (req,res) => {
  res.render("list",{listTitle: "Work List", newListItems: workItems})
});

app.get("/about", (req,res) => {
  res.render("about");
})



app.listen(3000, () => {
  console.log("Server successfull");
});
