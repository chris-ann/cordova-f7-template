var app = new Framework7({
    // App root element
    el: '#app',
    routes: [
        {
            path: '/',
            url: 'index.html',
        },
        {
            path: '/page2/',
            url: 'pages/page2.html',
        },
    ],
    // ... other parameters
});
var mainView = app.views.create('.view-main')

document.addEventListener('deviceready', onDeviceReady, false);

var $$ = Dom7;
var lat;
var long;
var geoOpts = {
    enableHighAccuracy: true
}

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOpts);
}
function geoSuccess(position) {
    console.log(position);
    lat = position.coords.latitude
    long = position.coords.longitude;
    $("#currentPos").append("<p>" + lat + ", " + long + "</p>")
}
function geoError(message) {
    alert(message.message)
}

//LOAD MAP AND WATCHPOSITION ON SECOND PAGE
$$(document).on('page:init', '.page[data-name="page2"]', function () {

    //CREATE THE MAP
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: { lat: lat, lng: long }
    })
    //ADD THE MARKER
    var marker = new google.maps.Marker({
        position: { lat: lat, lng: long },
        map: map
    })

    // ATTACH EVENT LISTENERS TO WATCH BUTTONS
    var watchID;
    $("#startWatch").on('click', function () {
        watchID = navigator.geolocation.watchPosition(watchSuccess, geoError, geoOpts)
        $(this).hide()
        $("#stopWatch").show()
    })
    $("#stopWatch").on('click', function () {
        navigator.geolocation.clearWatch(watchID)
        $(this).hide()
        $("#startWatch").show()
    })
    function watchSuccess(position) {
        console.log(position);
        lat = position.coords.latitude
        long = position.coords.longitude;

        var coords = { lat: lat, lng: long }
        map.setCenter(coords);
        marker.setPosition(coords);
    }
})


