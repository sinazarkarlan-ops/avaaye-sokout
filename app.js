let products =
JSON.parse(localStorage.getItem("products")) || [];

let history =
JSON.parse(localStorage.getItem("history")) || [];

let editId = null;

const productList =
document.getElementById("productList");

const alertList =
document.getElementById("alertList");

const historyList =
document.getElementById("historyList");

const productCount =
document.getElementById("productCount");

const inventoryValue =
document.getElementById("inventoryValue");

const modal =
document.getElementById("productModal");

const modalTitle =
document.getElementById("modalTitle");

function saveData(){

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );
}

function money(num){

    return Number(num || 0)
    .toLocaleString("fa-IR");
}

function addHistory(text){

    history.push({

        date:
        new Date()
        .toLocaleString("fa-IR"),

        text

    });

    saveData();
}

function openModal(){

    modal.classList.remove("hidden");
}

function closeModal(){

    modal.classList.add("hidden");

    document
    .getElementById("nameInput")
    .value = "";

    document
    .getElementById("brandInput")
    .value = "";

    document
    .getElementById("quantityInput")
    .value = "";

    document
    .getElementById("buyPriceInput")
    .value = "";

    document
    .getElementById("sellPriceInput")
    .value = "";

    editId = null;

    modalTitle.textContent =
    "افزودن کالا";
}

function renderAlerts(){

    alertList.innerHTML = "";

    products.forEach(product=>{

        if(product.quantity === 1){

            alertList.innerHTML += `
            <div class="alert-warning">
            🟠 ${product.name}
            - فقط ۱ عدد موجود
            </div>`;
        }

        if(product.quantity === 0){

            alertList.innerHTML += `
            <div class="alert-empty">
            🔴 ${product.name}
            - ناموجود
            </div>`;
        }

    });

}

function renderHistory(){

    historyList.innerHTML = "";

    history
    .slice()
    .reverse()
    .forEach(item=>{

        historyList.innerHTML += `
        <div class="history-item">
        ${item.date}
        <br>
        ${item.text}
        </div>`;
    });

}

function renderProducts(){

    productList.innerHTML = "";

    let total = 0;

    const search =
    document
    .getElementById("searchInput")
    .value
    .toLowerCase();

    products
    .filter(product =>
        product.name
        .toLowerCase()
        .includes(search)
    )
    .forEach(product=>{

        total +=
        product.buyPrice *
        product.quantity;

        let stockClass = "";

        if(product.quantity === 1){

            stockClass =
            "stock-warning";
        }

        if(product.quantity === 0){

            stockClass =
            "stock-empty";
        }

        productList.innerHTML += `
        <div class="product-card ${stockClass}">

            <h3>${product.name}</h3>

            <p>
            دسته:
            ${product.category}
            </p>

            <p>
            برند:
            ${product.brand}
            </p>

            <p>
            موجودی:
            ${product.quantity}
            </p>

            <p>
            خرید:
            ${money(product.buyPrice)}
            تومان
            </p>

            <p>
            فروش:
            ${money(product.sellPrice)}
            تومان
            </p>

            <div class="product-actions">

                <button
                class="edit-btn"
                onclick="editProduct(${product.id})">
                ویرایش
                </button>

                <button
                class="delete-btn"
                onclick="deleteProduct(${product.id})">
                حذف
                </button>

            </div>

            <div class="product-actions">

                <button
                class="in-btn"
                onclick="stockIn(${product.id})">
                ورود کالا
                </button>

                <button
                class="out-btn"
                onclick="stockOut(${product.id})">
                خروج کالا
                </button>

            </div>

        </div>`;
    });

    productCount.textContent =
    products.length;

    inventoryValue.textContent =
    money(total) + " تومان";

    renderAlerts();

    renderHistory();

}

document
.getElementById("addProductBtn")
.addEventListener("click", ()=>{

    editId = null;

    modalTitle.textContent =
    "افزودن کالا";

    openModal();
});

document
.getElementById("cancelBtn")
.addEventListener("click", closeModal);

document
.getElementById("saveProductBtn")
.addEventListener("click", ()=>{

    const name =
    document
    .getElementById("nameInput")
    .value;

    const category =
    document
    .getElementById("categoryInput")
    .value;

    const brand =
    document
    .getElementById("brandInput")
    .value;

    const quantity =
    Number(
    document
    .getElementById("quantityInput")
    .value);

    const buyPrice =
    Number(
    document
    .getElementById("buyPriceInput")
    .value);

    const sellPrice =
    Number(
    document
    .getElementById("sellPriceInput")
    .value);

    if(!name){

        alert("نام کالا را وارد کنید");

        return;
    }

    if(editId){

        const p =
        products.find(
        x=>x.id===editId);

        p.name = name;
        p.category = category;
        p.brand = brand;
        p.quantity = quantity;
        p.buyPrice = buyPrice;
        p.sellPrice = sellPrice;

        addHistory(
        `ویرایش کالا: ${name}`);

    }else{

        products.push({

            id:Date.now(),

            name,
            category,
            brand,
            quantity,
            buyPrice,
            sellPrice

        });

        addHistory(
        `افزودن کالا: ${name}`);
    }

    saveData();

    renderProducts();

    closeModal();

});

function editProduct(id){

    const p =
    products.find(
    x=>x.id===id);

    editId = id;

    modalTitle.textContent =
    "ویرایش کالا";

    document
    .getElementById("nameInput")
    .value = p.name;

    document
    .getElementById("categoryInput")
    .value = p.category;

    document
    .getElementById("brandInput")
    .value = p.brand;

    document
    .getElementById("quantityInput")
    .value = p.quantity;

    document
    .getElementById("buyPriceInput")
    .value = p.buyPrice;

    document
    .getElementById("sellPriceInput")
    .value = p.sellPrice;

    openModal();
}

function deleteProduct(id){

    const p =
    products.find(
    x=>x.id===id);

    if(
    confirm(
    `حذف ${p.name} ؟`
    )){

        products =
        products.filter(
        x=>x.id!==id);

        addHistory(
        `حذف کالا: ${p.name}`);

        saveData();

        renderProducts();
    }
}

function stockIn(id){

    const qty =
    Number(
    prompt(
    "تعداد ورود کالا"
    ));

    if(!qty) return;

    const p =
    products.find(
    x=>x.id===id);

    p.quantity += qty;

    addHistory(
    `ورود ${qty} عدد ${p.name}`);

    saveData();

    renderProducts();
}

function stockOut(id){

    const qty =
    Number(
    prompt(
    "تعداد خروج کالا"
    ));

    if(!qty) return;

    const p =
    products.find(
    x=>x.id===id);

    if(qty > p.quantity){

        alert(
        "موجودی کافی نیست"
        );

        return;
    }

    p.quantity -= qty;

    addHistory(
    `خروج ${qty} عدد ${p.name}`);

    saveData();

    renderProducts();
}

document
.getElementById("searchInput")
.addEventListener(
"input",
renderProducts
);

renderProducts();