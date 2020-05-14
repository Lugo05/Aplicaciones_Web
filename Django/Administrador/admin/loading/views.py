from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
import pandas as pd
from loading.files import *
from login.backends import UserObjectView

@login_required(login_url='/')
@require_http_methods(["GET"])
def massive_view(request):
    data = {
        "section":"",
        "session":{}
    }
    user_view = UserObjectView.build(request.user)
    data["session"]["username"] = user_view.username
    data["session"]["profile"] = user_view.profile
    data["session"]["permissions"] = user_view.permission
    data["section"] = 'massive'
    page = "index.html"
    
    return render(request, page, data)

@login_required
@require_http_methods(["POST"])
def validate_data(request):
    File.upload_file(request.FILES["file"])
    df = pd.read_excel("static/files/archivo.xlsx")
    file = File.detect_file(list(df.columns))
    if file is not None:
        data_invalid = file.validate(df)
        print(data_invalid)
    else:
        print("No se encontro archivo con encabezados ", list(df.columns))
           

@login_required
@require_http_methods(["POST"])
def upload_data(request):
    pass