var swiper = new Swiper(".mySwiper", {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay: {
         delay: 3000,
         disableOnInteraction: false,
    },
    loop: true,
});



//======================================================================================================================================


//Array Of Objects
const products = [
 {
      "id": 1,
      "title": "Latest",
      "price": 25,
      "UrlToImage": "./Images/p1.jpg",
      "qty": 1,
 },
 {
      "id": 2,
      "title": "Snake",
      "price": 35,
      "UrlToImage": "./Images/p2.jpg",
      "qty": 3,
 },
 {
      "id": 3,
      "title": "Monstera",
      "price": 45,
      "UrlToImage": "./Images/p3.jpg",
      "qty": 5,
 },
 {
      "id": 4,
      "title": "Calathea",
      "price": 55,
      "UrlToImage": "./Images/p5.jpg",
      "qty": 6,
 },
 {
      "id": 5,
      "title": "Mask",
      "price": 65,
      "UrlToImage": "./Images/p6.jpg",
      "qty": 2,
 },
 {
      "id": 6,
      "title": "Pink",
      "price": 75,
      "UrlToImage": "./Images/p8.jpg",
      "qty": 8,
 },
 {
      "id": 7,
      "title": "Bamboo",
      "price": 85,
      "UrlToImage": "./Images/p9.jpg",
      "qty": 5,
 },
 {
      "id": 8,
      "title": "Leaf",
      "price": 95,
      "UrlToImage": "./Images/p12.jpg",
      "qty": 4,
 },
]

const cart = document.querySelector('.cart');
const openCart = document.querySelector('.product__section__logo');
const backdrop = document.querySelector('.backdrop');
const cartsCont = document.querySelector('.productRow');
const cartCount = document.querySelector('.cart-num');
const totalPriceCont = document.querySelector(".total-price");
const totalQuantityCont = document.querySelector(".items-num");



openCart.addEventListener('click' , openingCart);
backdrop.addEventListener('click' , closeingCart);

//Functio Open Cart
function openingCart() {
 cart.classList.add('active');
 backdrop.style.display = 'block';
 setTimeout(() => {
   backdrop.classList.add('show');
 } , 0);
}


//Functio Close Cart
function closeingCart() {
 cart.classList.remove('active');
 backdrop.style.display = 'none';
 setTimeout(() => {
   backdrop.classList.remove('show');
 } , 500);
}

let carts =JSON.parse(localStorage.getItem('carts')) || [];


renderProducts();
calcCartCount();
addEventsProducts();
renderProductsCart();
addEventsOnCart();
checkCartEmpty();
calcTotalPrice();

function renderProducts(){
 cartsCont.innerHTML = '';
 products.forEach(product => {
   cartsCont.innerHTML += `
   <div class='product col-sm-12 col-md-6 col-lg-3 g-4'>
     <div class="card">
       <div class="card__image">
         <img src="${product.UrlToImage}" class="card-img-top">
       </div>
       <div class="card-body d-flex flex-column justify-content-between">
         <div>
           <h5 class="card-title">${product.title} Plant</h5>
           <p class='card-price m-0'><span class="fs-4 text-primary">$${product.price}</span> / piece</p>
         </div>
         ${(carts.find(ele => ele.id == product.id)) ? 
           '<h5 class="fw-bolder text-center">Added to cart!</h5>'
           : 
           `<button href="#" class="btn btn-primary w-100 add-to-cart" data-target="${product.id}">Add to cart</button>`
         }
       </div>
     </div>
   </div>
   `;
 });
 
}



function addEventsProducts(){
 const addToCartBtns = document.querySelectorAll('.add-to-cart');
 addToCartBtns.forEach(btn => {
   btn.addEventListener('click', () => {
     const parent = btn.closest('.card');
     const id = btn.dataset.target;
     const productObj = products.find(product => {
       return product.id == id;
     });
     carts.push({...productObj, quantity: 1})
     btn.remove();
     parent.innerHTML += `<h5 class="fw-bolder text-center">Added to cart!</h5>`;
     saveCartToLocalStorage();
     calcCartCount();
     renderProductsCart();
     addEventsOnCart();
     calcTotalPrice();
   });
 });
}


function renderProductsCart() {
 const productsCont = document.querySelector(".cartTable tbody");
 
 productsCont.innerHTML = ``;
 carts.forEach((product) => {
   productsCont.innerHTML += `
   <tr class="cart-product d-flex align-items-center" data-id='${product.id}'>
     <td>
       <div class="">
         <img class="cart-product-img w-50 h-50" src="${product.UrlToImage}" />
         <h5>${product.title}</h5>
       </div>
     </td>

     <td>
       <div class="cart-product-amount d-flex gap-2 justify-content-between">
         <span class="change-amount change-amount-dec fw-bold shadow">-</span>
         <span class="quantity fw-bold">${product.quantity}</span>
         <span class="change-amount change-amount-inc fw-bold shadow">+</span>
       </div>
     </td>

     <td>
       <div class="mb-2 ms-4">
         <span class="fw-bolder fs-4">$${product.price}</span>
         <span class="remove-product"> Remove </span>
       </div>
     </td>
   </tr>
   `;
 });
}


function addEventsOnCart(){
 const removeAllBtn = document.querySelector(".remove-all-products");
 const removeBtns = document.querySelectorAll(".remove-product");
 const increaseQtyBtns = document.querySelectorAll(".change-amount-inc");
 const decreaseQtyBtns = document.querySelectorAll(".change-amount-dec");

 removeAllBtn.addEventListener("click", () => {
   carts = [];
   handleCartChange();
 });

 removeBtns.forEach((btn) => {
   btn.addEventListener("click", () => {
     const parent = btn.closest(".cart-product");
     const id = parent.dataset.id;
     carts = carts.filter((product) => product.id != id);
     parent.remove();
     handleCartChange();
   });
 });

 increaseQtyBtns.forEach((btn) => {
   btn.addEventListener("click", () => {
   const parent = btn.closest(".cart-product");
   const id = parent.dataset.id;

   const productObj = carts.find((product) => {
       return product.id == id;
   });

     productObj.quantity++;
     parent.querySelector(".quantity").textContent = productObj.quantity;

     handleCartChange();
   });
 });

 decreaseQtyBtns.forEach((btn) => {
   btn.addEventListener("click", () => {
     const parent = btn.closest(".cart-product");
     const id = parent.dataset.id;

     const productObj = carts.find((product) => {
       return product.id == id;
     });

     if (productObj.quantity > 1) {
       productObj.quantity--;
     }
     parent.querySelector(".quantity").textContent = productObj.quantity;
     handleCartChange();
   });
 });
}


function saveCartToLocalStorage(){
 localStorage.setItem('carts', JSON.stringify(carts))
}



function calcCartCount(){
 cartCount.textContent = carts.length;
}



function handleCartChange() {
 saveCartToLocalStorage();
 checkCartEmpty();
 calcCartCount();
 calcTotalPrice();
}


function checkCartEmpty() {
 if (carts.length == 0) {
  const productsCont = document.querySelector(".cartTable tbody");
   productsCont.innerHTML = `
     <h2 class="fw-bolder text-center mb-0">Cart is empty!</h2>
   `;
 }
}

function calcTotalPrice() {
 totalPriceCont.textContent = '$' + carts.reduce((acc, ele) => {
   return acc + (ele.quantity * ele.price);
 }, 0);

 totalQuantityCont.textContent = carts.reduce((acc, ele) => {
   return acc + ele.quantity;
 }, 0);

}


//===================================================================================================================


let countDate = new Date('novembre 15, 2023 00:00:00').getTime();

function countDown() {
 let now = new Date().getTime();

   gap = countDate - now;

   let second = 1000;
   let minute = second * 60;
   let hour = minute * 60;
   let day = hour * 24;
 
   let d = Math.ceil(gap / (day));
   let h = Math.ceil((gap % (day)) / (hour));
   let m = Math.ceil((gap % (hour)) / (minute));
   let s = Math.ceil((gap % (minute)) / (second));
 
 
   document.getElementById('days').innerText = d;
   document.getElementById('hour').innerText = h;
   document.getElementById('minute').innerText = m;
   document.getElementById('second').innerText = s;


   document.getElementById('days').innerText = d;
   document.getElementById('hour').innerText = h;
   document.getElementById('minute').innerText = m;
   document.getElementById('second').innerText = s;
}

setInterval(function() {
 countDown();
} , 1000)



const tabTitle = document.querySelectorAll('.tab-title');
const tabContent = document.querySelectorAll('.tab-content');

tabTitle.forEach((tab) => {
 tab.addEventListener('click' , () => {
   removeActive(tabTitle);
   tab.classList.add('active');
   let dataId = tab.dataset.id;
   removeActive(tabContent);
   document.getElementById(dataId).classList.add('active');
 });
});


function removeActive(items) {
 items.forEach((item) => {
   item.classList.remove('active');
 });
}

//============================================================================================================================

const scrollPart = document.querySelector('.scrollPart');
window.onscroll = () => {
 if(window.scrollY > 1500) {
   scrollPart.style.display = 'block';
 }
 else {
   scrollPart.style.display = 'none';
 }
}

//==============================================================================================================================
