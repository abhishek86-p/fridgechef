async function getRecipes() {
  const input = document.getElementById("ingredients").value.trim().toLowerCase();
  const apiKey = "83ca671229ce411c9e00deeac1ef1927"; // replace with your Spoonacular API key
  const recipeDiv = document.getElementById("recipeResults");
  recipeDiv.innerHTML = "Loading...";

  const res = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${input}&number=5&apiKey=${apiKey}`);
  const recipes = await res.json();

  if (!recipes.length) {
    recipeDiv.innerHTML = "<p>No recipes found.</p>";
    return;
  }

  recipeDiv.innerHTML = "";

  for (const recipe of recipes) {
    const infoRes = await fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`);
    const info = await infoRes.json();

    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      <h3>${recipe.title}</h3>
      <img src="${recipe.image}" alt="${recipe.title}" />
      <p><b>Used:</b> ${recipe.usedIngredients.map(i => i.name).join(", ")}</p>
      <p><b>Missing:</b> ${recipe.missedIngredients.map(i => i.name).join(", ")}</p>
      <button class="read-more" onclick="toggleDetails(this)">Read More</button>
      <div class="more-details">
        <p><b>Summary:</b> ${stripHTML(info.summary)}</p>
        <p><b>Instructions:</b> ${info.instructions || "Instructions not available."}</p>
      </div>
    `;

    recipeDiv.appendChild(card);
  }
}

function toggleDetails(btn) {
  const details = btn.nextElementSibling;
  const isOpen = details.style.display === "block";
  details.style.display = isOpen ? "none" : "block";
  btn.textContent = isOpen ? "Read More" : "Hide Details";
}

function stripHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.innerText;
}
