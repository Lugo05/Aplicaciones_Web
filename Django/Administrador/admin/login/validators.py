import re
import hashlib
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def validate_password(password):
    if len(password) < 8:
        raise ValidationError("La longitud de la contraseña debe ser de al menos 8 caracteres.")

    reg = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,40}$"
    pat = re.compile(reg)
    if not re.search(pat, password):
        raise ValidationError("La contraseña debe tener al menos una mayuscula, minuscula, número y un caracter especial")

    return hashlib.sha1(password.encode()).hexdigest()


def validate_foreign_key_nested(foreign_key,name):
    if foreign_key != None:
        if not (isinstance(foreign_key,dict) and "id" in foreign_key) :
            error = {} 
            error[name] = ["Incorrect type. Expected dict value with id key, received %s" % str(type(foreign_key))]
            return False,None, error;
        else:
            return True, foreign_key["id"], None
    return True, foreign_key , None
    
