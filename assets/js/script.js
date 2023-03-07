var apiKey = "dc071bf93c64cc5743355598383576f9";
var cityInput = document.getElementById("new-city");
var searchBtn = document.getElementById("search-btn");
var clearHistoryBtn = document.getElementById("clear-search");
var searchHist = document.getElementById("search-history");
var currentWeather = document.getElementById("current-weather")
var currentCityEl = document.getElementById("current-city");
var currentIconEl = document.getElementById("current-icon");
var currentTempEl = document.getElementById("current-temp");
var currentHumidEl = document.getElementById("current-humidity");
var currentWindEl = document.getElementById("current-wind");
var fivedayHeader = document.getElementById("fiveday-header");
var fivedayEls = document.querySelectorAll(".fiveday");
var forecastContainer = document.getElementById('forecast')
var storageHistory = [];

//fetch function
var getWeather = function(city) {
    var geoCodingUrl = "http://api.openweathermap.org/geo/1.0/direct?q=+"+city+"&limit=1&appid="+apiKey;
    fetch(geoCodingUrl)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var cityLat = data[0].lat
        var cityLon = data[0].lon
        var searchUrl = "https://api.openweathermap.org/data/2.5/forecast?lat="+cityLat+"&lon="+cityLon+"&appid="+apiKey;
        fetch(searchUrl)
        .then(function (response2) {
            return response2.json()
        })
            .then(function (data2) {
                console.log(data2)
                currentCityEl.innerHTML = data2.city.name + " (" + dayjs().format('MMM D, YYYY') + ")"
                currentIconEl.setAttribute("src", "https://openweathermap.org/img/wn/"+data2.list[0].weather[0].icon+"@2x.png")
                currentTempEl.innerHTML = Math.floor(((data2.list[0].main.temp) - 273.15) * 1.8 + 32) + " &#176F"
                currentHumidEl.innerHTML = data2.list[0].main.humidity + "%"
                currentWindEl.innerHTML = data2.list[0].wind.speed + " MPH"

                for (var i=0; i<fivedayEls.length; i++) {
                    fivedayEls[i].innerHTML = "";
                    //index is used to parse through the 40 values in the list array for the data object
                    //each index in the array is 3 hours apart, and 3 x 8 = 24.
                    var index = i * 8;
                    var fivedayDateEl = document.createElement('p');
                    fivedayDateEl.textContent = dayjs.unix(data2.list[index].dt).format('MMM D, YYYY')
                    fivedayEls[i].append(fivedayDateEl)
                    var fivedayIconEl = document.createElement("img")
                    fivedayIconEl.setAttribute("src", "https://openweathermap.org/img/wn/"+data2.list[index].weather[0].icon+"@2x.png")
                    fivedayEls[i].append(fivedayIconEl);
                    var fivedayTempEl = document.createElement('p');
                    fivedayTempEl.innerHTML = "Temp: " +Math.floor(((data2.list[index].main.temp) - 273.15) * 1.8 + 32) + " &#176F"
                    fivedayEls[i].append(fivedayTempEl)
                    var fivedayHumidityEl = document.createElement('p')
                    fivedayHumidityEl.innerHTML = "Humidity: " + data2.list[index].main.humidity + "%"
                    fivedayEls[i].append(fivedayHumidityEl)
                    var fivedayWindEl = document.createElement('p')
                    fivedayWindEl.innerHTML = "Wind: " + data2.list[index].wind.speed + " MPH"
                    fivedayEls[i].append(fivedayWindEl)
                }



            })
        })
}

//display weather data

//set local storage
var saveCity = function(city){
    if (storageHistory == null){
        storageHistory = [];
    }
    storageHistory.push(city)
    //console.log(storageHistory)
    localStorage.setItem("city", JSON.stringify(storageHistory))
    cityInput.value = "";
    var searchedCity = document.createElement("input")
    searchedCity.setAttribute("type", "button")
    searchedCity.setAttribute("class", "d-block")
    searchedCity.setAttribute("value", city)
    searchedCity.addEventListener("click", function () {
        getWeather(searchedCity.value)
    })
    searchHist.append(searchedCity)
} //}
//load local storage
var loadStorage = function(){
    storageHistory = JSON.parse(localStorage.getItem("city"));
    //console.log(storageHistory)
    if (storageHistory == null) {
        return;
    }
    for (var i=0; i<storageHistory.length; i++) {
        var searchedCity = document.createElement("input")
        searchedCity.setAttribute("type", "button")
        searchedCity.setAttribute("class", "d-block")
        searchedCity.setAttribute("value", storageHistory[i])
        searchedCity.addEventListener("click", function () {
            getWeather(this.value)
            currentWeather.classList.remove("d-none")
            fivedayHeader.classList.remove("d-none")
        })
        searchHist.append(searchedCity)
    }
   
}


searchBtn.addEventListener('click', function(event) {
    event.preventDefault();
    if (cityInput.value.trim() == ""){
        return;
    }
    currentWeather.classList.remove("d-none");
    fivedayHeader.classList.remove("d-none");
    forecastContainer.classList.remove("d-none")
    getWeather(cityInput.value);
    saveCity(cityInput.value);

})

clearHistoryBtn.addEventListener('click', function(event){
    event.preventDefault();
    localStorage.clear();
    storageHistory = [];
    searchHist.innerHTML = "";
    currentWeather.classList.add("d-none");
    fivedayHeader.classList.add("d-none");
    forecastContainer.classList.add("d-none");
})

loadStorage();