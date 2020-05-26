from django.test import TestCase
from loading.validators import Validator

# Create your tests here.
class TestValidator(TestCase):
    def setUp(self):
        pass

    def test_validate_not_blank(self):
        matrix = [
            {"value":"", "accion":"INSERTAR", "expected":False},
            {"value":"     ", "accion":"INSERTAR", "expected":False},
            {"value":"hola", "accion":"INSERTAR", "expected":True},
            {"value":"hjsjhdshjs", "accion":"INSERTAR", "expected":True},
            {"value":None, "accion":"INSERTAR", "expected": False},
            {"value":12, "accion":"INSERTAR", "expected": True},
            {"value":None, "accion":"MODIFICAR", "expected": True},
            {"value":"", "accion":"ELIMINAR", "expected": True}
        ]
        print("\nTesting not_blank")
        for test in matrix:
            valid_got, message = Validator.not_blank(value=test["value"], action=test["accion"], name="Ejemplo", set=None);
            print("Testing ", test["value"])
            self.assertEquals(valid_got, test["expected"])

    def test_validate_age(self):
        matrix = [
            {"value":17, "accion":"INSERTAR", "expected":False},
            {"value":18, "accion":"INSERTAR", "expected":True},
            {"value":90, "accion":"INSERTAR", "expected":True},
            {"value":91, "accion":"INSERTAR", "expected": False},
            {"value":45, "accion":"INSERTAR", "expected": True},
            {"value":1, "accion":"MODIFICAR", "expected": False},
            {"value":45, "accion":"MODIFICAR", "expected": True},
            {"value":91, "accion":"ELIMINAR", "expected": True}
        ]
        print("\nTesting validate_age")
        for test in matrix:
            valid_got, message = Validator.validate_age(value=test["value"], action=test["accion"], name="Ejemplo", set=None);
            print("Testing ", test["value"])
            self.assertEquals(valid_got, test["expected"])


    def test_validate_action(self):
        matrix = [
            {"value":"INSERTAR", "expected":True},
            {"value":"MODIFICAR", "expected": True},
            {"value":"ELIMINAR", "expected": True},
            {"value":"AGREGAR", "expected": False},
            {"value":"OTRO", "expected": False},
            {"value":None, "expected": True}
        ]
        print("\nTesting validate_action")
        for test in matrix:
            valid_got, message = Validator.validate_action(value=test["value"], action="", name="", set=None);
            print("Testing ", test["value"])
            self.assertEquals(valid_got, test["expected"])


    def test_validate_gender(self):
        matrix = [
            {"value":"A", "accion":"INSERTAR", "expected":False},
            {"value":"M", "accion":"INSERTAR", "expected":True},
            {"value":"F", "accion":"INSERTAR", "expected":True},
            {"value":"", "accion":"INSERTAR", "expected": False},
            {"value":"M", "accion":"MODIFICAR", "expected": True},
            {"value":"F", "accion":"MODIFICAR", "expected": True},
            {"value":"A", "accion":"MODIFICAR", "expected": False},
            {"value":"A", "accion":"ELIMINAR", "expected": True},
            {"value":None, "accion":"INSERTAR", "expected": True}
        ]
        print("\nTesting validate_gender")
        for test in matrix:
            valid_got, message = Validator.validate_gender(value=test["value"], action=test["accion"], name="", set=None);
            print("Testing ", test["value"])
            self.assertEquals(valid_got, test["expected"])

    def test_validate_password(self):
        matrix = [
            {"value":"123456", "accion":"INSERTAR", "expected":False},
            {"value":"1234456Ja", "accion":"INSERTAR", "expected":False},
            {"value":"123456Ab#", "accion":"INSERTAR", "expected":True},
            {"value":None, "accion":"INSERTAR", "expected": True},
            {"value":None, "accion":"MODIFICAR", "expected": True},
            {"value":"123456", "accion":"MODIFICAR", "expected":False},
            {"value":"1234456Ja", "accion":"MODIFICAR", "expected":False},
            {"value":"123456Ab#", "accion":"MODIFICAR", "expected":True},
            {"value":"12345", "accion":"ELIMINAR", "expected": True},
        ]
        print("\nTesting validate_password")
        for test in matrix:
            valid_got, message = Validator.validate_password(value=test["value"], action=test["accion"], name="clave", set=None);
            print("Testing ", test["value"])
            self.assertEquals(valid_got, test["expected"])

    
    def test_validate_email(self):
        matrix = [
            {"value":"ankitrai326@gmail.com", "accion":"INSERTAR", "expected":True},
            {"value":"my.ownsite@ourearth.org", "accion":"INSERTAR", "expected":True},
            {"value":"onsite.com", "accion":"INSERTAR", "expected":False},
            {"value":None, "accion":"INSERTAR", "expected": True},
            {"value":None, "accion":"MODIFICAR", "expected": True},
            {"value":"ankitrai326@gmail.com", "accion":"MODIFICAR", "expected":True},
            {"value":"my.ownsite@ourearth.org", "accion":"MODIFICAR", "expected":True},
            {"value":"onsite.com", "accion":"MODIFICAR", "expected":False},
            {"value":"12345", "accion":"ELIMINAR", "expected": True},
        ]
        print("\nTesting validate_email")
        for test in matrix:
            valid_got, message = Validator.validate_email(value=test["value"], action=test["accion"], name="clave", set=None);
            print("Testing ", test["value"])
            self.assertEquals(valid_got, test["expected"])

    def test_validate_phone(self):
        matrix = [
            {"value":"55-11-61-93", "accion":"INSERTAR", "expected":False},
            {"value":"55116193", "accion":"INSERTAR", "expected":False},
            {"value":"+52-58-12-51-23", "accion":"INSERTAR", "expected":True},
            {"value":None, "accion":"INSERTAR", "expected": True},
            {"value":None, "accion":"MODIFICAR", "expected": True},
            {"value":"55-11-61-93", "accion":"MODIFICAR", "expected":False},
            {"value":"55116193", "accion":"MODIFICAR", "expected":False},
            {"value":"+52-58-12-51-23", "accion":"MODIFICAR", "expected":True},
            {"value":"12345", "accion":"ELIMINAR", "expected": True},
        ]
        print("\nTesting validate_phone")
        for test in matrix:
            valid_got, message = Validator.validate_phone(value=test["value"], action=test["accion"], name="clave", set=None);
            print("Testing ", test["value"])
            self.assertEquals(valid_got, test["expected"])


    def test_validate_nationality(self):
        matrix = [
            {"value":"MEXICO", "accion":"INSERTAR", "expected":True},
            {"value":"USA", "accion":"INSERTAR", "expected":True},
            {"value":"CALIFORNIA", "accion":"INSERTAR", "expected":False},
            {"value":None, "accion":"INSERTAR", "expected": True},
            {"value":None, "accion":"MODIFICAR", "expected": True},
            {"value":"MEXICO", "accion":"MODIFICAR", "expected":True},
            {"value":"USA", "accion":"MODIFICAR", "expected":True},
            {"value":"CALIFORNIA", "accion":"MODIFICAR", "expected":False},
            {"value":"CALIFORNIA", "accion":"ELIMINAR", "expected": True},
        ]
        print("\nTesting validate_nationality")
        for test in matrix:
            valid_got, message = Validator.validate_nationality(value=test["value"], action=test["accion"], name="clave", set=None);
            print("Testing ", test["value"])
            self.assertEquals(valid_got, test["expected"])


    def test_validate_profile(self):
        matrix = [
            {"value":"manager", "accion":"INSERTAR", "expected":True},
            {"value":"staff", "accion":"INSERTAR", "expected":True},
            {"value":"otro", "accion":"INSERTAR", "expected":False},
            {"value":None, "accion":"INSERTAR", "expected": True},
            {"value":None, "accion":"MODIFICAR", "expected": True},
            {"value":"CLIENT", "accion":"MODIFICAR", "expected":True},
            {"value":"MANAGER", "accion":"MODIFICAR", "expected":True},
            {"value":"OTRO", "accion":"MODIFICAR", "expected":False},
            {"value":"OTRO", "accion":"ELIMINAR", "expected": True},
        ]
        print("\nTesting validate_profile")
        for test in matrix:
            valid_got, message = Validator.validate_profile(value=test["value"], action=test["accion"], name="clave", set=None);
            print("Testing ", test["value"])
            self.assertEquals(valid_got, test["expected"])
    
    def test_validate_permissions(self):
        matrix = [
            {"value":"ALL_ALL", "accion":"INSERTAR", "expected":True},
            {"value":"USERS_VIEW,users_all", "accion":"INSERTAR", "expected":True},
            {"value":"ALL_VIEW", "accion":"INSERTAR", "expected":False},
            {"value":None, "accion":"INSERTAR", "expected": True},
            {"value":None, "accion":"MODIFICAR", "expected": True},
            {"value":"ALL_ALL", "accion":"MODIFICAR", "expected":True},
            {"value":"USERS_VIEW,users_all", "accion":"MODIFICAR", "expected":True},
            {"value":"USERS_CREATE", "accion":"MODIFICAR", "expected":False},
            {"value":"users_CREATE,users_EDIT", "accion":"ELIMINAR", "expected": True},
        ]
        print("\nTesting validate_permissions")
        for test in matrix:
            valid_got, message = Validator.validate_permission(value=test["value"], action=test["accion"], name="clave", set=None);
            print("Testing ", test["value"])
            self.assertEquals(valid_got, test["expected"])
    
    def test_not_repeated(self):
        matrix = [
            {"value":"user1", "accion":"INSERTAR", "expected":True},
            {"value":"user2", "accion":"INSERTAR", "expected":True},
            {"value":"user4", "accion":"INSERTAR", "expected":False},
            {"value":None, "accion":"INSERTAR", "expected": True},
            {"value":None, "accion":"MODIFICAR", "expected": True},
            {"value":"user1", "accion":"MODIFICAR", "expected":True},
            {"value":"user3", "accion":"MODIFICAR", "expected":True},
            {"value":"user5", "accion":"MODIFICAR", "expected":False},
            {"value":"user5", "accion":"ELIMINAR", "expected": True},
        ]

        set_data = { "USER1": 1, "USER2":1, "USER3":1, "USER4":2,"USER5":3 }
        print("\nTesting not_repeated")
        for test in matrix:
            valid_got, message = Validator.not_repeated(value=test["value"], action=test["accion"], name="usuario", set_data=set_data);
            print("Testing ", test["value"])
            self.assertEquals(valid_got, test["expected"])
