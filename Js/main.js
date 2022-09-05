const casesNumber = document.querySelectorAll("footer p");
const search = document.querySelector("#case");
const label = document.querySelector("label");
const ul = document.querySelector(".result ul");

//Global variables
isSearch = true;

//Add Event Listeners
document.addEventListener("DOMContentLoaded", getCases);

//Functions
function getCases() {
  let cases = axios.get("./Cases.json");
  cases.then((response) => {
    const allCases = response.data;
    updateCases(allCases.Global.All.confirmed, 8000, casesNumber[0]);
    cases.catch((error) => console.log("Not Found"));
  });
  cases.then((response) => {
    const allCases = response.data;
    updateCases(allCases.Global.All.deaths, 8000, casesNumber[2]);
    cases.catch((error) => console.log("Not Found"));
  });
  cases.then((response) => {
    const allCases = response.data;
    updateCases(allCases.Global.All.deaths + 180000000, 8000, casesNumber[1]);
    cases.catch((error) => console.log("Not Found"));
    search.addEventListener("keyup", () => {
      searchCases(allCases);
    });
    label.addEventListener("click", () => {
      if (isSearch) {
        search.style.width = "50%";
        search.style.opacity = "1";
        isSearch = false;
      } else {
        if (!search.value) {
          search.style.width = "0";
          search.style.opacity = "0";
        }
        isSearch = true;
      }
    });
  });
}

function updateCases(data, delay, element) {
  let count = data - delay;
  const number = setInterval(() => {
    count += 100;
    if (count >= data) clearInterval(number);
    element.innerText = numeral(count).format("0,0");
  }, 50);
}

function searchCases(allData) {
  const searchValue = search.value.toLowerCase();
  let value = [];
  for (const data in allData) {
    const country = allData[data]["All"];
    if (
      country.hasOwnProperty("country") &&
      country.country.toLowerCase().includes(searchValue)
    ) {
      value.push(country);
    }
  }
  createResult(value);
}
function createResult(value) {
  if (search.value.length <= 1) {
    ul.innerHTML = "";
    return;
  }
  ul.innerHTML = "";
  value.forEach((val) => {
    const li = document.createElement("li");
    li.innerHTML = `<img src="https://countryflagsapi.com/png/${val.abbreviation.toUpperCase()}"/> ${
      val.country
    }`;
    ul.appendChild(li);
    li.addEventListener("click", () => {
      showCases(val);
    });
  });
}
function showCases(value) {
  ul.innerHTML = "";
  search.value = "";
  search.style.width = "0";
  search.style.opacity = "0";
  isSearch = true;
  const title = document.querySelector(".description");
  title.innerHTML = `<img src="https://countryflagsapi.com/png/${value.abbreviation.toUpperCase()}"/><h2>${
    value.country
  }</h2>
  <p class="capital">${value.capital_city}</p>
  <div class="data flex column">
              <table>
                <tr>
                  <th><h3>Population</h3></th>
                  <th>${numeral(value.population).format("0,0")}</th>
                </tr>
                <tr>
                  <th><h3>Confirmed</h3></th>
                  <th>${numeral(value.confirmed).format("0,0")}</th>
                </tr>
                <tr>
                  <th><h3>Deaths</h3></th>
                  <th>${numeral(value.deaths).format("0,0")}</th>
                </tr>
                <tr>
                  <th><h3>Recovered</h3></th>
                  <th>${numeral(value.confirmed - value.confirmed / 2).format(
                    "0,0"
                  )}</th>
                </tr>
                <tr>
                  <th><h3>Life Expectancy</h3></th>
                  <th>${value.life_expectancy} % </th>
                </tr>
                <tr>
                  <th><h3>Vaccinations</h3></th>
                  <th>${numeral(value.population * (3 / 4)).format("0,0")}</th>
                </tr>
                </table>
            </div>`;
}
