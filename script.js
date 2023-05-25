
let cartBtn = document.querySelector(".cart-btn");
let cartItems = document.querySelector(".cart-items");
let closeCartBtn = document.querySelector(".close-cart");
let clearCartBtn = document.querySelector(".clear-cart");
let cartDOM = document.querySelector(".cart");
let cartContainer = document.querySelector(".cart-container");
let cartTotal = document.querySelector(".cart-total");
let cartContent = document.querySelector(".cart-content");
let productDOM = document.querySelector("product-items-container");

// cart
let cart = []

//getting products
class Product{
   async getProducts(){
     try{  
        let result = await fetch("products.json");
        let data = await result.json();
        let products = data.items;
        products = products.map(item => {
            const {title,price} = item.fields;
            const {id} = item.sys;
            const image = item.fields.image.fields.file.url;
            return {title,price,id,image}
        })
        return products;
     }catch(error){
        console.log(error);
     }
    }
}

// display products 
class UI {
    
}


//local storage
class Storage {}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Product();

    // get all products 
    products.getProducts().then(products => console.log(products))
});