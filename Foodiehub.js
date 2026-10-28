
const foods = [
    {
        id: 1,
        name: "Classic Burger",
        category: "Burger",
        price: 149,
        description: "Juicy burger with fresh vegetables.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Cheese Pizza",
        category: "Pizza",
        price: 249,
        description: "Cheesy pizza baked to perfection.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Chicken Biryani",
        category: "Biryani",
        price: 199,
        description: "Aromatic biryani with delicious spices.",
        image:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80"
        
    },
    {
        id: 4,
        name: "Creamy Pasta",
        category: "Pasta",
        price: 179,
        description: "Creamy pasta with herbs and cheese.",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Double Cheese Burger",
        category: "Burger",
        price: 189,
        description: "Double cheese for extra deliciousness.",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Veg Pizza",
        category: "Pizza",
        price: 219,
        description: "Fresh vegetables on a crispy crust.",
        image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 7,
        name: "Veg Biryani",
        category: "Biryani",
        price: 159,
        description: "Flavorful rice with fresh vegetables.",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 8,
        name: "Tomato Pasta",
        category: "Pasta",
        price: 169,
        description: "Pasta tossed in a rich tomato sauce.",
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=500&q=80"
    }
];

let cart = [];
let selectedCategory = "All";

const foodGrid = document.getElementById("foodGrid");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.getElementById("categoryButtons");
const emptyMessage = document.getElementById("emptyMessage");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const orderMessage = document.getElementById("orderMessage");

// Show food menu
function displayFoods() {
    const searchText = searchInput.value.toLowerCase().trim();

    const filteredFoods = foods.filter(function(food) {
        const matchesSearch =
            food.name.toLowerCase().includes(searchText) ||
            food.category.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            food.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    foodGrid.innerHTML = "";
    emptyMessage.hidden = filteredFoods.length !== 0;

    filteredFoods.forEach(function(food) {
        const card = document.createElement("article");
        card.className = "food-card";

        card.innerHTML = `
            <img src="${food.image}" alt="${food.name}" loading="lazy">
            <div class="food-info">
                <p class="food-category">${food.category}</p>
                <h3>${food.name}</h3>
                <p class="food-description">${food.description}</p>
                <p class="food-price">₹${food.price}</p>
                <button class="add-button" data-id="${food.id}">
                    Add to Cart +
                </button>
            </div>
        `;

        foodGrid.appendChild(card);
    });
}

// Search food
searchInput.addEventListener("input", function() {
    displayFoods();
});

// Filter by category
categoryButtons.addEventListener("click", function(event) {
    if (!event.target.matches(".category")) {
        return;
    }

    selectedCategory = event.target.dataset.category;

    document.querySelectorAll(".category").forEach(function(button) {
        button.classList.remove("active");
    });

    event.target.classList.add("active");
    displayFoods();
});

// Add food to cart
foodGrid.addEventListener("click", function(event) {
    const button = event.target.closest(".add-button");

    if (!button) {
        return;
    }

    const foodId = Number(button.dataset.id);
    const existingItem = cart.find(function(item) {
        return item.id === foodId;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        const food = foods.find(function(item) {
            return item.id === foodId;
        });

        cart.push({
            ...food,
            quantity: 1
        });
    }

    orderMessage.textContent = "";
    displayCart();
});

// Display cart and total
function displayCart() {
    cartItems.innerHTML = "";

    cart.forEach(function(item) {
        const row = document.createElement("div");
        row.className = "cart-item";

        row.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <p>₹${item.price} each</p>
            </div>

            <div class="cart-actions">
                <button class="quantity-button"
                    data-action="decrease" data-id="${item.id}">−</button>

                <span>${item.quantity}</span>

                <button class="quantity-button"
                    data-action="increase" data-id="${item.id}">+</button>

                <strong>₹${item.price * item.quantity}</strong>

                <button class="remove-button"
                    data-action="remove" data-id="${item.id}">Remove</button>
            </div>
        `;

        cartItems.appendChild(row);
    });

    const quantity = cart.reduce(function(total, item) {
        return total + item.quantity;
    }, 0);

    const total = cart.reduce(function(sum, item) {
        return sum + item.price * item.quantity;
    }, 0);

    cartCount.textContent = quantity;
    cartTotal.textContent = total;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty. Explore our menu!</p>";
    }
}

// Update or remove cart items
cartItems.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const foodId = Number(button.dataset.id);
    const action = button.dataset.action;
    const item = cart.find(function(food) {
        return food.id === foodId;
    });

    if (!item) {
        return;
    }

    if (action === "increase") {
        item.quantity++;
    } else if (action === "decrease") {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(function(food) {
                return food.id !== foodId;
            });
        }
    } else if (action === "remove") {
        cart = cart.filter(function(food) {
            return food.id !== foodId;
        });
    }

    orderMessage.textContent = "";
    displayCart();
});

// Clear cart
document.getElementById("clearCart").addEventListener("click", function() {
    cart = [];
    orderMessage.textContent = "";
    displayCart();
});

// Open cart section
document.getElementById("cartButton").addEventListener("click", function() {
    document.getElementById("cart").scrollIntoView({
        behavior: "smooth"
    });
});

// Demo order confirmation
document.getElementById("checkoutButton").addEventListener("click", function() {
    if (cart.length === 0) {
        orderMessage.style.color = "#c0392b";
        orderMessage.textContent = "Please add food to your cart first!";
        return;
    }

    orderMessage.style.color = "#23834d";
    orderMessage.textContent =
        "Order placed successfully! Total: ₹" + cartTotal.textContent;

    cart = [];
    displayCart();
});

// Initial page load
displayFoods();
displayCart();
