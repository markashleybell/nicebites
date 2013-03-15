from django.contrib.gis.db import models

class Region(models.Model):
	def __unicode__(self):
		return self.name
	name = models.CharField(max_length=128)
	slug = models.CharField(max_length=256)
	objects = models.GeoManager()

class Establishment(models.Model):
	def __unicode__(self):
		return self.name
	region = models.ForeignKey(Region)
	name = models.CharField(max_length=128)
	slug = models.CharField(max_length=256)
	description = models.TextField()
	address = models.CharField(max_length=256)
	postcode = models.CharField(max_length=10)
	telephone = models.CharField(max_length=20, null=True, blank=True)
	email = models.CharField(max_length=256, null=True, blank=True)
	web = models.CharField(max_length=256, null=True, blank=True)
	lon = models.CharField(max_length=128)
	lat = models.CharField(max_length=128)
	location = models.PointField(srid=4326)
	objects = models.GeoManager()