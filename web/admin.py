from django.contrib.gis import admin
from web.models import Region, Establishment

class LeafletGeoPointAdmin(admin.GeoModelAdmin):
	default_lat = '50.6036557562'
	default_lon = '-3.6030335153200213'
	default_zoom = 5
	map_width = 800
	map_height = 300
	map_template = 'gis/admin/leaflet.html'
	display_wkt = True
	# extra_js = "http://cdn.leafletjs.com/leaflet-0.5/leaflet.js" # Doesn't work
	class Media:
		css = {
			"all": ("http://cdn.leafletjs.com/leaflet-0.5/leaflet.css",)
		}
        # js = ("http://cdn.leafletjs.com/leaflet-0.5/leaflet.js",) # Doesn't work

class EstablishmentAdmin(LeafletGeoPointAdmin):
	prepopulated_fields = {"slug": ("name",)}

admin.site.register(Region, LeafletGeoPointAdmin)
admin.site.register(Establishment, EstablishmentAdmin)