const products = [
  {
    id: "camiseta-asfalto",
    name: "Camiseta Asfalto",
    category: "camisetas",
    color: "Preto estonado",
    price: 119.90,
    image: "assets/camiseta.webp",
    tag: "OVERSIZED",
    sizes: ["P", "M", "G", "GG"],
    description: "Camiseta oversized em preto estonado, com ombros caídos e estampa discreta no peito."
  },
  {
    id: "moletom-concreto",
    name: "Moletom Concreto",
    category: "moletons",
    color: "Vinho",
    price: 219.90,
    image: "assets/moletom.webp",
    tag: "DROP 01",
    sizes: ["P", "M", "G", "GG"],
    description: "Moletom amplo na cor vinho, com capuz, bolso canguru e estampa no peito."
  },
  {
    id: "cargo-subsolo",
    name: "Baggy Subsolo",
    category: "calcas",
    color: "Preto",
    price: 199.90,
    image: "assets/baggy.webp",
    tag: "WIDE LEG",
    sizes: ["36", "38", "40", "42", "44"],
    description: "Calça jeans baggy em preto estonado, com pernas extralargas e bolsos cargo laterais."
  }
];

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const storageKey = "streetwaer-sacola";
const grid = document.querySelector("#product-grid");
const filters = document.querySelectorAll("[data-filter]");
const searchDialog = document.querySelector("#search-dialog");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");
const productDialog = document.querySelector("#product-dialog");
const productDetail = document.querySelector("#product-detail");
const cartDialog = document.querySelector("#cart-dialog");
const cartContent = document.querySelector("#cart-content");
const bagButton = document.querySelector("[data-open-cart]");
const bagCount = document.querySelector("#bag-count");
const toast = document.querySelector("#toast");
const menuButton = document.querySelector(".mobile-menu");
const mobileNav = document.querySelector("#mobile-nav");

const icon = (name) => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const findProduct = (id) => products.find((product) => product.id === id);
let cart = loadCart();
let toastTimer;

function loadCart() {
  try {
    const entries = JSON.parse(localStorage.getItem(storageKey));
    if (!Array.isArray(entries)) return [];
    return entries.filter((entry) => (
      entry && findProduct(entry.id)?.sizes.includes(entry.size) &&
      Number.isSafeInteger(entry.quantity) && entry.quantity >= 1 && entry.quantity <= 99
    ));
  } catch {
    return [];
  }
}

function syncCart() {
  const count = cart.reduce((total, entry) => total + entry.quantity, 0);
  bagCount.textContent = count;
  bagButton.setAttribute("aria-label", `Sacola, ${count} ${count === 1 ? "item" : "itens"}`);
}

function saveCart() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  } catch {
    // The bag still works during this visit if browser storage is unavailable.
  }
  syncCart();
}

function renderProducts(category = "todos") {
  const visibleProducts = category === "todos"
    ? products
    : products.filter((product) => product.category === category);

  grid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <button class="product-image" type="button" data-product="${product.id}" aria-label="Ver ${product.name}">
        <img src="${product.image}" alt="" width="800" height="1000">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
        <span class="product-arrow">${icon("diagonal")}</span>
      </button>
      <div class="product-meta">
        <h3><button type="button" data-product="${product.id}">${product.name}</button></h3>
        <strong>${currency.format(product.price)}</strong>
      </div>
      <p class="product-tone">${product.color}</p>
    </article>
  `).join("");

  document.querySelector("#filter-status").textContent =
    `${visibleProducts.length} ${visibleProducts.length === 1 ? "peça encontrada" : "peças encontradas"}`;
}

function renderSearch() {
  const normalize = (value) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  const terms = normalize(searchInput.value.trim()).split(/\s+/);
  const matches = products.filter((product) => {
    const content = normalize(`${product.name} ${product.category} ${product.color} ${product.description}`);
    return terms.every((term) => content.includes(term));
  });

  searchResults.innerHTML = matches.length
    ? matches.map((product) => `
      <button class="search-row" type="button" data-product="${product.id}">
        <img src="${product.image}" alt="">
        <span>${product.name}</span>
        ${icon("arrow")}
      </button>
    `).join("")
    : '<p class="empty-message">Nenhuma peça encontrada.</p>';
}

function openProduct(id) {
  const product = findProduct(id);
  if (!product) return;

  productDetail.innerHTML = `
    <div class="product-detail">
      <img src="${product.image}" alt="${product.name} em ${product.color.toLowerCase()}">
      <form class="product-detail-copy">
        <h2 id="product-title">${product.name}</h2>
        <p class="product-price">${currency.format(product.price)}</p>
        <p>${product.description}</p>
        <fieldset class="sizes">
          <legend>Tamanho</legend>
          <div class="size-options">
            ${product.sizes.map((size) => `
              <button class="size-button" type="button" aria-pressed="false" data-size="${size}">${size}</button>
            `).join("")}
          </div>
        </fieldset>
        <p class="form-message" role="alert" hidden></p>
        <button class="button button-wine" type="submit">ADICIONAR À SACOLA ${icon("bag")}</button>
        <button class="text-link fitting-product-link" type="button" data-try-on>EXPERIMENTAR NO PROVADOR ${icon("diagonal")}</button>
      </form>
    </div>`;

  let selectedSize;
  const form = productDetail.querySelector("form");
  const sizeButtons = form.querySelectorAll("[data-size]");
  const message = form.querySelector(".form-message");

  for (const button of sizeButtons) {
    button.addEventListener("click", () => {
      selectedSize = button.dataset.size;
      for (const option of sizeButtons) {
        option.setAttribute("aria-pressed", String(option === button));
      }
      message.hidden = true;
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!selectedSize) {
      message.textContent = "Selecione um tamanho.";
      message.hidden = false;
      sizeButtons[0].focus();
      return;
    }

    const entry = cart.find((item) => item.id === id && item.size === selectedSize);
    if (entry?.quantity === 99) {
      message.textContent = "Você atingiu o limite de 99 unidades para este tamanho.";
      message.hidden = false;
      return;
    }

    if (entry) entry.quantity += 1;
    else cart.push({ id, size: selectedSize, quantity: 1 });
    saveCart();
    productDialog.close();
    showToast("Peça adicionada à sacola.");
  });

  form.querySelector("[data-try-on]").addEventListener("click", () => {
    wearProduct(product, false);
    productDialog.close();
    window.location.hash = "#provador";
    document.querySelector("#provador").scrollIntoView();
    document.querySelector("#fitting-title").focus({ preventScroll: true });
  });

  productDialog.showModal();
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("visible");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("visible");
    toast.textContent = "";
  }, 2600);
}

function cartTotal() {
  return cart.reduce((sum, entry) => sum + findProduct(entry.id).price * entry.quantity, 0);
}

function renderCart() {
  if (!cart.length) {
    cartContent.innerHTML = `
      <p class="empty-message">Sua sacola está vazia.</p>
      <a class="button button-wine" href="#colecao" data-shop>VER COLEÇÃO ${icon("diagonal")}</a>`;
    return;
  }

  cartContent.innerHTML = `
    ${cart.map((entry, index) => {
      const product = findProduct(entry.id);
      return `
        <article class="cart-row">
          <img src="${product.image}" alt="">
          <div>
            <h3>${product.name}</h3>
            <p>Tamanho ${entry.size}</p>
            <div class="quantity">
              <button type="button" data-action="decrease" data-index="${index}" aria-label="Diminuir quantidade de ${product.name}, tamanho ${entry.size}">${icon("minus")}</button>
              <span>${entry.quantity}</span>
              <button type="button" data-action="increase" data-index="${index}" aria-label="Aumentar quantidade de ${product.name}, tamanho ${entry.size}" ${entry.quantity >= 99 ? "disabled" : ""}>${icon("plus")}</button>
              <button class="remove-button" type="button" data-action="remove" data-index="${index}" aria-label="Remover ${product.name}, tamanho ${entry.size}">Remover</button>
            </div>
          </div>
          <strong>${currency.format(product.price * entry.quantity)}</strong>
        </article>`;
    }).join("")}
    <div class="cart-total"><span>Subtotal</span><strong>${currency.format(cartTotal())}</strong></div>
    <p class="cart-note">Pagamento e frete online ainda estão indisponíveis.</p>
    <button class="button button-wine" type="button" data-summary aria-expanded="false" aria-controls="order-summary">GERAR RESUMO ${icon("arrow")}</button>
    <div class="order-summary" id="order-summary" hidden>
      <label for="order-text">Resumo da sacola</label>
      <textarea id="order-text" readonly></textarea>
    </div>`;
}

function updateNavigation() {
  const currentSection = window.location.hash || "#";
  for (const link of document.querySelectorAll(".main-nav a, .mobile-nav a")) {
    const active = link.getAttribute("href") === currentSection;
    link.classList.toggle("current", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}

function toggleMenu(open) {
  mobileNav.hidden = !open;
  menuButton.setAttribute("aria-expanded", String(open));
}

for (const button of filters) {
  button.addEventListener("click", () => {
    for (const filter of filters) {
      filter.setAttribute("aria-pressed", String(filter === button));
    }
    renderProducts(button.dataset.filter);
  });
}

document.querySelector("[data-open-search]").addEventListener("click", () => {
  searchInput.value = "";
  renderSearch();
  searchDialog.showModal();
  searchInput.focus();
});

searchInput.addEventListener("input", renderSearch);

bagButton.addEventListener("click", () => {
  renderCart();
  cartDialog.showModal();
});

menuButton.addEventListener("click", () => toggleMenu(mobileNav.hidden));
mobileNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) toggleMenu(false);
});
mobileNav.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    toggleMenu(false);
    menuButton.focus();
  }
});

for (const dialog of [searchDialog, productDialog, cartDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target.closest("[data-close]")) dialog.close();
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
  });
}

for (const list of [grid, searchResults]) {
  list.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-product]");
    if (!trigger) return;
    if (searchDialog.open) searchDialog.close();
    openProduct(trigger.dataset.product);
  });
}

cartContent.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  const summaryButton = event.target.closest("[data-summary]");

  if (event.target.closest("[data-shop]")) cartDialog.close();

  if (actionButton) {
    const { action, index } = actionButton.dataset;
    const entry = cart[index];
    const remove = action === "remove" || (action === "decrease" && entry.quantity === 1);
    if (remove) cart.splice(Number(index), 1);
    else if (action === "decrease") entry.quantity -= 1;
    else if (entry.quantity < 99) entry.quantity += 1;

    saveCart();
    renderCart();
    const nextFocus = cartContent.querySelector(
      `[data-action="${action}"][data-index="${index}"]:not(:disabled)`
    ) || cartContent.querySelector("button:not(:disabled), a");
    nextFocus?.focus();
  }

  if (summaryButton) {
    const summary = document.querySelector("#order-summary");
    const textarea = document.querySelector("#order-text");
    const lines = cart.map((entry) => {
      const product = findProduct(entry.id);
      return `${entry.quantity} × ${product.name} (${entry.size}) — ${currency.format(product.price * entry.quantity)}`;
    });
    textarea.value = ["Streetwaer — Resumo da sacola", ...lines, `Subtotal: ${currency.format(cartTotal())}`].join("\n");
    summary.hidden = false;
    summaryButton.setAttribute("aria-expanded", "true");
    textarea.focus();
    textarea.select();
  }
});

renderProducts();
syncCart();
updateNavigation();
window.addEventListener("hashchange", updateNavigation);

const hero = document.querySelector(".hero");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let scrollFrame;

function updateHeroMotion() {
  scrollFrame = undefined;
  const offset = reducedMotion.matches ? 0 : Math.min(window.scrollY * 0.075, 32);
  hero.style.setProperty("--hero-shift", `${offset}px`);
}

window.addEventListener("scroll", () => {
  if (!reducedMotion.matches && scrollFrame === undefined) {
    scrollFrame = window.requestAnimationFrame(updateHeroMotion);
  }
}, { passive: true });
reducedMotion.addEventListener("change", updateHeroMotion);
updateHeroMotion();

const fittingStage = document.querySelector("#fitting-stage");
const fittingPhoto = document.querySelector("#fitting-photo");
const fittingLookImage = document.querySelector("#fitting-look-image");
const fittingModes = document.querySelectorAll("[data-fitting-mode]");
const fittingState = document.querySelector("#fitting-state");
const fittingOutfits = document.querySelector("#fitting-outfits");
const fittingSelection = document.querySelector("#fitting-selection");
const fittingControls = document.querySelectorAll("[data-rotate], [data-reset-view], [data-fitting-zoom]");
const zoomButton = document.querySelector("[data-fitting-zoom]");
const fittingReference = document.querySelector("#fitting-reference-image");
const fittingCaption = document.querySelector("#fitting-reference-caption");
const fittingLooks = {
  "camiseta-asfalto": { baggy: "assets/look-camiseta-baggy.webp", base: "assets/look-camiseta-base.webp" },
  "moletom-concreto": { baggy: "assets/look-moletom-baggy.webp", base: "assets/look-moletom-base.webp" },
  tank: { baggy: "assets/baggy.webp", base: "assets/look-regata-base.webp" }
};
const outfit = { upper: "camiseta-asfalto", lower: "cargo-subsolo" };
let fitting;
let fittingLoad;
let referenceProduct = findProduct(outfit.upper);
let zoomed = false;

function outfitSlot(product) {
  return product.category === "calcas" ? "lower" : "upper";
}

function updateOutfitButtons() {
  for (const button of fittingOutfits.querySelectorAll("[data-outfit]")) {
    const product = findProduct(button.dataset.outfit);
    const worn = outfit[outfitSlot(product)] === product.id;
    button.setAttribute("aria-pressed", String(worn));
    button.querySelector(".outfit-action").textContent = worn ? "Vestindo" : "Vestir";
  }
}

function updateFittingPhoto() {
  const top = outfit.upper ? findProduct(outfit.upper).name : "regata clara";
  const bottom = outfit.lower ? findProduct(outfit.lower).name : "bermuda preta";
  const source = fittingLooks[outfit.upper || "tank"][outfit.lower ? "baggy" : "base"];
  fittingLookImage.alt = `Modelo vestindo ${top} e ${bottom}`;
  if (fittingLookImage.getAttribute("src") !== source) fittingLookImage.src = source;
}

function updateFittingZoom(enabled) {
  zoomed = enabled;
  zoomButton.setAttribute("aria-pressed", String(zoomed));
  zoomButton.textContent = zoomed ? "VER LOOK INTEIRO" : "VER DE PERTO";
  fitting?.focusPiece(zoomed ? outfitSlot(referenceProduct) : null);
}

function wearProduct(product, toggle = true) {
  const slot = outfitSlot(product);
  outfit[slot] = toggle && outfit[slot] === product.id ? null : product.id;
  updateOutfitButtons();
  referenceProduct = product;
  fittingReference.src = product.image;
  fittingReference.alt = `${product.name} vestida na modelo`;
  fittingCaption.textContent = product.name;
  updateFittingZoom(zoomed);
  fittingSelection.textContent = outfit[slot]
    ? `${product.name} na personagem.`
    : `${product.name} removida da personagem.`;
  fitting?.setOutfit(outfit);
  updateFittingPhoto();
}

function loadFitting() {
  if (fittingLoad) return;
  fittingStage.setAttribute("aria-busy", "true");
  fittingLoad = import("./fitting.js").then(async ({ createFittingRoom }) => {
    fitting = await createFittingRoom(document.querySelector("#fitting-canvas"));
    fitting.setOutfit(outfit);
    updateFittingZoom(zoomed);
    fittingState.hidden = true;
    for (const button of fittingControls) button.disabled = false;
  }).catch(() => {
    fittingState.textContent = "A rotação 3D está indisponível neste navegador. Selecione Foto da modelo para continuar provando as peças.";
  }).finally(() => fittingStage.setAttribute("aria-busy", "false"));
}

fittingOutfits.innerHTML = products.map((product) => `
  <button class="outfit-button" type="button" data-outfit="${product.id}" aria-pressed="false" aria-label="${product.name}">
    <img src="${product.image}" alt="" width="58" height="64" loading="lazy">
    <span class="outfit-name">${product.name}<small>${product.color}</small></span>
    <span class="outfit-action" aria-hidden="true">Vestir</span>
  </button>
`).join("");
updateOutfitButtons();

fittingOutfits.addEventListener("click", (event) => {
  const button = event.target.closest("[data-outfit]");
  if (button) wearProduct(findProduct(button.dataset.outfit));
});

for (const button of fittingControls) {
  button.addEventListener("click", () => {
    if (button === zoomButton) {
      updateFittingZoom(!zoomed);
    } else if (button.hasAttribute("data-reset-view")) {
      updateFittingZoom(false);
      fitting.resetView();
    } else {
      fitting.rotate(Number(button.dataset.rotate));
    }
  });
}

for (const button of fittingModes) {
  button.addEventListener("click", () => {
    const use3D = button.dataset.fittingMode === "3d";
    for (const mode of fittingModes) {
      mode.setAttribute("aria-pressed", String(mode === button));
    }
    fittingPhoto.hidden = use3D;
    fittingStage.hidden = !use3D;
    fittingReference.closest("details").hidden = !use3D;
    if (use3D) loadFitting();
  });
}

const fittingObserver = new IntersectionObserver(([entry], observer) => {
  if (entry.isIntersecting) {
    loadFitting();
    observer.disconnect();
  }
}, { rootMargin: "260px" });
fittingObserver.observe(fittingStage);
