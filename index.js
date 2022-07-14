const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
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
const defaultItems = [Item1, Item2, Item3];
const listSchema = {
  name: String,
  items: [itemsSchema]
}
const List = mongoose.model('List', listSchema);

app.get("/", (req, res) => {
  Item.find((err, items) => {
    if (items.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Item added successfully");
        }
        res.redirect("/");
      });
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: items
      });
    }
  });

});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });

  if (listName === 'Today') {
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name:listName}, (err,foundList) =>{
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

});

app.post("/delete", (req, res) => {
  const checkedItem = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === 'Today') {
    Item.findByIdAndRemove(checkedItem, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Item removed successfully");
      }
      res.redirect("/");
    });
  }else{
    List.findOneAndUpdate(
      {name:listName},
      {$pull: {items: {_id:checkedItem}}},
      (err,results)=>{
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    )
  }
});

app.get("/:newList", (req, res) => {
  const newList = _.capitalize(req.params.newList);
  List.findOne({name: newList}, (err, result) => {
    if (!result) {
      const list = new List({
        name: newList,
        items: defaultItems
      });
      list.save();
      res.redirect("/" + newList);
    } else {
        res.render("list", {listTitle: result.name, newListItems: result.items});
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
})



app.listen(3000, () => {
  console.log("Server successfull");
});
