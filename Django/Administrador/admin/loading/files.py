from loading.validators import Validator
import pandas as pd

class Column:
    def __init__(self,name,type_data ,validators = None):
        self.type = type_data
        self.name = name
        self.validators = validators

class File:
    @staticmethod
    def validate_type(RefClass, data, data_invalid):
        for column in RefClass.list_columns:
            type_data = getattr(RefClass,column).type
            header = getattr(RefClass, column).name
            for i in data[header].index:
                value = data[header][i]
                if not Validator.is_null(value) and not isinstance(value, type_data):
                    if not i in data_invalid:
                        data_invalid[i] = []
                    data_invalid[i].append("%s error de tipo de dato" % header)

        return data_invalid;

    
    @staticmethod
    def apply_validators(RefClass, data, data_invalid):
        data_json = File.to_json(RefClass, data);

        for column in RefClass.list_columns:
            validators = getattr(RefClass, column).validators;
            header = getattr(RefClass, column).name
            for validator in validators:
                for i in data[header].index:
                    valid, message = validator(value=data[header][i], set_data=data_json[header], action=data['accion'][i], name=header) 
                    if not valid:
                        if not i in data_invalid:
                            data_invalid[i] = []
                        data_invalid[i].append(message)
        return data_invalid
                

    @staticmethod
    def get_headers(RefClass):
        headers = {getattr(RefClass, x).name : True  for x in RefClass.list_columns}
        return headers

    @staticmethod
    def to_json(RefClass,data):
        headers = File.get_headers(RefClass);
        json = {}
        for header in headers:
            json[header] = {}
            for i in data[header].index:
                value  = data[header][i]
                if not Validator.is_null(value):
                    if not str(value).upper() in json[header]:
                        json[header][str(value).upper()] = 0
                    json[header][str(value).upper()] += 1
        return json 

    @staticmethod
    def validate(RefClass,data):
       data_invalid = {}
       data_invalid = File.validate_type(RefClass, data, data_invalid);
       data_invalid = File.apply_validators(RefClass, data, data_invalid);
       return data_invalid;
       
            
class User:
    users = Column("usuario",str, validators = [Validator.not_blank, Validator.not_repeated])
    name = Column("nombre",str, validators = [Validator.not_blank])
    phone = Column("telefono",str, validators = [Validator.validate_phone])
    email = Column("correo",str, validators = [Validator.not_blank, Validator.not_repeated, Validator.validate_email])
    age = Column("edad",int, validators = [Validator.validate_age])
    gender = Column("genero",str, validators = [Validator.validate_gender])
    nationality = Column("nacionalidad",str, validators = [Validator.validate_nationality])
    password = Column("clave",str, validators = [Validator.not_blank, Validator.validate_password])
    profile = Column("perfil",str, validators = [Validator.not_blank, Validator.validate_profile])
    permissions = Column("permisos",list, validators = [Validator.validate_permission])
    action = Column("accion",str, validators = [Validator.validate_action])

    list_columns = ["users","name","phone","email","age","gender","nationality","password","profile","permissions","action"]

    @staticmethod
    def validate(data):
        return File.validate(User,data)


class Stock:
    name = Column("nombre",str, validators = [Validator.not_blank])
    code = Column("codigo",str, validators = [Validator.not_blank, Validator.not_repeated])
    branch = Column("sucursal", str, validators = [])
    quantity = Column("cantidad", int, validators = [])
    action = Column("accion",str, validators = [Validator.validate_action])

    list_columns = ["name","code","branch","quantity","action"]

    @staticmethod
    def validate(data):
        File.validate(Stock,data);
    


def _get_files():
    files = {
        "users": {
            "headers": File.get_headers(User),
            "file": User
        },
        "stock": {
            "headers": File.get_headers(Stock),
            "file": Stock
        }
    }
    return files;

def detect_file(headers):
    files = _get_files();
    for name_file, data in files.items():
        match_columns = list( filter( lambda x : x.lower() in data["headers"] , headers ))
        if len(match_columns) == len(data["headers"]):
            return data["file"]
    return None
        