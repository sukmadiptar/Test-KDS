const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const redis = require("redis");

const PORT = process.env.PORT || 3000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// parse application/json
app.use(bodyParser.json());

client.on('connect', function() {
    console.log('Connected!');
  });

//create database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'restful_db'
});
 
//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
 
//tampilkan semua data product
app.get('/api/products',(req, res) => {

  let sql = "SELECT * FROM product";
  let query = conn.query(sql, (err, results) => {
    if(err) {
        result(null, err);
    }
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

exports.getProducts = (req, res) => {
    try {
      Products.findAllProducts((err, products) => {
        if (err) {
          return res.status(400).json({
            error: "No Products found",
          });
        }

        client.setex("productsData", 360, JSON.stringify(products));
        return res.json({
          count: products.length,
          data: {
            products,
          },
        });
      });
    } catch (error) {
      return res.status(500).json({
        error: "Something went wrong!",
      });
    }
  };
 
//tampilkan data product berdasarkan id
app.get('/api/products/:id',(req, res) => {
  let sql = "SELECT * FROM product WHERE product_id="+req.params.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});
 
//Tambahkan data product baru
app.post('/api/products',(req, res) => {
  let data = {product_name: req.body.product_name, product_price: req.body.product_price};
  let sql = "INSERT INTO product SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});
 
//Edit data product berdasarkan id
app.put('/api/products/:id',(req, res) => {
  let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.params.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});
 
//Delete data product berdasarkan id
app.delete('/api/products/:id',(req, res) => {
  let sql = "DELETE FROM product WHERE product_id="+req.params.id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});
 
//Server listening
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}...`);
});