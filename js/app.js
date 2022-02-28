// search item
function searchItem() {
    let nameSearch = document.getElementById("nameSearch");
    if (nameSearch.value) {
        localStorage.setItem("searchItem", nameSearch.value);
        localStorage.setItem("searchType", "name");
        window.location.pathname = "/shop.html";
    }
}

// catagories
fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
    .then((res) => res.json())
    .then((data) => categories(data.meals))
    .catch((err) => console.log(err));

function categories(categories) {
    let heroItem = document.getElementById("heroItem");
    categories.forEach((category) => {
        let li = document.createElement("li");
        li.onclick = () => singleCategory(category.strCategory);
        li.innerHTML = `<a href="#"> ${category.strCategory} </a>`;
        heroItem.appendChild(li);

        document.getElementById("preloader").classList.add("d-none");
        document.body.style.overflowY = "visible";
    });
}

// latest meal
fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then((res) => res.json())
    .then((data) => mealCategories(data.categories))
    .catch((err) => console.log(err));

let mealCategories = (meals) => {
    let latestMealsArea = document.getElementById("latest_meals-area");
    meals.forEach((meal) => {
        let div = document.createElement("div");
        div.classList.add("col");
        div.innerHTML = `
            <div class="card" onclick="singleCategory('${meal.strCategory}')">
                <img src="${meal.strCategoryThumb}" alt=' ${meal.strCategory}' class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title"> ${meal.strCategory} </h5>
                    <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                </div>
            </div>
            `;
        latestMealsArea.appendChild(div);
    });
};

function singleCategory(cName) {
    localStorage.setItem("searchItem", cName);
    localStorage.setItem("searchType", "category");
    window.location.pathname = "/shop.html";
}

// cart item count
let items = (localCardItem = JSON.parse(localStorage.getItem("cardItem")));
document.getElementById("cartItem").innerText = items.length;
