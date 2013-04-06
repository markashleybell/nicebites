// Global application module
var NiceBites = (function() {
    // Private reference to the map
    var _map = null;
    // OpenMapQuest tile details
    var _subDomains = ['otile1','otile2','otile3','otile4'];
    var _tileUrl = 'http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
    var _attrib = 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, ' +
                  '<a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, ' + 
                  '<a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';
    // MapBox tile details
    // var _subDomains = ['a','b','c','d'];
    // var _tileUrl = 'http://{s}.tiles.mapbox.com/v3/markashleybell.map-saq6rwjg/{z}/{x}/{y}.png';
    // var _attrib = 'Data, imagery and map information provided by <a href="http://mapbox.com/" target="_blank">MapBox</a>';
    // Tile layer
    var _tiles = null;
    // Array of markers currently displayed on the map
    var _markers = [];
    // 'You are here' marker
    var _positionMarker = null;
    // Array to hold logging messages
    var _log = [];
    // Current client position
    var _currentPosition = null;
    // Try and set the client's current geographic position 
    var _trySetClientPosition = function(callback) {
        // Check for geolocation support
        if (navigator.geolocation) {
            // Try and get the current geographic position of the client
            navigator.geolocation.getCurrentPosition(function(position){
                _currentPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                _log.push('Retrieved position: [' + _currentPosition.lat + ',' + _currentPosition.lng + ']');
                callback(_currentPosition);
            }, function(error) {
                var errors = { 
                    1: 'Permission denied',
                    2: 'Position unavailable',
                    3: 'Request timeout'
                };
                _log.push('Error: ' + errors[error.code]);
                callback(_currentPosition);
            }, { 
                enableHighAccuracy: true, 
                timeout: 10 * 1000, // 10 seconds
                // maximumAge: 10 * 1000 * 60 // 10 minutes
                maximumAge: 0 // Force location retrieval every time
            });
        } else {
            _log.push('Geolocation is not supported by this browser');
        }
    };
    // Create a marker icon
    var _createIcon = function(colour) {
        return new L.Icon({
            iconUrl: '/static/img/marker-icon' + ((typeof colour === 'undefined') ? '' : '-' + colour) + '.png',
            iconSize: new L.Point(25, 41),
            iconAnchor: new L.Point(12, 41),
            popupAnchor: new L.Point(1, -34),
            shadowUrl: '/static/img/marker-shadow.png',
            shadowSize: new L.Point(41, 41)
        });
    };
    return {
        // Return the log for further processing
        log: (function() {
            return _log;
        }()),
        setLocationMarker: function(position) {
            // Remove the existing position marker if there is one
            if(_positionMarker !== null)
                _map.removeLayer(_positionMarker);
            // Create a marker representing the client's current position and add it to the map
            _positionMarker = new L.Marker(new L.LatLng(position.lat, position.lng), { 
                icon: _createIcon('red') 
            });
            _positionMarker.bindPopup('<h1>YOU ARE HERE</h1>');
            _map.addLayer(_positionMarker);
        },
        // Centre the map and place the 'you are here' marker
        positionMap: function(position, zoom) {
            _map.setView([position.lat, position.lng], zoom);            
            _log.push('Map position set');
        },
        loadMarkers: function(options) {
            // Remove all the previous markers
            // TODO: This can be more efficient if we initially add markers to a layer group
            // See http://leafletjs.com/examples/layers-control.html
            for(var i=0; i<_markers.length; i++)
                _map.removeLayer(_markers[i]);
            // Build URL to call API method
            var ajaxUrl = '/region/' + options.regionId + '?lng=' + _currentPosition.lng + 
                          '&lat=' + _currentPosition.lat + '&distance=' + options.range;
            // Request the establishment data
            $.ajax({
                url: ajaxUrl,
                dataType: 'json',
                success: function (data, status, request) {
                    // Add a marker for each returned establishment
                    $.each(data, function(i, item) {
                        var position = new L.LatLng(item.lat, item.lng);
                        var marker = new L.Marker(position, { icon: _createIcon() });
                        marker.bindPopup('<h1>' + item.name + '</h1>' + item.postcode);
                        _map.addLayer(marker);
                        _markers.push(marker);
                    });
                    _log.push('Marker positions loaded');
                    // If there was a callback specified, call it
                    if(typeof options.callback === 'function')
                        options.callback();
                },
                error: function (request, status, error) { 
                    _log.push('Error loading marker JSON: ' + error);
                }
            });
        },
        // Initialise the map and tiles
        init: function(mapDiv, fallbackPosition, zoom) {
            _map = L.map(mapDiv);
            _tiles = new L.TileLayer(_tileUrl, { 
                minZoom: 7, 
                maxZoom: 18, 
                attribution: _attrib, 
                subdomains: _subDomains 
            });
            _map.addLayer(_tiles);
            _log.push('Map initialised');
            // Set current position to fallback co-ordinates 
            // in case geolocation fails or isn't supported
            _currentPosition = fallbackPosition;
            NiceBites.positionMap(_currentPosition, zoom);
            _trySetClientPosition(function(position) { 
                NiceBites.setLocationMarker(position);
                NiceBites.positionMap(position, zoom);
                // Load markers near position
                NiceBites.loadMarkers({ 
                    range: 5,
                    regionId: 1,
                    callback: function() {
                        var log = NiceBites.log;
                        for(var i=0; i<log.length; i++)
                            console.log(log[i]);
                    }
                });
            });
        }
    }

}());