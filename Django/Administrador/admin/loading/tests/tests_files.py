from django.test import TestCase
from loading.files import *
import pandas as pd

class TestFiles(TestCase):

    def setUp(self):
        self.df = pd.read_excel("static/files/archivo_test.xlsx")
        self.headers = list(self.df.columns)


    def test_detec_file(self):
        matrix = [
            {
                "value": ["Nombre","Usuario","CLAVE","Perfil","Nacionalidad","PermisoS","Telefono","Correo","Edad","Genero","acCion"],
                "expected": User
            },
            {
                "value": ["Usuario","Clave","Perfil","Nacionalidad","Permisos","Telefono","Correo","Edad","Genero","acCion"],
                "expected": None
            },
            {
                "value": ["Codigo","Nombre","Perfil","SUCURSAL","cantidaD","accion"],
                "expected": Stock
            },
            {
                "value": ["Otro","acCion"],
                "expected": None
            }
        ];
        print("\nTesting detect_file")
        for test in matrix:
            print("Testing", test["value"])
            file_got = detect_file(test["value"])
            self.assertEquals( file_got, test["expected"] )


    def test_get_headers(self):
        matrix = [
            {
                "value":User,
                "expected": {
                    "nombre": True, "usuario": True, "clave":True, "perfil":True,"nacionalidad":True,
                    "permisos":True, "telefono":True, "correo":True, "edad":True, "genero":True,"accion":True
                }
            },
            {
                "value":Stock,
                "expected": {
                    "codigo":True, "nombre":True,"sucursal":True,"cantidad":True, "accion":True
                }
            }
        ]
        print("\nTesting get_headers")
        for test in matrix:
            print("Testing", test["value"])
            headers_got = File.get_headers(test["value"])
            self.assertEquals( headers_got, test["expected"] )
   

    def test_validate_type(self):
        print("\nTesting validate_type")
        file = detect_file(self.headers)
        data_invalid = File.validate_type(file,self.df,{})

        value_expected = {
            6: [
                'usuario error de tipo de dato', 'nombre error de tipo de dato', 
                'correo error de tipo de dato', 'edad error de tipo de dato', 
                'genero error de tipo de dato', 'nacionalidad error de tipo de dato',
                'clave error de tipo de dato', 'perfil error de tipo de dato',
                'accion error de tipo de dato'
            ]
        }
        self.assertEquals(data_invalid, value_expected)


    def test_to_json(self):
        print("\nTesting to_json")
        file = detect_file(self.headers)
        json = File.to_json(file,self.df)

        value_expected = {
            'usuario': {'AAAA01': 2, 'AAAA02': 1, 'AAAA03': 1, 'BBBB01': 1, 'BBBB02': 1, '1': 1}, 
            'nombre': {'JOSE RAMIREZ': 1, 'ESTHER PEREZ': 1, 'ITZEL CASTRO': 1, 'SAUL DIAZ': 1, 'ROSA LUNA': 1, 'MANUEL RAMIREZ': 1, '1': 1},
            'telefono': {}, 
            'correo': {'JOSE@GMAIL.COM': 2, 'ESTHER@GMAIL.COM': 1, 'ITZEL@GMAIL.COM': 1, 'SAUL@GMAIL.COM': 1, 'ROSA@GMAIL.COM': 1, '1': 1},
            'edad': {'19': 1, '17': 1, '100': 1, '45': 1, '34': 1, '2': 1, 'FF': 1}, 
            'genero': {'M': 3, 'F': 2, 'G': 1, '1': 1}, 
            'nacionalidad': {'MEXICO': 6, '2': 1}, 
            'clave': {'123456AB#': 2, '123457AB#': 1, '123458AB#': 1, '123459AB#': 1, '123460AB#': 1, '1': 1}, 
            'perfil': {'STAFF': 5, 'GERENTE': 1, '2': 1}, 
            'permisos': {}, 
            'accion': {'INSERTAR': 6, '2': 1}
        }
        self.assertEquals(json, value_expected)


    def test_apply_validators(self):
        print("\nTesting apply_validators")
        file = detect_file(self.headers)
        data_invalid = File.apply_validators(file,self.df,{})

        value_expected = {
            0: ['usuario con valor aaaa01 ya existe.', 'correo con valor jose@gmail.com ya existe.'],
            1: ['La edad debe estar en un rango de 18 a 90'],
            2: ['La edad debe estar en un rango de 18 a 90'], 
            4: ['El género debe ser o M o F'],
            5: [
                'usuario con valor aaaa01 ya existe.', 'correo con valor jose@gmail.com ya existe.',
                'La edad debe estar en un rango de 18 a 90', 'El perfil no esta entre las opciones disponibles.'
            ],
            6: ['Formato de correo invalido', 'La edad debe estar en un rango de 18 a 90',
                'El género debe ser o M o F', 'La nacionalidad no esta entre las opciones disponibles.',
                'La longitud de clave debe ser de al menos 8 caracteres.', 'El perfil no esta entre las opciones disponibles.',
                'Las operaciones validas son ELIMINAR,INSERTAR y MODIFICAR'
            ]
        }
        self.assertEquals(data_invalid, value_expected)

    def tearDown(self):
        pass



    
        
    
    