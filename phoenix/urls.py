from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url('', include('phoenix.ui.urls', namespace='ui', app_name='ui')),
    url(r'^admin/', include(admin.site.urls)),
)
