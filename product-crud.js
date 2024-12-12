const express = require('express');

const mongoose = require('mongoose');
//const { type } = require('os');

const app = express();

app.use(express.json());

async function mongoDBConnection(){

    try {

        await mongoose.connect("mongodb://localhost:27017/product-database");

        console.log("Connection with mongodb established successfully..");  

    } catch (error) {

        console.log(error);

    }

}

 mongoDBConnection();

const schemaProduct = new mongoose.Schema({

    Laptop: {type: String},

    price: { type: Number},

    Model:{type : String},

    Memory:{type:String},

    Color:{type:String},

    Product:{type:String},

    Storage:{type:String}

},

{ collection: "product-collection" },

{  timestamps: true });

const Product = mongoose.model('Product', schemaProduct);

app.get("/allProducts", async (request, response)=>{

    try {

        const productData = await Product.find({});  

        return response.status(200).json(productData);

    } catch (error) {

        return response.status(500).json("Internal Server Error");

    }

});




app.get("/product/:price", async (request, response)=>{

    try {

        const priceParam = request.params.price;

        const productData = await Product.findOne({Price: priceParam});  

        return response.status(200).json(productData);

    } catch (error) {

        return response.status(500).json("Internal Server Error");

    }

});



app.delete("/product/:price", async(request, response)=>{

    try {

        const priceDelete = request.params.price;

        const productData = await Product.findOneAndDelete({price: priceDelete});

        if (!productData) {

            return response.status(404).json(`Product not found with Price: ${priceDelete}`);

        } else {

            return response.status(200).json(productData);

        }    

    } catch (error) {

        return response.status(500).json("Internal Server Error");

    }

});



app.put("/product/update", async (request, response) => {

    try {

      const { price, product, Memory, colour, Storage,Model} = request.body;

      const productUpdate = await Product.findOneAndUpdate(

        { price: price }, 

        {  product: product, Memory: Memory, colour: colour ,Storage:Storage, Model:Model }, 

        { new: true, upsert: true } 

      );

      response.status(200).json({ message: "Product updated successfully", product: productUpdate });

    } catch (error) {

      console.error("Error updating product:", error);

      response.status(500).json({ message: "An error occurred while updating the product", error: error.message });

    }

  });






app.listen(8081, ()=>{

    console.log("Ready to listen requests on port 8081");

});






