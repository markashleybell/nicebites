from django.http import HttpResponse
from django.template import Context, loader
from django.utils.simplejson import dumps, loads, JSONEncoder
from django.core import serializers
from django.contrib.gis.geos import fromstr
from django.contrib.gis.measure import D
from web.models import Establishment, Region
    
def index(request):
    template = loader.get_template('web/index.html')
    context = Context({
        'text': 'WOOOOO',
    })
    return HttpResponse(template.render(context))

def region(request, slug):
    establishments = Establishment.objects.filter(region__slug__exact=slug)
    template = loader.get_template('web/region.html')
    context = Context({
        'region': establishments[0].region,
        'establishments': establishments
    })
    return HttpResponse(template.render(context))

def region_json(request, id):
    lat = request.GET.get('lat')
    lng = request.GET.get('lng')
    distance = float(request.GET.get('distance'))
    point = fromstr('POINT(' + lng + '  ' + lat + ')', srid=4326)
    establishments = Establishment.objects.filter(region__id__exact=id, location__distance_lte=(point, D(km=distance)))
    #return HttpResponse(Establishment.objects.filter(region__id__exact=id, location__distance_lte=(point, D(km=distance))).query.__str__())
    subs = [{ 'name': e.name, 'lng': e.location.x, 'lat': e.location.y, 'postcode': e.postcode } for e in establishments]
    # return HttpResponse(subs)
    # return HttpResponse(serializers.serialize("json", subs), content_type="application/json")
    return HttpResponse(dumps(subs), content_type="application/json")

def nearest_region_json(request):
    lat = request.GET.get('lat')
    lng = request.GET.get('lng')
    point = fromstr('POINT(' + lng + '  ' + lat + ')', srid=4326)
    region = Establishment.objects.distance(point).order_by('-distance')[0].region
    return HttpResponse(dumps({ 'id': region.id, 'name': region.name, 'slug': region.slug }), content_type="application/json")