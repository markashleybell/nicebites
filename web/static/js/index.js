$(function () {

    var clientPosition = {
        lat: '54.142667423078684',
        lng: '-2.8559632028200213'
    };

    // Proportionally resize the map when the window size changes
    // $(window).bind('resize', function (e) {
    //     _mapContainer.css({ height: (_mapContainer.width() / 3) });
    // });

    // $(window).trigger('resize');

    // Initially load the map centred on the region
    NiceBites.init('map', clientPosition, 7);
    
    // Bind the range buttons
    $('#distance-selector button').on('click', function(evt) {
        evt.preventDefault();
        var r = $(this).data('distance');

        NiceBites.loadMarkers({ 
            range: r,
            regionId: 1,
            callback: function() {
                console.log('Adjusted range to ' + r + 'km');
            }
        });
    });
});