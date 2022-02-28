let price = 50;
document.getElementById("perPrice").innerText = price;
// cart item count
let cartItems = JSON.parse(localStorage.getItem("cardItem"));
if (cartItems && cartItems.length) {
    document.getElementById("cartItem").innerText = cartItems.length;
    document.getElementById("checkOut").classList.remove("d-none");
} else {
    document.getElementById("errorMess").innerHTML = `
    <h5 class="text-danger"> No items in your cart, Please buy some thing to <a href='/index.html'>click hare</a> </h5>
    `;
    document.getElementById("checkOut").classList.add("d-none");
    document.getElementById("preloader").classList.add("d-none");
}

const fetchCardItem = () => {
    let cartItems = JSON.parse(localStorage.getItem("cardItem"));
    document.getElementById("cartItemsContainer").innerHTML = "";
    if (cartItems) {
        cartItems.forEach((cartItem) => {
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${cartItem}`)
                .then((res) => res.json())
                .then((data) => allCartItems(data.meals))
                .catch((err) => console.log(err));
        });
    }
};

function allCartItems(meals) {
    document.getElementById("preloader").classList.add("d-none");
    // console.log(meals)
    let div = document.createElement("div");
    div.classList.add("mb-5");
    div.innerHTML = `
    <div class="displayGrid" id="gridId_${meals[0].idMeal}" >
        <img src="${meals[0].strMealThumb}" height='100' width='100' alt="img">
        <h5 class="name fw-bold"> ${meals[0].strMeal} </h5>
        <h5 class="d-flex fw-bold">
            <div class="quantity d-flex m-auto align-items-center">
                <div onclick="quantityPlus('gridId_${meals[0].idMeal}')" class="btn fw-bold fs-4"> + </div>
                <div class=" mx-3 quantityValue "> 1 </div>
                <div onclick="quantityMinus('gridId_${meals[0].idMeal}')" onclick="" class="btn fw-bold fs-4"> - </div>
            </div>
        </h5>
        <h5 class="fw-bold totalPrice" id="total_${meals[0].idMeal}">
            50
        </h5>
        <h5 class="btn fw-bold text-danger" onClick="deleteItems('${meals[0].idMeal}')"> X </h5>

    </div>
    `;
    document.getElementById("cartItemsContainer").appendChild(div);
}

fetchCardItem();
// delete from cart list
function deleteItems(id) {
    let cartItems = JSON.parse(localStorage.getItem("cardItem"));
    let updatedItems = cartItems.filter((item) => item !== parseInt(id));
    localStorage.setItem("cardItem", JSON.stringify(updatedItems));
    let cartItemsLength = JSON.parse(localStorage.getItem("cardItem"));

    if (cartItemsLength.length) {
        document.getElementById("cartItem").innerText = cartItemsLength.length;
    } else {
        document.getElementById("cartItem").innerText = cartItemsLength.length;
        document.getElementById("errorMess").innerHTML = `
        <h5 class="text-danger"> No items in your cart, Please buy some thing to <a href='/index.html'>click hare</a> </h5>
        `;
        document.getElementById("checkOut").classList.add("d-none");
        document.getElementById("preloader").classList.add("d-none");
    }
    fetchCardItem();
}

// quantityPlus
function quantityPlus(id) {
    // dom
    let quantityValueText = document.querySelector(`#${id} .quantityValue`);
    let quantityValue = parseInt(quantityValueText.innerText);
    let totalPriceText = document.querySelector(`#${id} .totalPrice`);

    // add function
    quantityValue = quantityValue + 1;
    if (quantityValue <= 10) {
        quantityValueText.innerText = quantityValue;
        totalPriceText.innerHTML = price * quantityValue;
    }
}
// quantityMinus
function quantityMinus(id) {
    // dom
    let quantityValueText = document.querySelector(`#${id} .quantityValue`);
    let quantityValue = parseInt(quantityValueText.innerText);
    let totalPriceText = document.querySelector(`#${id} .totalPrice`);

    // minus function
    quantityValue = quantityValue - 1;
    if (quantityValue >= 0) {
        quantityValueText.innerText = quantityValue;
        totalPriceText.innerHTML = price * quantityValue;
    }
}

// check out
document.getElementById("checkOut").addEventListener("click", function () {
    // set subtotal
    let totalPrices = document.getElementsByClassName("totalPrice");
    let balancedValue = 0;
    for (const tag of totalPrices) {
        balancedValue += parseInt(tag.innerText);
    }

    let balanceDiv = document.getElementById("balance");
    balanceDiv.classList.remove("d-none");
    document.getElementById("subtotalValue").innerText = balancedValue;
    let taxBalance = (balancedValue * 5) / 100;
    document.getElementById("taxValue").innerText = taxBalance;
    let totalBalance = balancedValue + taxBalance;
    document.getElementById("totalValue").innerText = totalBalance;

    balanceDiv.addEventListener("click", function () {
        balanceDiv.classList.add("d-none");
    });
});

// confirm
document.getElementById("confirmOrder").addEventListener("click", function (event) {
    event.stopPropagation();
    alert("your order is confirmed");
    window.location.pathname = "/index.html";

    localStorage.removeItem("cardItem");
});
