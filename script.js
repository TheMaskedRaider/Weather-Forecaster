console.log("Hi")
var searchButton = document.querySelector('#search-button');
var cityInput = document.querySelector("#city-search");
var jumboEl = document.querySelector("#jumbo-dude");
var todayDateEl = document.getElementById("todays-date");
var cityEl = document.getElementById("chosen-city");
var tempEl = document.getElementById("current-temp");
var humidEl = document.getElementById("current-humid");
var uviEl = document.getElementById("current-UVI");
var weeklyEL = document.getElementById("weekly-forecast");
var key = "6dc3e95177ba3d57d7f0c5e07d775d52";
var currentCity = "Los Angeles";
var citySearchedList = [];


//load list of previous cities searched


//accept user input for city
function changeCity(event) {
    event.preventDefault();
    var userText = cityInput.value.trim();
    currentCity = userText;
    console.log(currentCity);
    testWeather(currentCity);
}

function testWeather(cityID) {
    //fetch weather api
    var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&appid=" + key;
    fetch(currentWeatherURL)
        //fetch weather api and confirm that response is good
        .then(function (response) {
            console.log("success")
            console.log(response)
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            cityEl.innerHTML = "City:" + data.name;
            tempEl.innerHTML = "Current temp: "+ Math.round(data.main.temp*(9/5)-459.67)+"º";
            humidEl.innerHTML ="Humidity: "+data.main.humidity+"%";
            var longlatData = data.coord;
            console.log(data.coord);
            console.log(longlatData);
            return longlatData;
        })
        .then(function (coordinates) {
            console.log(coordinates)
            console.log(coordinates.lat)
            var oneClickUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + coordinates.lat + "&lon=" + coordinates.lon + "&exclude=minutely,hourly,alerts&appid=" + key;
            console.log(oneClickUrl);

            fetch(oneClickUrl)

                .then(function (response2) {

                    return response2.json();
                })
                .then(function (data2) {
                    console.log(data2);
                    uviEl.innerHTML = "UVI: "+ data2.current.uvi;
                    let removalEl = weeklyEL;
                    console.log(data2.current.dt);
                    while (removalEl.firstChild) {
                        removalEl.removeChild(removalEl.firstChild);
                    }
                    // console.log(yo.getDate())

                    for (var i = 1; i < 6; i++) {
                        var dailyTemp = Math.round(data2.daily[i].temp.day*(9/5)-459.67);
                        var dailyHumidity = data2.daily[i].humidity; 
                        console.log(dailyTemp)
                        var dailyDtObj = new Date(data2.daily[i].dt * 1000);
                        var dailyDate = dailyDtObj.getMonth() + 1 + "/" + dailyDtObj.getDate() + "/" + dailyDtObj.getFullYear()
                        var cardEl = $("<div class='col card-body'>" + dailyDate + "</div>");
                        console.log(cardEl);
                        console.log(jumboEl);
                        $(weeklyEL).append(cardEl); // Create a new card and append to jumbotron //append date to new card
                        $(cardEl).append("<p>Temp: "+ dailyTemp+"º <p>")
                        $(cardEl).append("<p>Humidity: "+ dailyHumidity+"%<p>")
                    }
                    todayDateEl.innerHTML = new Date(data2.daily[0].dt * 1000);
                })




        })

    //     var tempCurrent = jumboEl.createElement('p');
    //     jumboEl.appendChild(tempCurrent)
    //     // tempCurrent.innerHTML;



}


testWeather(currentCity);
//on click of search button, clear previous weather display for new and add new
searchButton.addEventListener("click", changeCity)