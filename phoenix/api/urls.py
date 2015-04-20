from django.conf.urls import include, patterns, url as original_url

def url(regex, view, kwargs=None, name=None, prefix=''):
    if isinstance(view, basestring) and name is None:
        name = view
    return original_url(regex, view, kwargs, name, prefix)

v1_urls = patterns('phoenix.api.views',
    url('^$', 'api_v1_root_view'),
    url('^authtoken/$', 'auth_token_view'),
)

urlpatterns = patterns('phoenix.api.views',
    url('^$', 'api_root_view'),
    url('^v1/', include(v1_urls)),
)

