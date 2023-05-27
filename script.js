
const cartBtn = document.querySelector(".cart-btn");
const cartItems = document.querySelector(".cart-items");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartContainer = document.querySelector(".cart-container");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".product-items-container");

console.log(clearCartBtn);

// cart
let cart = [];
let buttonsDOM = [];

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
    displayProducts(products){
        let result = '';
        products.forEach(element => {
            result += ` <!--product-${element.id}-->
            <div class="product-item">
               <div class="img-container">
                <img src=${element.image} alt="product 1" class="product-img">
                <button class="shopping-bag-btn" data-id=${element.id}>
                <i class="fas fa-shopping-cart"></i> add to bag</button>
               </div> 
               <h3>${element.title}</h3>
               <h4>$${element.price}</h4>
            </div>
            <!--end of product-${element.id}--> `;
        });
       productsDOM.innerHTML = result; 
    }

    getBagButtons(){
    const bagBtns = [...document.querySelectorAll(".shopping-bag-btn")];
       buttonsDOM = bagBtns;
    bagBtns.forEach(button => {
        let id = button.dataset.id;
        let inCart = cart.find(item => item.id === id);
        if(inCart){
            button.innerText = "In Cart";
            button.disabled = true;
        }
    
            button.addEventListener("click", (e)=>{
                e.target.innerText = "In Cart";
                e.target.disabled = true;

                // get product from products
                let cartItem = {...Storage.getProduct(id),amount:1};

                //add product to the cart
                cart = [...cart, cartItem]
                 
                //save cart in local storage
                Storage.saveCart(cart);

                // set cart values (item-amount, cart-total)
                this.setCartValues(cart);

                // display cart items 
                this.addCartItem(cart);

                //show the cart
                // this.showCart()
            })
        })
      }

    setCartValues(cart) {
        let priceTotal = 0;
        let itemsTotal = 0;
        cart.map(item=>{
            priceTotal += item.price*item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerText = parseFloat(priceTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
     }
     
     addCartItem(cart){
        let result = '';
        for(let i=0;i<cart.length;i++){
            result += `<!--cart item-->
            <div class="cart-item">
                <img src=${cart[i].image} alt="product ${cart[i].id}">
                <div>
                    <h4>${cart[i].title}</h4>
                    <h5>$${cart[i].price}</h5>
                    <span class="remove-item" data-id=${cart[i].id}>Remove</span>
                </div>
                <div>
                    <i class="fa-solid fa-plus" data-id=${cart[i].id}></i>
                    <p class="item-amount">${cart[i].amount}</p>
                    <i class="fa-solid fa-minus" data-id=${cart[i].id}></i>
                </div>
            </div>
            <!--end of cart item-->
            `;
        }
        cartContent.innerHTML = result;
     }

    //another way
    // addCartItem(cartItem){
    //     const div= document.createElement('div');
    //     div.classList.add("cart-item");
    //     div.innerHTML = `<img src=${cartItem.image} alt="product ${cartItem.id}">
    //             <div>
    //                 <h4>${cartItem.title}</h4>
    //                 <h5>$${cartItem.price}</h5>
    //                 <span class="remove-item" data-id=${cartItem.id}>Remove</span>
    //             </div>
    //             <div>
    //                 <i class="fa-solid fa-plus" data-id=${cartItem.id}></i>
    //                 <p class="item-amount">${cartItem.amount}</p>
    //                 <i class="fa-solid fa-minus" data-id=${cartItem.id}></i>
    //             </div>
    
    //         `;
    //         cartContent.appendChild(div);
    //     }

     showCart(){
        cartContainer.classList.add("transparentBcg");
        cartDOM.classList.add('showCart');
     }
     // (when we open the app or reload the app previous condition of the app should be maintained)
    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.addCartItem(cart);    // for another way this.populateCart(cart);
        cartBtn.addEventListener('click',this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }

    // for another way
    // populateCart(cart){
    //     cart.forEach(item=> this.addCartItem(item)); 
    // }

    hideCart(){
        cartContainer.classList.remove("transparentBcg");
        cartDOM.classList.remove('showCart');
    }

    cartLogic(){
        // clear cart button
        // clearCartBtn.addEventListener('click', this.clearCart)
        // if we call this.clearCart function like above  then 'this.' in below clearCart()
        //  method represents clearCart not UI(so this.removeItem() will be undefined)
        // correct way is
        
        clearCartBtn.addEventListener('click', ()=>{
            this.clearCart();
        })

        // cart functionality
    }

    clearCart(){
        let cartItems = cart.map(item => item.id)
        cartItems.forEach(id=> this.removeItem(id));

        while(cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }

    removeItem(id){
        cart = cart.filter(item=> item.id !== id)
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart">
        </i> add to cart`
    }

    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}


//local storage
class Storage {
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product=> product.id === id);
    }
    static saveCart(cart){
        localStorage.setItem("cart",JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem("cart")):[] ;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Product();

    // setup app (when we open the app or reload the app previous condition of the app should be maintained)
    ui.setupAPP();

    // get all products 
    products.getProducts()
    .then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    })
    .then(() => {
    ui.getBagButtons();
    ui.cartLogic();
    })
});