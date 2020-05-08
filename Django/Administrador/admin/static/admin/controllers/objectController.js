var myApp = angular.module('Admin');

var OBJECT_SERVICE = "/objects/object/";
var LOAD_FILE_SERVICE = " /modules/file/";
var OBJECT_PROPERTY_SERVICE = "/objects/objectProperty/";
var OBJECT_PROPERTY_TYPE_SERVICE = "/objects/objectPropertyType/";
var OBJECT_TYPE_SERVICE = "/objects/objectType/";
var DATA_TYPE_SERVICE = "/objects/dataType/";
var FORM_SERVICE = "/modules/form/";

var OBJECT_FORM_SERVICE = "/composite/object-form/"

var OBJECT_TYPE = 0;
var OBJECT_PROPERTY_TYPE = 1;
var OBJECT = 2;
var OBJECT_PROPERTY = 3;
var DATA_TYPE = 4;
var language = {};


myApp.controller('ObjectController',['$rootScope','$scope','$http','$location','$timeout','NgTableParams',function($rootScope, $scope,$http,$location,$timeout,NgTableParams){
    var templateObject = {
        "id":0,
        "keyCode":"",
        "objectType":{"id":0},
        "active":true,
        "createdAt":"",
        "file":{"id":0},
        "parent":{"id":0}

    };

    var templateObjectPropertyType = {
        "id":0,
        "name":"",
        "description":"",
        "dataType":{"id":0},
        "objectType":{"id":0},
        "createdAt":"",
        "active":true,
    };

    var templateObjectType = {
        "id":0,
        "name":"",
        "description":"",
        "parent":{"id":0},
        "createdAt":"",
        "active":true
    };

    var templateObjectProperty = {
        "id":0,
        "objectTypeProperties":{"id":0},
        "value":"",
        "objects":{"id":0},
        "createdAt":"",
        "active":true,
    };

    var templateDataType = {
        "id":0,
        "name":"",
        "createdAt":"",
        "active":true,
    };

    $scope.editing = false;
    $scope.type = 0;

    $scope.infoObject = {};
    $scope.infoObjectProperty = {};
    $scope.infoObjectPropertyType = {};
    $scope.infoObjectType = {};
    $scope.infoDataType = {};

    $scope.allObjectProperties = [];
    $scope.allObjectPropertyTypes = [];
    $scope.allObjectTypes = [];
    $scope.allFiles = [];
    $scope.allObjects = [];
    $scope.allDataTypes = [];
    $scope.allForms = [];

    $scope.infoForm = [];
    $scope.infoFormComposite = [];
    $scope.opcForm = 0

    $scope.tableParameters;

    $scope.appendFormComposite = function appendFormComposite()
    {
        $scope.infoForm.push({"form":{"id":$scope.opcForm.id,"name":$scope.opcForm.name},"startTime":"","endTime":"","active":true});
        $scope.infoFormComposite = $scope.infoForm[$scope.infoForm.length-1];
    }

    $scope.addFormComposite = function addFormComposite()
    {
        $scope.infoFormComposite["form"] = $scope.infoFormComposite["form"]["id"];
        $scope.infoFormComposite["object"] = $scope.infoObject.id;
        $scope.infoFormComposite["startTime"] = $("#dateStartFormComposite").val();
        $scope.infoFormComposite["endTime"] = $("#dateEndFormComposite").val();
        $scope.insert(OBJECT_FORM_SERVICE,$scope.infoFormComposite).then(
            function(response){
                data = response.data;
                $scope.getObjectForm($scope.infoObject.id);
                if(data["error"])
                    toastr["error"](data["message"]);
                else
                    toastr["success"](data["message"]);
        })
    }

    $scope.editFormComposite = function editFormComposite()
    {
        $scope.infoFormComposite["startTime"] = $("#dateStartFormComposite").val();
        $scope.infoFormComposite["endTime"] = $("#dateEndFormComposite").val();
        $scope.update(OBJECT_FORM_SERVICE,$scope.infoFormComposite).then(
            function(response){
                data = response.data;
                $scope.getObjectForm($scope.infoObject.id);
                if(data["error"])
                    toastr["error"](data["message"]);
                else
                    toastr["success"](data["message"]);
        })
    }

    $scope.getById = function getById(all,id)
    {
        for(i=0;i<all.length;++i)
            if(all[i]["id"] == id)
                return all[i];
        return new Array();
    }

    $scope.getFiles = function getFiles()
    {
        $http.get(LOAD_FILE_SERVICE).success(function(data)
        {
            console.log("Archivos")
            console.log(data["data"]);
            $scope.allFiles = data["data"];
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }
    $scope.getForms = function getForms()
    {
        $http.get(FORM_SERVICE).success(function(data)
        {
            console.log("Formularios")
            console.log(data["data"]);
            if($scope.type==FORM)
            {
                $scope.allForms = data["data"];
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allForms});
            }
            else
                $scope.allForms = addStateNotActive(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getParamsDataType = function getParamsDataType(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameDataType").val();
        params["active"] = $('#activeDataType').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateDataType").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsObjectProperty = function getParamsObjectProperty(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["objectTypeProperties"] =($("#typeObjectProperty").val()==0) ? null : {"id":parseInt($("#typeObjectProperty").val())};
        params["value"] = $("#valueObjectProperty").val();
        params["objects"] =($("#objectProperty").val()==0) ? null : {"id":parseInt($("#objectProperty").val())};
        params["active"] = $('#activeObjectProperty').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateObjectProperty").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsObjectPropertyType = function getParamsObjectPropertyType(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameTypeObjectProperty").val();
        params["description"] = $("#descriptionTypeObjectProperty").val();
        params["dataType"] = ($("#dataTypeObjectProperty").val()==0) ? null : {"id":parseInt($("#dataTypeObjectProperty").val())};
        params["objectType"] = ($("#objectTypeObjectProperty").val()==0) ? null : {"id":parseInt($("#objectTypeObjectProperty").val())};
        params["active"] = $('#activeTypeObjectProperty').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateTypeObjectProperty").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsObjectType = function getParamsObjectType(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameObjectType").val();
        params["description"] = $("#descriptionObjectType").val();
        params["parent"] =($("#parentObjectType").val()==0) ? null : {"id":parseInt($("#parentObjectType").val())};
        params["active"] = $('#activeObjectType').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateObjectType").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsObject = function getParamsObject(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["keyCode"] = $("#keyCodeObject").val();
        params["parent"] =($("#parentObject").val()==0) ? null : {"id":parseInt($("#parentObject").val())};
        params["loadFile"] =($("#fileObject").val()==0) ? null : {"id":parseInt($("#fileObject").val())};
        params["objectType"] =($("#objectType").val()==0) ? null : {"id":parseInt($("#objectType").val())};
        params["active"] = $('#activeObject').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateObject").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getObjectForm = function getObjectForm(id)
    {
        return $http.get(OBJECT_FORM_SERVICE+"?type=o&id="+id).success(function(data)
        {
            console.log("Objects Form");
            console.log(data["data"]);
            $scope.infoForm = data["data"]
            if($scope.infoForm.length > 0)
            {
                $scope.infoFormComposite = $scope.infoForm[0];
            }
            return true;

        }).error(function(data, status)
        {
            console.log(data);
            return false;
        });
    }

    $scope.initDataTypes = function initDataTypes()
    {
        $scope.type = DATA_TYPE;
        $scope.getDataTypes();
        //$scope.getFiles();
    }

    $scope.initObjects = function initObjects()
    {
        $scope.type = OBJECT;
        $scope.getObjects();
        $scope.getObjectTypes();
        $scope.getForms();
        //$scope.getFiles();
    }

    $scope.initObjectProperties = function initObjectProperties()
    {
        $scope.type = OBJECT_PROPERTY;
        $scope.getObjectProperties();
        $scope.getObjects();
        $scope.getObjectPropertyType();
    }
    $scope.initObjectTypes = function initObjectTypes()
    {
        $scope.type = OBJECT_TYPE;
        $scope.getObjectTypes();
    }

    $scope.initObjectPropertyTypes = function initObjectPropertyTypes()
    {
        $scope.type = OBJECT_PROPERTY_TYPE;
        $scope.getObjectPropertyType();
        $scope.getObjectTypes();
        $scope.getDataTypes();
    }

    $scope.getDataTypes= function getDataTypes()
    {
        $http.get(DATA_TYPE_SERVICE).success(function(data)
        {
            console.log("Tipos de datos")
            console.log(data["data"]);
            if($scope.type==DATA_TYPE)
            {
                $scope.allDataTypes = data["data"];
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allDataTypes});
            }
            else
                $scope.allDataTypes = addStateNotActive(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getObjects= function getObjects()
    {
        $http.get(OBJECT_SERVICE).success(function(data)
        {
            console.log("Objetos")
            console.log(data["data"]);
            if($scope.type==OBJECT)
            {
                $scope.allObjects = data["data"];
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allObjects});
            }
            else
                $scope.allObjects = addStateNotActive(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getObjectProperties = function getObjectProperties()
    {
        $http.get(OBJECT_PROPERTY_SERVICE).success(function(data)
        {
            console.log("Propiedades de objeto")
            console.log(data["data"]);
            if($scope.type==OBJECT_PROPERTY)
            {
                $scope.allObjectProperties = data["data"];
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allObjectProperties});
            }
            else
                $scope.allObjectProperties = addStateNotActive(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }


    $scope.getObjectPropertyType =  function getObjectPropertyType()
    {
        $http.get(OBJECT_PROPERTY_TYPE_SERVICE).success(function(data)
        {
            console.log("Tipos de Propiedades")
            console.log(data["data"]);
            $scope.allObjectPropertyTypes = data["data"];
            if($scope.type==OBJECT_PROPERTY_TYPE)
            {
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allObjectPropertyTypes});
            }
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getObjectTypes =  function getObjectTypes()
    {
        $http.get(OBJECT_TYPE_SERVICE).success(function(data)
        {
            console.log("Tipos de objetos")
            console.log(data["data"]);
            $scope.allObjectTypes = data["data"];
            if($scope.type==OBJECT_TYPE)
            {
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allObjectTypes});
            }
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }


    $scope.editModal= function editModal(id)
    {
        $scope.editing=true;
        if($scope.type == OBJECT)
        {
            $scope.infoObject = JSON.parse( JSON.stringify($scope.getById($scope.allObjects,id)));
            $scope.infoObject["createdAt"] = getDate($scope.infoObject["createdAt"]);
            $scope.getObjectForm($scope.infoObject.id);
        }
        else if($scope.type == OBJECT_PROPERTY)
        {
            $scope.infoObjectProperty = JSON.parse( JSON.stringify($scope.getById($scope.allObjectProperties,id)));
            $scope.infoObjectProperty["createdAt"] = getDate($scope.infoObjectProperty["createdAt"]);
        }
        else if($scope.type == OBJECT_PROPERTY_TYPE)
        {
            $scope.infoObjectPropertyType = JSON.parse( JSON.stringify($scope.getById($scope.allObjectPropertyTypes,id)));
            $scope.infoObjectPropertyType["createdAt"] = getDate($scope.infoObjectPropertyType["createdAt"]);
        }
        else if($scope.type == OBJECT_TYPE)
        {
            $scope.infoObjectType = JSON.parse( JSON.stringify($scope.getById($scope.allObjectTypes,id)));
            $scope.infoObjectType["createdAt"] = getDate($scope.infoObjectType["createdAt"]);
        }
        else if($scope.type == DATA_TYPE)
        {
            $scope.infoDataType = JSON.parse( JSON.stringify($scope.getById($scope.allDataTypes,id)));
            $scope.infoDataType["createdAt"] = getDate($scope.infoDataType["createdAt"]);
        }
    }

    $scope.addModal = function addModal()
    {
        $scope.editing=false;
        $scope.infoObject = JSON.parse( JSON.stringify(templateObject));
        $scope.infoObjectProperty = JSON.parse( JSON.stringify(templateObjectProperty));
        $scope.infoObjectPropertyType = JSON.parse( JSON.stringify(templateObjectPropertyType));
        $scope.infoObjectType = JSON.parse( JSON.stringify(templateObjectType));
        $scope.infoDataType = JSON.parse( JSON.stringify(templateDataType));
    }

    $scope.addDataType = function addDataType()
    {
        var params = $scope.getParamsDataType();
        $scope.insert(DATA_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getDataTypes);
        })
    }

    $scope.editDataType = function editDataType(id)
    {
        var params = $scope.getParamsDataType(id);
        $scope.update(DATA_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getDataTypes);
        })
    }

    $scope.addObject = function addObject()
    {
        var params = $scope.getParamsObject();
        $scope.insert(OBJECT_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getObjects);
        })
    }

    $scope.editObject = function editObject(id)
    {
        var params = $scope.getParamsObject(id);
        $scope.update(OBJECT_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getObjects);
        })
    }

    $scope.addObjectPropertyType = function addObjectPropertyType()
    {
        var params = $scope.getParamsObjectPropertyType();
        $scope.insert(OBJECT_PROPERTY_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getObjectPropertyType);
        })
    }

    $scope.editObjectPropertyType = function editObjectPropertyType(id)
    {
        var params = $scope.getParamsObjectPropertyType(id);
        $scope.update(OBJECT_PROPERTY_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getObjectPropertyType);
        })
    }

    $scope.addObjectType = function addObjectType()
    {
        var params = $scope.getParamsObjectType();
        $scope.insert(OBJECT_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getObjectTypes);
        })
    }

    $scope.editObjectType = function editObjectType(id)
    {
        var params = $scope.getParamsObjectType(id);
        $scope.update(OBJECT_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getObjectTypes);
        })
    }

    $scope.addObjectProperty = function addObjectProperty()
    {
        var params = $scope.getParamsObjectProperty();
        $scope.insert(OBJECT_PROPERTY_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getObjectProperties);
        })
    }

    $scope.editObjectProperty = function editObjectProperty(id)
    {
        var params = $scope.getParamsObjectProperty(id);
        $scope.update(OBJECT_PROPERTY_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getObjectProperties);
        })
    }

    $scope.update = function update(url,params)
    {
        return $http.put(url,{"params":params}).success(function(data)
        {
            return data;
	    }).error(function(data, status)
        {
	    	console.log(data);
            return null;
	    });
    }

    $scope.remove = function remove(url,sparams)
    {
        return $http.delete(url,{"params":params}).success(function(data)
        {
            return data;
	    }).error(function(data, status)
        {
	    	console.log(data);
            return null;
	    });
    }

    $scope.insert = function insert(url,params)
    {
        //alert("si llego")
        return $http.post(url,{"params":params}).success(function(data)
        {
            return data;
	    }).error(function(data, status)
        {
	    	console.log(data);
            return data;
	    });
    }

    $scope.success = function success(data,functionReload)
    {
        if(data["error"])
            toastr["error"](data["message"]);
        else
        {
            toastr["success"](data["message"]);
            $('#modalEdition').modal('toggle');
            functionReload()
        }
    }

}]);
