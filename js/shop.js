// search item
function searchItem() {
    let nameSearch = document.getElementById("nameSearch");
    if (nameSearch.value) {
        localStorage.setItem("searchItem", nameSearch.value);
        localStorage.setItem("searchType", "name");
        window.location.pathname = "/shop.html";
    }
}

let searchItemPrev = localStorage.getItem("searchItem");
let searchType = localStorage.getItem("searchType");

if (searchType === "category") {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchItemPrev}`)
        .then((res) => res.json())
        .then((data) => latestMeal(data.meals))
        .catch((err) => errorFunction());
} else if (searchType === "name") {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchItemPrev}`)
        .then((res) => res.json())
        .then((data) => latestMeal(data.meals))
        .catch((err) => errorFunction());
}

let latestMeal = (meals) => {
    let storeMeal = document.getElementById("store_meals-area");
    document.getElementById("heading").innerText = searchItemPrev;
    meals.forEach((meal) => {
        let div = document.createElement("div");
        div.classList.add("col");
        div.innerHTML = `
                <div class="card h-100" onclick="fetchSingleItemsById('${meal.idMeal}')">
                    <img src="${meal.strMealThumb}" alt=' ${meal.strMeal}' class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title"> ${meal.strMeal} </h5>
                        <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>

                        <div class="mt-auto">
                            <button class='btn btn-success' onclick="cartPage(event, ${meal.idMeal})" >Add to Cart</button>
                            <button class='btn btn-primary' onclick="goCart()" >Go to cart</button>
                        </div>

                    </div>
                </div>
                `;
        storeMeal.appendChild(div);

        document.getElementById("preloader").classList.add("d-none");
        document.body.style.overflowY = "visible";
    });
};

// errorFunction()
function errorFunction() {
    document.getElementById("heading").innerText = "Error";
    let div = document.createElement("div");
    div.classList.add("col", "text-capitalize");
    div.innerHTML = `can't find anything`;
    storeMeal.appendChild(div);

    document.getElementById("preloader").classList.add("d-none");
    document.body.style.overflowY = "visible";
}

// single meal items
function fetchSingleItemsById(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((res) => res.json())
        .then((data) => singleItem(data.meals))
        .catch((err) => console.log(err));
}

let singleSection = document.querySelector(".singleItem_section");

function singleItem(mealId) {
    singleSection.style.display = "grid";
    // console.log(mealId[0])
    let div = document.createElement("div");
    div.classList.add("card", "mb-3");
    div.innerHTML = `
        <div class="row g-0m align-items-stretch">
            <div class="col-md-4">
                <img src="${mealId[0].strMealThumb}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${mealId[0].strMeal}</h5>
                    <div class="text-success"> Category: ${mealId[0].strCategory}</div>
                    <p class="card-text">${mealId[0].strInstructions.slice(0, 700)}</p>
                    <button class='btn btn-success' onclick="cartPage(event, ${mealId[0].idMeal})" >Add to Cart</button>
                    <button class='btn btn-primary' onclick="goCart()" >Go to cart</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById("single_container").appendChild(div);
    document.body.style.overflowY = "hidden";
}
// close single items
singleSection.addEventListener("click", function () {
    singleSection.style.display = "none";
    document.getElementById("single_container").innerHTML = "";
    document.body.style.overflowY = "visible";
});

function cartPage(event, id) {
    event.stopPropagation();
    let localCardItem = [];
    if (localStorage.getItem("cardItem")) {
        localCardItem = JSON.parse(localStorage.getItem("cardItem"));
    } else {
        localCardItem = [];
    }
    let duplicateId = localCardItem.find((preId) => preId === id);
    if (!duplicateId) {
        let cardItem = [...localCardItem, id];
        // console.log(cardItem)
        localStorage.setItem("cardItem", JSON.stringify(cardItem));

        // cart item count
        let items = (localCardItem = JSON.parse(localStorage.getItem("cardItem")));
        document.getElementById("cartItem").innerText = items.length;
    }
}

function goCart() {
    location.pathname = "/shopping_cart.html";
}

// cart item count
let items = (localCardItem = JSON.parse(localStorage.getItem("cardItem")));
document.getElementById("cartItem").innerText = items.length;
