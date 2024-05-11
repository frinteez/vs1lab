// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
  * A class to help using the HTML5 Geolocation API.
  */
class LocationHelper {
    // Location values for latitude and longitude are private properties to protect them from changes.
    #latitude = '';

    /**
     * Getter method allows read access to privat location property.
     */
    get latitude() {
        return this.#latitude;
    }

    #longitude = '';

    get longitude() {
        return this.#longitude;
    }

   /**
    * Create LocationHelper instance if coordinates are known.
    * @param {string} latitude 
    * @param {string} longitude 
    */
   constructor(latitude, longitude) {
       this.#latitude = (parseFloat(latitude)).toFixed(5);
       this.#longitude = (parseFloat(longitude)).toFixed(5);
   }

    /**
     * The 'findLocation' method requests the current location details through the geolocation API.
     * It is a static method that should be used to obtain an instance of LocationHelper.
     * Throws an exception if the geolocation API is not available.
     * @param {*} callback a function that will be called with a LocationHelper instance as parameter, that has the current location details
     */
    static findLocation(callback) {
        const geoLocationApi = navigator.geolocation;

        if (!geoLocationApi) {
            throw new Error("The GeoLocation API is unavailable.");
        }

        // Call to the HTML5 geolocation API.
        // Takes a first callback function as argument that is called in case of success.
        // Second callback is optional for handling errors.
        // These callbacks are given as arrow function expressions.
        geoLocationApi.getCurrentPosition((location) => {
            // Create and initialize LocationHelper object.
            let helper = new LocationHelper(location.coords.latitude, location.coords.longitude);
            // Pass the locationHelper object to the callback.
            callback(helper);
        }, (error) => {
           alert(error.message)
        });
    }
}

/**
 * A class to help using the Leaflet map service.
 */
class MapManager {

    #map
    #markers

    /**
    * Initialize a Leaflet map
    * @param {number} latitude The map center latitude
    * @param {number} longitude The map center longitude
    * @param {number} zoom The map zoom, defaults to 18
    */
    initMap(latitude, longitude, zoom = 18) {
        // set up dynamic Leaflet map
        this.#map = L.map('map').setView([latitude, longitude], zoom);
        var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors'}).addTo(this.#map);
        this.#markers = L.layerGroup().addTo(this.#map);
    }

    /**
    * Update the Markers of a Leaflet map
    * @param {number} latitude The map center latitude
    * @param {number} longitude The map center longitude
    * @param {{latitude, longitude, name}[]} tags The map tags, defaults to just the current location
    */
    updateMarkers(latitude, longitude, tags = []) {
        // delete all markers
        this.#markers.clearLayers();
        L.marker([latitude, longitude])
            .bindPopup("Your Location")
            .addTo(this.#markers);
        for (const tag of tags) {
            L.marker([tag.location.latitude,tag.location.longitude])
                .bindPopup(tag.name)
                .addTo(this.#markers);  
        }
    }
}

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

// Function to update the location on the page
function updateLocation() {
    // Call the findLocation method of LocationHelper to get current location
    LocationHelper.findLocation((locationHelper) => {
        // Retrieve latitude and longitude from locationHelper
        latitude = locationHelper.latitude;
        longitude = locationHelper.longitude;

        // Find latitude and longitude input fields in the tagging form and update their values
        taggingLatitudeInput = document.querySelector('#lat');
        taggingLongitudeInput = document.querySelector('#long');
        if (taggingLatitudeInput && taggingLongitudeInput) {
            taggingLatitudeInput.value = latitude;
            taggingLongitudeInput.value = longitude;
        }

        // Find latitude and longitude hidden input fields in the discovery form and update their values
        discoveryLatitudeInput = document.querySelector('#discoveryLatitude');
        discoveryLongitudeInput = document.querySelector('#discoveryLongitude');
        if (discoveryLatitudeInput && discoveryLongitudeInput) {
            discoveryLatitudeInput.value = latitude;
            discoveryLongitudeInput.value = longitude;
        }
    
        mapManager = new MapManager();
        mapManager.initMap(latitude,longitude);
        mapManager.updateMarkers(latitude,longitude);

     // Find the <img> element by its id and remove it
        mapViewImg = document.getElementById('mapView');
        mapViewImg.remove();


    // Find the <p> element by its parent and remove it
        mapViewSpan = document.querySelector('.discovery__map span');
        mapViewSpan.remove();
    });
}        
// Call updateLocation automatically when the document is fully loaded
document.addEventListener("DOMContentLoaded", updateLocation);



// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    alert("TEST");
});