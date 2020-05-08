from django.db import models
from login.validators import validate_password
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class Catalog(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    active   = models.BooleanField(default=True)
    updated_at  = models.DateTimeField(auto_now=True,)
    created_at  = models.DateTimeField(auto_now_add=True) 

    class Meta: 
        abstract = True

    def __str__(self):
        return str(self.name)


class Nationality(Catalog):
    class Meta:
        ordering = ["id"]
        db_table = "nationality"
        verbose_name_plural = "Nationalities"


class Profile(Catalog):
    permissions = models.ManyToManyField('Permission',through= 'PermissionProfile')
    apps = models.ManyToManyField('App',through= 'PermissionProfile')
    privileges = models.ManyToManyField('Privilege',through= 'PermissionProfile')
    class Meta:
        ordering = ["-name", "-id"]
        verbose_name_plural = "Profiles"
        db_table = "profile"

class Permission(Catalog):
    privileges = models.ManyToManyField('Privilege',through= 'PermissionProfile')
    profiles = models.ManyToManyField('Profile',through= 'PermissionProfile')
    apps = models.ManyToManyField('App',through= 'PermissionProfile')
    class Meta:
        ordering = ["-name", "-id"]
        verbose_name_plural = "Permissions"
        db_table = "permission"


class Privilege(Catalog):
    permissions = models.ManyToManyField('Permission',through= 'PermissionProfile')
    apps = models.ManyToManyField('App',through= 'PermissionProfile')
    profiles = models.ManyToManyField('Profile',through= 'PermissionProfile')
    class Meta:
        ordering = ["-name", "-id"]
        verbose_name_plural = "Privileges"
        db_table = "privilege"
        

class App(Catalog):
    #permissions = models.ManyToManyField('Permission',through= 'PermissionProfile',through_fields=('privileges', 'apps'))
    profiles = models.ManyToManyField('Profile',through= 'PermissionProfile')
    #privileges = models.ManyToManyField('Privilege',through= 'PermissionProfile',through_fields=('privileges', 'apps'))
    class Meta:
        ordering = ["-name", "-id"]
        verbose_name_plural = "Apps"
        db_table = "app"


class PermissionProfile(models.Model):
    profiles = models.ForeignKey(Profile, on_delete=models.CASCADE, db_column="id_profile")
    permissions = models.ForeignKey(Permission, on_delete=models.CASCADE, db_column="id_permission")
    apps = models.ForeignKey(App, on_delete=models.CASCADE, db_column= "id_app")
    privileges = models.ForeignKey(Privilege, on_delete=models.CASCADE, db_column="id_privilege")
    active   = models.BooleanField(default=True)

    class Meta:
        ordering = ["profiles", "-id"]
        verbose_name_plural = "Permissions per Profile"
        db_table = "permission_profile"
        unique_together = (('profiles', 'permissions','privileges','apps'),)



class UserManager(BaseUserManager):
    def create_user(self,username,email,password=None, **extra_fields):
        user=self.model(
            username=username.lower(),
            email=self.normalize_email(email),
            **extra_fields
        )
        password = validate_password(password)
        user.password = password
        user.save(using=self._db)
        return user

    def create_superuser(self,username,email,password=None, **extra_fields):
        user = self.model(
            username=username.lower(),
            email=self.normalize_email(email),
            **extra_fields
        )
        profile = Profile.objects.get(name="SUPERUSER");
        user.profile = profile
        password = validate_password(password)
        user.password = password
        user.save(using=self._db)
        return user


class Users(AbstractBaseUser):
    id       = models.AutoField(null=False, primary_key=True)
    username = models.CharField(max_length=50, null=False, unique=True, blank=False)
    name     = models.CharField(max_length=255, null=False, blank=False)
    age      = models.IntegerField(null=True, blank=True)
    email    = models.EmailField(max_length=100, unique=True)
    gender   = models.CharField(max_length=1, null = True)
    phone    = models.CharField(max_length=50, null=True, unique=True)
    password = models.CharField(max_length=50, validators=[validate_password])

    is_active   = models.BooleanField(default=True, db_column="active")
    updated_at  = models.DateTimeField(auto_now=True)
    created_at  = models.DateTimeField(auto_now_add=True) 

    nationality = models.OneToOneField(to=Nationality, on_delete=models.CASCADE, db_column="id_nationality", null=True)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, db_column="id_profile", null=True)  
    last_login = models.DateTimeField(auto_now=True)

    objects = UserManager()
    #ignore
    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'

    class Meta:
        ordering = ["-username", "-id"]
        verbose_name_plural = "Users"
        db_table = "users"

    def __str__(self):
        return str(self.username)

