const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('public'));

let products = [];
let cart = [];
let id = 0;

//Cart methods
app.get('/api/cart', (req, res) => {
    console.log("In cart get");
    res.send(cart);
  });

  app.post('/api/cart/:id', (req, res) => {
    console.log("In cart post");
    id = parseInt(req.params.id);
    const foundItem = cart.find(item => item.id == id);
    if(foundItem) {
        foundItem.quantity += 1;
        res.send(foundItem);
    } else {
        let item = {
            id: id,
            quantity: 1
        };
        cart.push(item);
        res.send(item);
    }
  });

  app.put('/api/cart/:id/:quantity', (req, res) => {
      console.log("In cart Put");
      id = parseInt(req.params.id);
      console.log("ID parameter: " + id);
      quantity = parseInt(req.params.quantity);
      console.log("quantity parameter: " + quantity);
      const foundItem = cart.find(item => item.id == id);
      let removeIndex = cart.map(item => {
          return item.id
      }).indexOf(id);
      if(foundItem) {
          if(quantity != 0) {
            foundItem.quantity = quantity;
            console.log("New item quantity is: " + foundItem.quantity);
            res.send(foundItem);
          }
          else {
            foundItem.quantity = 0;
            console.log("Quantity has been changed to 0");
            res.send(foundItem);
            // if (removeIndex === -1) {
            //     res.status(404)
            //       .send("Sorry, that product doesn't exist");
            //     return;
            //   }
            cart.splice(removeIndex, 1);
            res.sendStatus(200);
          }
      } 
      else {
        res.status(404)
            .send("Sorry, that product doesn't exist");
        return;
      }
  });

   app.delete('/api/cart/:id', (req, res) => {
        console.log("In cart delete");
        let id = parseInt(req.params.id);
        console.log("This is the id to delete: " + id);
        let removeIndex = cart.map(item => {
            return item.id;
        })
        .indexOf(id);
        console.log("This is the removeIndex: " + removeIndex);
        if (removeIndex === -1) {
            res.status(404)
                .send("Sorry, that product doesn't exist");
            return;
        }
        cart.splice(removeIndex, 1);
        res.sendStatus(200);
   })


//product methods
app.get('/api/products', (req, res) => {
    console.log("In get");
    res.send(products);
  });

  app.get('/api/products/:id', (req, res) => {
      console.log("In get product");
      let id = parseInt(req.params.id);
    //   console.log("This is the ID: " + id)
      let product = products.find(product => product.id == id);
    //   console.log("This is the product: " + product);
      res.send(product);
  })

  app.post('/api/products', (req, res) => {
    console.log("In post");
    id = id + 1;
    let product = {
      id: id,
      name: req.body.name,
      price: req.body.price
    };
    products.push(product);
    res.send(product);
  });

  app.delete('/api/products/:id', (req, res) => {
    console.log("In delete");
    let id = parseInt(req.params.id);
    let removeIndex = products.map(product => {
        return product.id;
      })
      .indexOf(id);
    if (removeIndex === -1) {
      res.status(404)
        .send("Sorry, that product doesn't exist");
      return;
    }
    products.splice(removeIndex, 1);
    res.sendStatus(200);
  });

  app.listen(3000, () => console.log('Server listening on port 3000!'));