from django.contrib.auth.backends import ModelBackend, BaseBackend
import json
from django.conf import settings
import sys,traceback
import hashlib 
from login.models import *
from pprint import pprint

class UserObjectView:
    def __init__(self,user,profile,permission):
        self.username = user;
        self.profile = profile
        self.permission = permission
    
    def __str__(self):
        return "Username: %s\nProfile: %s\nPermission: %s" % (self.username,self.profile,str(self.permission))

    @staticmethod
    def build(user):
        try:
            auth = {}
            APP = 0
            PERMISSION = 1
            PRIVILEGE = 2
            apps = user.profile.apps.values_list('name',flat=True)
            permissions = user.profile.permissions.values_list('name',flat=True)
            privileges = user.profile.privileges.values_list('name',flat=True)

            for iterator in zip(apps,permissions,privileges):
                if iterator[APP] == 'WEB':
                    if not iterator[PERMISSION] in auth: 
                        auth[ iterator[PERMISSION] ] = {}
                    auth[ iterator[PERMISSION] ][ iterator[PRIVILEGE] ] = True

            user_view = UserObjectView(user.username, user.profile.name, auth)
            return user_view
        except Exception as e:
            print(e)
            return None;


class UserBackend(BaseBackend):

    def authenticate(self, request, username=None, password=None):
        try:
            print(password)
            password = hashlib.sha1(password.encode()).hexdigest()
            print(password)
            print(username)
            user = Users.objects.get(username = username, password = password)
            print(user.id)
            return user
        except:
            traceback.print_exception(*sys.exc_info())
            return None

    def get_user(self, user_id):    
        try:
            user = Users.objects.get(pk=user_id)
            return user
        except Exception as e:
            print(e)
            return None