import re
from django.core.validators import validate_email as validateEmail
from django.core.exceptions import ValidationError
from login.models import Nationality, Permission, Privilege, Profile
from loading.models import *
import pandas as pd

class ValidatorDB:

    nationalities = None
    permissions = None
    profiles = None
    validator_db = None    

    def __init__(self):
        if ValidatorDB.validator_db is not None:
            raise Exception("No puedes crear una instancia de este objeto. Utiliza get_instance()");
        self.set_nationalities()
        self.set_permissions()
        self.set_profiles()
        ValidatorDB.validator_db = self

    def set_nationalities(self):
        nationalities = Nationality.objects.all();
        self.nationalities = {}
        for nat in nationalities:
            self.nationalities[nat.name.upper()] = True
        #print(self.nationalities)
        self.nationalities = {"USA":True,"MEXICO":True}

    def set_permissions(self):
        self.permissions = {}
        permissions = Permission.objects.all()
        privileges = Privilege.objects.all()

        for permission in permissions:
            for privilege in privileges:
                self.permissions[permission.name.upper() + "_" + privilege.name.upper()]
        self.permissions = {"ALL_ALL":True, "USERS_ALL":True, "USERS_VIEW":True}

    def set_profiles(self):
        profiles = Profile.objects.all();
        self.profiles = {}
        for prof in profiles:
            self.profiles[prof.name.upper()] = True
        self.profiles = {"MANAGER":True,"STAFF":True, "CLIENT":True}

    @staticmethod
    def get_instance():
        if ValidatorDB.validator_db is not None: 
            return ValidatorDB.validator_db;
        return ValidatorDB()



class Validator:

    @staticmethod
    def is_null(value):
        return pd.isna(value) or value is None;

    @staticmethod
    def validate_action(**kwargs):
        value = kwargs["value"]
        if Validator.is_null(value):
            return True,""
        if str(value).upper() in ("ELIMINAR","INSERTAR","MODIFICAR"):
            return True,""
        return False, "Las operaciones validas son ELIMINAR,INSERTAR y MODIFICAR"

    @staticmethod
    def not_blank(**kwargs):
        value = kwargs["value"]
        action = kwargs["action"]
        name = kwargs["name"]

        if str(action).upper() == "INSERTAR":
            if Validator.is_null(value):
                return False, "El %s no debe ser nulo." % name;
            elif str(value).strip() == "":
                return False, "El %s no debe ser vacío." % name
            return True,""
        else:
            return True,""

    @staticmethod
    def validate_gender(**kwargs):
        value = kwargs["value"]
        action = kwargs["action"]

        if str(action).upper() == "ELIMINAR":
            return True, ""
        if Validator.is_null(value):
            return True, ""
        if str(value).upper() in ("M","F"):
            return True, ""
        return False, "El género debe ser o M o F"
        
    @staticmethod
    def validate_age(**kwargs):
        age = kwargs["value"]
        action = kwargs["action"]

        if str(action).upper() == "ELIMINAR":
            return True,""
        if Validator.is_null(age):
            return True, ""
        if not isinstance(age,int):
            return False, "La edad debe estar en un rango de 18 a 90"
        if 18 <= age <= 90:
            return True, ""
        return False,"La edad debe estar en un rango de 18 a 90"

    @staticmethod
    def validate_phone(**kwargs):
        phone = kwargs["value"]
        action = kwargs["action"]
        name = kwargs["name"]
        
        if str(action).upper() == "ELIMINAR":
            return True,""
        if Validator.is_null(phone):
            return True,""

        reg = "[+][0-9]{2}[-][0-9]{2}[-][0-9]{2}[-][0-9]{2}[-][0-9]{2}"
        pat = re.compile(reg)
        if not re.search(pat, phone):
            return False,"%s debe tener el formato +##-##-##-##-##" % name
        
        return True,""

    @staticmethod
    def validate_password(**kwargs):
        password = kwargs["value"]
        action = kwargs["action"]
        name = kwargs["name"]
        
        if str(action).upper() == "ELIMINAR":
            return True,""
        if Validator.is_null(password):
            return True,""
        if len(str(password)) < 8:
            return False,"La longitud de %s debe ser de al menos 8 caracteres." % name

        reg = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,40}$"
        pat = re.compile(reg)
        if not re.search(pat, password):
            return False,"%s debe tener al menos una mayuscula, minuscula, número y un caracter especial" % name
        
        return True,""

    @staticmethod
    def validate_email(**kwargs):
        email = kwargs["value"]
        action = kwargs["action"]
        name = kwargs["name"]

        if str(action).upper() == "ELIMINAR":
            return True,""
        if Validator.is_null(email):
            return True,""
        try:
            validateEmail(str(email))
            return True,""
        except ValidationError:
            return False, "Formato de correo invalido"

    @staticmethod
    def not_repeated(**kwargs):
        value = kwargs["value"]
        action = kwargs["action"]
        name = kwargs["name"]
        set_data = kwargs["set_data"]

        if str(action).upper() == "ELIMINAR":
            return True,""

        if Validator.is_null(value):
            return True, ""
        if str(value).upper() in set_data and set_data[str(value).upper()] > 1:
            return False, "%s con valor %s ya existe." % (name,value)
        else:
            return True, ""

    @staticmethod
    def validate_pk(value,set_data, action, **kwargs):
        return True,""
    
    @staticmethod
    def validate_nationality(**kwargs):
        nationality = kwargs["value"]
        action = kwargs["action"]

        if str(action).upper() == "ELIMINAR":
            return True,""
        if Validator.is_null(nationality):
            return True,""

        nats = ValidatorDB.get_instance().nationalities;
        if str(nationality).upper() in nats:
            return True,""
        else:
            return False, "La nacionalidad no esta entre las opciones disponibles."

    @staticmethod
    def validate_profile(**kwargs):
        profile = kwargs["value"]
        action = kwargs["action"]

        if str(action).upper() == "ELIMINAR":
            return True,""
        if Validator.is_null(profile):
            return True,""

        profiles = ValidatorDB.get_instance().profiles;
        if str(profile).upper() in profiles:
            return True,""
        else:
            return False, "El perfil no esta entre las opciones disponibles."

    @staticmethod
    def validate_permission(**kwargs):
        permissions = kwargs["value"]
        action = kwargs["action"]

        if str(action).upper() == "ELIMINAR":
            return True,""
        if Validator.is_null(permissions):
            return True,""

        permissions = permissions.split(",");

        db_permissions = ValidatorDB.get_instance().permissions;
        for perm in permissions:
            if str(perm).upper() in db_permissions:
                return True,""
            else:
                return False, "El permiso %s no esta entre las opciones disponibles." % perm

    

