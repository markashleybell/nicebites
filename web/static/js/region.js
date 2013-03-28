$(function () {

    var clientPosition = {
        lat: '50.36833260763417',
        lng: '-4.140386894659514'
    };

    //_mapContainer = $('#map-container');

    // Proportionally resize the map when the window size changes
    // $(window).bind('resize', function (e) {
    //     _mapContainer.css({ height: (_mapContainer.width() / 3) });
    // });

    // $(window).trigger('resize');

    // Initially load the map centred on the region
    NiceBites.init('map');
    NiceBites.positionMap({
        position: clientPosition,
        zoom: 15,
        callback: function() { }
    });
    NiceBites.loadMarkers({
        position: clientPosition,
        zoom: 15,
        range: 5,
        regionId: 1,
        callback: function() {
            NiceBites.getClientPosition(function(pos) {
                clientPosition = pos;
                NiceBites.positionMap({
                    position: clientPosition,
                    zoom: 15,
                    callback: function() { }
                });
                NiceBites.loadMarkers({
                    position: pos,
                    zoom: 15,
                    range: 5,
                    regionId: 1,
                    callback: function() { 
                        var log = NiceBites.getLog();
                        for(var i=0; i<log.length; i++)
                            console.log(log[i]);
                    }
                });
            });
        }
    });
    
    // Bind the range buttons
    $('#distance-selector button').on('click', function(evt) {
        evt.preventDefault();
        var r = $(this).data('distance');

        NiceBites.loadMarkers({ 
            position: clientPosition, 
            zoom: 15,
            range: r,
            regionId: 1,
            callback: function() {
                console.log('Adjusted range to ' + r + 'km');
            }
        });
    });
});