from django.conf.urls import patterns, include, url
import settings
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'web.views.index', name='index'),
    # Favicon
    # url(r'^favicon\.ico$', 'django.views.generic.simple.redirect_to', {'url': '/static/favicon.ico'}),
    # Hard-code the static file paths because otherwise our catch-all route breaks them
    url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    # Route which returns JSON establishment data
	url(r'^region/nearest', 'web.views.nearest_region_json', name='nearest_region_json'),
    url(r'^region/(?P<id>\d+)', 'web.views.region_json', name='region_json'),
    # Catch-all route for region folder e.g http://nicebites.in/plymouth
    url(r'^(?P<slug>.*)', 'web.views.region', name='region'),
)
