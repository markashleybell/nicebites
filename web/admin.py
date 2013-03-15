from django.contrib.gis import admin
from web.models import Region, Establishment

class MyGeoAdmin(admin.OSMGeoAdmin):
	default_lat = 50.6036557562
	default_lon = -3.6030335153200213
	default_zoom = 18
	map_height = 200

admin.site.register(Region, MyGeoAdmin)
admin.site.register(Establishment, MyGeoAdmin)