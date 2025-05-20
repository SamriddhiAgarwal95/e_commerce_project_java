// main.js

console.log("main.js connected");

// Toggle Buyer and Seller Forms if used in other pages
const buyerBtn = document.getElementById("buyerBtn");
const sellerBtn = document.getElementById("sellerBtn");
const buyerForm = document.getElementById("buyerForm");
const sellerForm = document.getElementById("sellerForm");

if (buyerBtn && sellerBtn && buyerForm && sellerForm) {
  buyerBtn.addEventListener("click", () => {
    buyerForm.classList.remove("hidden");
    sellerForm.classList.add("hidden");
  });

  sellerBtn.addEventListener("click", () => {
    sellerForm.classList.remove("hidden");
    buyerForm.classList.add("hidden");
  });
}

// Buyer Login/Register
if (buyerForm) {
  buyerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const [name, email, password, address] = e.target.elements;
    const buyerData = {
      name: name.value,
      email: email.value,
      password: password.value,
      address: address.value,
    };
    localStorage.setItem("userType", "buyer");
    localStorage.setItem("userData", JSON.stringify(buyerData));
    window.location.href = "buyer.html";
  });
}

// Seller Login/Register
if (sellerForm) {
  sellerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const [name, email, password, shopName] = e.target.elements;
    const sellerData = {
      name: name.value,
      email: email.value,
      password: password.value,
      shopName: shopName.value,
      products: [],
    };
    localStorage.setItem("userType", "seller");
    localStorage.setItem("userData", JSON.stringify(sellerData));
    window.location.href = "seller.html";
  });
}

// Seller page product form logic
if (window.location.pathname.includes("seller.html")) {
  const productForm = document.getElementById("productForm");
  const sellerProductList = document.getElementById("sellerProductList");
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (productForm && sellerProductList) {
    productForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const productName = document.getElementById("productName").value;
      const productImage = document.getElementById("productImage").value;
      const productDescription = document.getElementById("productDescription").value;
      const productPrice = parseFloat(document.getElementById("productPrice").value);
      const productStock = parseInt(document.getElementById("productStock").value);

      const newProduct = {
        name: productName,
        imageUrl: productImage,
        description: productDescription,
        price: productPrice,
        stock: productStock
      };

      const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
      allProducts.push(newProduct);
      localStorage.setItem("allProducts", JSON.stringify(allProducts));

      alert("Product added successfully!");
      productForm.reset();
      displaySellerProducts();
    });
  }

  function displaySellerProducts() {
    const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
    sellerProductList.innerHTML = "";

    allProducts.forEach(product => {
      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>₹${product.price}</strong> | Stock: ${product.stock}</p>
      `;
      sellerProductList.appendChild(div);
    });
  }

  displaySellerProducts();
}

// Buyer product display and cart logic
if (window.location.pathname.includes("buyer.html")) {
  const userData = JSON.parse(localStorage.getItem("userData"));
  document.querySelector("h1").textContent = `Welcome, ${userData.name}`;

  const productList = document.getElementById("productList");
  const cartModal = document.getElementById("cartModal");
  const cartItems = document.getElementById("cartItems");

  function displayProducts() {
    const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
    productList.innerHTML = "";

    if (allProducts.length === 0) {
      productList.innerHTML = "<p>No products available.</p>";
      return;
    }

    allProducts.forEach(product => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Price: ₹${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <button onclick="addToCart('${product.name}')">Add to Cart</button>
      `;
      productList.appendChild(div);
    });
  }

  window.addToCart = function (productName) {
    const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
    const product = allProducts.find(p => p.name === productName);
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("buyerCart")) || [];
    cart.push(product);
    localStorage.setItem("buyerCart", JSON.stringify(cart));

    alert(`${product.name} added to your cart`);
  };

  window.viewCart = function () {
    cartItems.innerHTML = "";
    const cart = JSON.parse(localStorage.getItem("buyerCart")) || [];

    if (cart.length === 0) {
      cartItems.textContent = "Your cart is empty.";
    } else {
      cart.forEach(item => {
        const div = document.createElement("div");
        div.textContent = `${item.name} - ₹${item.price}`;
        cartItems.appendChild(div);
      });
    }

    cartModal.classList.remove("hidden");
  };

  window.closeCart = function () {
    cartModal.classList.add("hidden");
  };

  displayProducts();
}

// Logout function
window.logout = function () {
  localStorage.removeItem("userType");
  localStorage.removeItem("userData");
  localStorage.removeItem("buyerCart");
  window.location.href = "index.html";
};
