from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from login.models import Users

class UserAdminCustomized(UserAdmin):
    list_display = ('username', 'email', 'is_active')
    list_filter = ('is_active',)

    fieldsets = (
        (None, {'fields': ('username', 'email','password')}),

        #('Permissions', {'fields': ('is_admin',)}),
    )

    search_fields =  ('username', 'email')
    ordering = ('username','email')

    filter_horizontal = ()


# Register your models here.
admin.site.register(Users, UserAdminCustomized)