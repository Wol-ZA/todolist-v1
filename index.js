const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
const items = [];
const workItems = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", (req,res) =>{
  const day = date.getDate();
  res.render("list", {listTitle: day, newListItems: items});
});

app.post("/" , (req,res) => {
    const item = req.body.newItem;
    if (req.body.listTitle === "day") {
      if (item != '') {
        items.push(item);
        res.redirect("/");
      }else{
        res.redirect("/");
      }
    }else{
      workItems.push(item);
      res.redirect("/work");
    }

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