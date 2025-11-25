const PRODUCTS = {
  apple: { name: "Apple", emoji: "🍏" },
  banana: { name: "Banana", emoji: "🍌" },
  lemon: { name: "Lemon", emoji: "🍋" },
  orange: { name: "Orange", emoji: "🍊" },
  strawberry: { name: "Strawberry", emoji: "🍓" },
  watermelon: { name: "Watermelon", emoji: "🍉" },
  mango: { name: "Mango", emoji: "🥭" },
};

const BUNDLES = {
  healthy_mix: {
    name: "Healthy Mix",
    products: ["apple", "banana"],
    emoji: "🍏🍌"
  },
  citrus_lovers: {
    name: "Citrus Lovers",
    products: ["lemon", "apple"],
    emoji: "🍋🍏"
  },
  tropical_party: {
    name: "Tropical Party",
    products: ["banana", "lemon"],
    emoji: "🍌🍋"
  },
  fruit_feast: {
    name: "Fruit Feast",
    products: ["apple", "banana", "lemon"],
    emoji: "🍏🍌🍋"
  }
};

const SMOOTHIES = {
  apple_banana_smoothie: {
    name: "Apple Banana Smoothie",
    fruits: ["apple", "banana"],
    emoji: "🥤"
  },
  orange_lemon_smoothie: {
    name: "Orange Lemon Smoothie",
    fruits: ["orange", "lemon"],
    emoji: "🥤"
  },
  tropical_mix_smoothie: {
    name: "Tropical Mix Smoothie",
    fruits: ["mango", "banana", "orange"],
    emoji: "🍹"
  }
};

function getBasket() {
  const basket = localStorage.getItem("basket");
  return basket ? JSON.parse(basket) : [];
}

function addToBasket(product) {
  const basket = getBasket();
  basket.push(product);
  localStorage.setItem("basket", JSON.stringify(basket));
}

function clearBasket() {
  localStorage.removeItem("basket");
}

function addBundle(bundleId) {
  const bundle = BUNDLES[bundleId];
  if (bundle) {
    const basket = getBasket();
    basket.push(`bundle_${bundleId}`);
    localStorage.setItem("basket", JSON.stringify(basket));
    renderBasketIndicator();
  }
}

function addSmoothie(smoothieId) {
  const smoothie = SMOOTHIES[smoothieId];
  if (smoothie) {
    const basket = getBasket();
    basket.push(`smoothie_${smoothieId}`);
    localStorage.setItem("basket", JSON.stringify(basket));
    renderBasketIndicator();
  }
}

function removeFromBasket(index) {
  const basket = getBasket();
  basket.splice(index, 1);
  localStorage.setItem("basket", JSON.stringify(basket));
  renderBasket();
  renderBasketIndicator();
}

function renderBasket() {
  const basket = getBasket();
  const basketList = document.getElementById("basketList");
  const cartButtonsRow = document.querySelector(".cart-buttons-row");
  if (!basketList) return;
  basketList.innerHTML = "";
  if (basket.length === 0) {
    basketList.innerHTML = "<li>No products in basket.</li>";
    if (cartButtonsRow) cartButtonsRow.style.display = "none";
    return;
  }
  basket.forEach((item, idx) => {
    let li = document.createElement("li");
    let innerHtml = "";
    if (item.startsWith && item.startsWith("bundle_")) {
      const bundleId = item.replace("bundle_", "");
      const bundle = BUNDLES[bundleId];
      if (bundle) {
        innerHtml = `<span class='basket-emoji'>${bundle.emoji}</span> <span>${bundle.name} Bundle</span>`;
      }
    } else if (item.startsWith && item.startsWith("smoothie_")) {
      const smoothieId = item.replace("smoothie_", "");
      const smoothie = SMOOTHIES[smoothieId];
      if (smoothie) {
        innerHtml = `<span class='basket-emoji'>${smoothie.emoji}</span> <span>${smoothie.name}</span>`;
      }
    } else {
      const product = PRODUCTS[item];
      if (product) {
        innerHtml = `<span class='basket-emoji'>${product.emoji}</span> <span>${product.name}</span>`;
      }
    }
    // Add delete button
    innerHtml += ` <button class='delete-item-btn' aria-label='Remove item' data-idx='${idx}' style='margin-left:10px;'>🗑️</button>`;
    li.innerHTML = innerHtml;
    basketList.appendChild(li);
  });

  // Add event listeners for delete buttons
  Array.from(document.getElementsByClassName("delete-item-btn")).forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute("data-idx"), 10);
      removeFromBasket(idx);
    };
  });

  if (cartButtonsRow) cartButtonsRow.style.display = "flex";
}

function renderBasketIndicator() {
  const basket = getBasket();
  let indicator = document.querySelector(".basket-indicator");
  if (!indicator) {
    const basketLink = document.querySelector(".basket-link");
    if (!basketLink) return;
    indicator = document.createElement("span");
    indicator.className = "basket-indicator";
    basketLink.appendChild(indicator);
  }
  if (basket.length > 0) {
    indicator.textContent = basket.length;
    indicator.style.display = "flex";
  } else {
    indicator.style.display = "none";
  }
}

// Call this on page load and after basket changes
if (document.readyState !== "loading") {
  renderBasketIndicator();
} else {
  document.addEventListener("DOMContentLoaded", renderBasketIndicator);
}

// Patch basket functions to update indicator
const origAddToBasket = window.addToBasket;
window.addToBasket = function (product) {
  origAddToBasket(product);
  renderBasketIndicator();
};
const origClearBasket = window.clearBasket;
window.clearBasket = function () {
  origClearBasket();
  renderBasketIndicator();
};
