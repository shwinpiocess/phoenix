from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url('', include('phoenix.ui.urls', namespace='ui', app_name='ui')),
    url('^api/', include('phoenix.api.urls', namespace='api', app_name='api')),
    url(r'^admin/', include(admin.site.urls)),
)
