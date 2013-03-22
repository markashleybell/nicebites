from django.http import HttpResponse
from django.template import Context, loader
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
        'establishments': establishments,
    })
    return HttpResponse(template.render(context))