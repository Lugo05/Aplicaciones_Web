from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.contrib import admin
from django.contrib.auth import authenticate, login, logout
import json
import sys,traceback
from django.conf import settings
from login.backends import UserObjectView

@csrf_exempt
def index(request):
    data = {
        "section":"",
        "session":{}
    }
    page = "login.html"
    if request.method == 'POST':
        try:
            if not request.user.is_authenticated:
                username = request.POST["username"]
                password = request.POST["password"]
                user = authenticate(request, username=username, password=password)
                if user != None:
                    print(user)
                    user_view = UserObjectView.build(user)
                    data["session"]["username"] = user_view.username
                    data["session"]["profile"] = user_view.profile
                    data["session"]["permissions"] = user_view.permission
                    login(request,user)
                    data["section"] = 'home.html'
                    page = "index.html"
        except:
            traceback.print_exception(*sys.exc_info())
            return logout_view(request)
    else:
        if request.user.is_authenticated:
            user_view = UserObjectView.build(request.user)
            data["session"]["username"] = user_view.username
            data["session"]["profile"] = user_view.profile
            data["session"]["permissions"] = user_view.permission
            data["section"] = 'home.html'
            page = "index.html"

    return render(request, page ,data)

@csrf_exempt
def logout_view(request):
    logout(request)
    return index(request)
