from django.conf.urls import url
from login.views import *

urlpatterns = [
    url(r'^$', index, name='login'),
    url(r'^logout/$',logout_view, name='logout'),
]