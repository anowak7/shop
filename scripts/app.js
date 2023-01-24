//Select elements
const productsEl = document.querySelector(".products");
const cartItemsEl = document.querySelector(".cart-items");
const subtotalEl = document.querySelector(".subtotal");

function renderProducts() {
  products.forEach((product) => {
    productsEl.innerHTML += `
    <div class="item">
    <div class="item-container">
        <div class="item-img">
            <img src="${product.imgSrc}" alt="${product.name}">
        </div>
        <div class="desc">
            <h2>${product.name}</h2>
            <h3>${product.manufacturer}</h3>
            <p>
            ${product.description}
            </p>
        </div>
        <div class="add-to-cart" >
          <h2><small>$</small>${product.price}</h2>
          <div class="btn minus">-</div>
          <div class="product-amount">1</div>
          <div class="btn plus">+</div>
          <img src="./assets/add-to-cart.png" alt="add to cart" onClick="addToCart(${product.id})">
        </div>
    </div>
</div>
    `;
  });
}
renderProducts();

//cart array
let cart = JSON.parse(localStorage.getItem("CART")) || [];
updateCart();

//ADD to cart
function addToCart(id) {
  //check if product already exists in cart
  if (cart.some((item) => item.id === id)) {
    changeNumberOfUnits("plus", id);
  } else {
    const item = products.find((product) => product.id === id);
    cart.push({
      ...item,
      numberOfUnits: 1,
    });
  }

  updateCart();
}

//update cart
function updateCart() {
  renderCartItems();
  renderSubTotal();

  //save cart to local storage
  localStorage.setItem("CART", JSON.stringify(cart));
}

//calculate and render subtotal
function renderSubTotal() {
  let totalPrice = 0,
    totalItems = 0;

  cart.forEach((item) => {
    totalPrice += item.price * item.numberOfUnits;
    totalItems += item.numberOfUnits;
  });
  subtotalEl.innerHTML = `Grand Total: $${totalPrice.toFixed(2)}`;
}

//render cart items
function renderCartItems() {
  cartItemsEl.innerHTML = ""; //clear cart element
  cart.forEach((item) => {
    cartItemsEl.innerHTML += `
    <div class="cart-item">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                    </div>
                    <div class="unit-price">
                        <small>$</small>${item.price}
                    </div>
                    <div class="units">
                        <div class="btn minus" onclick="changeNumberOfUnits('minus', ${item.id})">-</div>
                        <div class="number">${item.numberOfUnits}</div>
                        <div class="btn plus" onclick="changeNumberOfUnits('plus', ${item.id})">+</div>
                    </div>
                    <div class="btn-delete" onclick="removeItemFromCart(${item.id})">
                      <img src="./assets/delete.png" alt="delete button">
                    </div>
    </div>
  `;
  });
}

//remove item from cart
function removeItemFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCart();
}

//change number of units for an item
function changeNumberOfUnits(action, id) {
  cart = cart.map((item) => {
    let numberOfUnits = item.numberOfUnits;
    if (item.id === id) {
      if (action === "minus" && numberOfUnits > 1) {
        numberOfUnits--;
      } else if (action === "plus" && numberOfUnits < item.instock) {
        numberOfUnits++;
      }
    }
    return {
      ...item,
      numberOfUnits,
    };
  });
  updateCart();
}
