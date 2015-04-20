from django.conf.urls import *

urlpatterns = patterns('phoenix.ui.views',
    url('^$', 'index', name='index'),
)
