from django.conf.urls import url
from loading.views import *

urlpatterns = [
    url(r'/validate/',validate_data, name='validate_data'),
    url(r'/upload/', upload_data, name='upload_data'),
    url(r'/download/', download_excel, name="download_excel"),
    url(r'/', massive_view, name='massive_view'),
]