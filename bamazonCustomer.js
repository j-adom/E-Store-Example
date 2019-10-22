var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "mySQL25",
  database: "bamazon_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

let items = [];


function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res)
    for(i=0;i<res.length;i++){
        
        // console.log("ID: "+ res[i].item_id + "\t" + res[i].product_name + "\t$" + res[i].price )
        items.push(res[i].item_id)
    };
    inquirer
    .prompt([{
        name: "buyID",
        type: "list",
        message: "Please select the item you wish to buy",
        choices: items
        },
        {
            name: "buyQuantity",
            type: "input",
            message: "How many would you like to buy?"        
        }])

    .then(function(answer) {
        let idBuy = parseInt(answer.buyID) - 1
        let oldStock = res[idBuy].stock_quantity 
        let orderQuantity = parseInt(answer.buyQuantity)
        let itemPrice = parseFloat(res[idBuy].price)
        let total = orderQuantity * itemPrice



      if(oldStock > parseInt(answer.buyQuantity)){
          let newQuantity = oldStock - orderQuantity;
        connection.query(
            "UPDATE products SET stock_quantity = ? WHERE item_id = ?", 
            [newQuantity, answer.buyID],
                  
            function(error) {
              if (error) throw err;
              console.log("Your items are in stock! \nYour Total is $" + total );
              connection.end();
            })
        } else{
            console.log("Sorry, we don't have enough stock to fulfill your order :(")
        }
     } );
    })
    }