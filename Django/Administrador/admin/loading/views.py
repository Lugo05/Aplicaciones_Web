from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
import pandas as pd
from loading.files import *
from login.backends import UserObjectView
from django.http import JsonResponse, HttpResponse
import json
import os

def json_body_decoder(method):
    def inner(func):
        def wrapper(request,*args,**kwargs):
            body = json.loads(request.body.decode("utf-8"))
            if method == "POST":
                request.POST = body;
            elif method == "PUT":
                request.PUT = body;
            return func(request);
        return wrapper;
    return inner; 


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

@login_required(login_url="/")
@require_http_methods(["POST"])
def validate_data(request):
    File.upload_file(request.FILES["file"])
    df = pd.read_excel("static/files/archivo.xlsx")
    file = File.detect_file(list(df.columns))
    if file is not None:
        data_invalid = file.validate(df)
        data = File.split_file(df,data_invalid);
        response = {
            "error":False,
            "data":data
        }
        return JsonResponse(response)
    else:
        response = {
            "error":True,
            "data": {
                "correct":[],
                "invalid":[]
            }
        }
        print("No se encontro archivo con encabezados ", list(df.columns))
        return JsonResponse(response)
           

@login_required(login_url="/")
@require_http_methods(["POST"])
@json_body_decoder("POST")
def download_excel(request):
    data = request.POST["data"];
    file_name = request.POST["fileName"];
    #data = request.POST["data"];
    file_path = 'static/files/%s.xlsx' % file_name;

    df = pd.DataFrame(data);
    df.to_excel(file_path, index = False);
    
    response = None
    with open(file_path, 'rb') as fh:
        response = HttpResponse(fh.read(), content_type="application/vnd.ms-excel")
        response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
        return response
    

@login_required(login_url="/")
@require_http_methods(["POST"])
@json_body_decoder("POST")
def upload_data(request):
    pass