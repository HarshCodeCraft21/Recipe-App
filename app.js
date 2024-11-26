const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const recipeContainer = document.querySelector('.recipe-content');
const textMSG = document.querySelector('.text-msg');
const recipePopUp = document.querySelector('.recipe-popUp');

const fetchRecipe = async (query) => {
    textMSG.innerHTML = 'fetching your recipe...'

    try {
        let URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
        let response = await fetch(URL);
        let data = await response.json();

        //fetching logic of a recipe by foreach loop
        textMSG.innerHTML = '';
        data.meals.forEach(meal => {
            recipeTemplate(meal)
        })
    } catch (error) {
        if(!navigator.onLine){
            textMSG.innerHTML = 'check your internet connection'
        }
        else{
            textMSG.innerHTML = 'No Image Found'
        }
    }
};

function recipeTemplate(meal) {
    let recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe-div');
    recipeDiv.innerHTML = `
    <img src="${meal.strMealThumb}">
    <h3>${meal.strMeal.length > 10 ? meal.strMeal.slice(0, 10) + "..." : meal.strMeal
        }</h3>
    <p><strong>${meal.strArea}</strong> Dish</p>
    <p>${meal.strCategory}</p>
    `;

    let recipeBtn = document.createElement('button');
    recipeBtn.classList.add('recipe-btn');
    recipeBtn.textContent = "View Recipe";

    recipeDiv.appendChild(recipeBtn);
    recipeContainer.appendChild(recipeDiv);

    recipeBtn.addEventListener('click', () => {
        popUp(meal)
        // console.log(meal)
    })

}

function popUp(meal) {
    recipePopUp.style.display = 'block';

    let closeBtn = document.getElementById('close-btn');
    closeBtn.addEventListener('click', () => {
        recipePopUp.style.display = 'none';
    })

    popUpTemplate(meal)
}

function popUpTemplate(meal) {
    let recipePopupContent = document.querySelector('.recipe-popup-content');
    recipePopupContent.innerHTML = `
    <h3>${meal.strMeal}</h3>
    `

    let ingredient = document.createElement('table');
    ingredient.setAttribute("border", "1");
    ingredient.innerHTML = `
    <th>Ingredient</th>
    <th>Measurement</th>

    `
    for (let i = 1; i <= 20; i++) {
        let ingredientValue = meal[`strIngredient${i}`];
        if (ingredientValue) {
            ingredient.innerHTML += `
            <tr>
                <td>${ingredientValue}</td>
                <td>${meal[`strMeasure${i}`]}</td>
            </tr>
            `
        }
        else {
            break;
        }
    }

    let instructionsDiv = document.createElement('div');
    instructionsDiv.classList.add('instruction-div')
    instructionsDiv.innerHTML = `<h3>Instructions</h3><p>${meal.strInstructions}</p>
    
    <h2>For More Information click the buttons down below👇</h2>
    <button class='bgblue'>
    <a href = "${meal.strSource}" target="_blank">Source</a>
    </button>
    <button class='bgred'>
    <a href = "${meal.strYoutube}" target="_blank">Youtube</a>
    </button>
    `

    recipePopupContent.appendChild(ingredient);
    recipePopupContent.appendChild(instructionsDiv)
    // console.log(meal)
}
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();

    let search = searchInput.value.trim();
    if (search !== '') {
        fetchRecipe(search);
    }
    else {
        textMSG.textContent = 'Please enter a search term';
    }
})