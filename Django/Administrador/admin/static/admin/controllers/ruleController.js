var myApp = angular.module('Admin');

var RULE_SERVICE = "/rules/rule/";
var RULE_PROPERTY_SERVICE = "/rules/ruleProperty/";
var RULE_PROPERTY_TYPE_SERVICE = "/rules/rulePropertyType/";
var RULE_TYPE_SERVICE = "/rules/ruleType/";


var RULE_TYPE = 0;
var RULE_PROPERTY_TYPE = 1;
var RULE = 2;
var RULE_PROPERTY = 3;
var language = {};


myApp.controller('RuleController',['$rootScope','$scope','$http','$location','$timeout','NgTableParams',function($rootScope, $scope,$http,$location,$timeout,NgTableParams){
    var templateRule = {
        "id":0,
        "keyCode":"",
        "objectType":{"id":0},
        "active":true,
        "createdAt":"",
        "file":{"id":0},
        "parent":{"id":0}

    };

    var templateRulePropertyType = {
        "id":0,
        "name":"",
        "description":"",
        "dataType":{"id":0},
        "objectType":{"id":0},
        "createdAt":"",
        "active":true,
    };

    var templateRuleType = {
        "id":0,
        "name":"",
        "description":"",
        "parent":{"id":0},
        "createdAt":"",
        "active":true
    };

    var templateRuleProperty = {
        "id":0,
        "name":"",
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

    $scope.infoRule = {};
    $scope.infoRuleProperty = {};
    $scope.infoRulePropertyType = {};
    $scope.inforRuleType = {};
    $scope.infoDataType = {};

    $scope.allRuleProperties = [];
    $scope.allRulePropertyTypes = [];
    $scope.allRuleTypes = [];
    $scope.allFiles = [];
    $scope.allRules = [];
    $scope.allDataTypes = [];

    $scope.tableParameters;

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

    $scope.getParamsRuleProperty = function getParamsRuleProperty(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameObjectProperty").val();
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

    $scope.getParamsRulePropertyType = function getParamsRulePropertyType(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameTypeObjectProperty").val();
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

    $scope.getParamsRuleType = function getParamsRuleType(id=0)
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

    $scope.getParamsRule = function getParamsRule(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["keyCode"] = $("#keyCodeObject").val();
        params["parent"] =($("#parentObject").val()==0) ? null : {"id":parseInt($("#parentObject").val())};
        params["loadFile"] =($("#fileObject").val()==0) ? null : {"id":parseInt($("#fileObject").val())};
        params["objectType"] =($("#objectType").val()==0) ? null : {"id":parseInt($("#objectType").val())};
        params["active"] = $('#activeTypeObject').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateObject").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.initDataTypes = function initDataTypes()
    {
        $scope.type = DATA_TYPE;
        $scope.getDataTypes();
        //$scope.getFiles();
    }

    $scope.initRules = function initRules()
    {
        $scope.type = RULE;
        $scope.getRules();
        $scope.getRuleTypes();
        //$scope.getFiles();
    }

    $scope.initRuleProperties = function initRuleProperties()
    {
        $scope.type = RULE_PROPERTY;
        $scope.getRuleProperties();
        $scope.getRules();
    }
    $scope.initRuleTypes = function initRuleTypes()
    {
        $scope.type = RULE_TYPE;
        $scope.getRuleTypes();
    }

    $scope.initRulePropertyTypes = function initRulePropertyTypes()
    {
        $scope.type = RULE_PROPERTY_TYPE;
        $scope.getRulePropertyType();
        $scope.getRuleTypes();
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

    $scope.getRules= function getRules()
    {
        $http.get(RULE_SERVICE).success(function(data)
        {
            console.log("Objetos")
            console.log(data["data"]);
            if($scope.type==RULE)
            {
                $scope.allRules = data["data"];
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allRules});
            }
            else
                $scope.allRules = addStateNotActive(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getRuleProperties = function getRuleProperties()
    {
        $http.get(RULE_PROPERTY_SERVICE).success(function(data)
        {
            console.log("Propiedades")
            console.log(data["data"]);
            if($scope.type==RULE_PROPERTY)
            {
                $scope.allRuleProperties = data["data"];
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allRuleProperties});
            }
            else
                $scope.allRuleProperties = addStateNotActive(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }


    $scope.getRulePropertyType =  function getRulePropertyType()
    {
        $http.get(RULE_PROPERTY_TYPE_SERVICE).success(function(data)
        {
            console.log("Tipos de Propiedades")
            console.log(data["data"]);
            $scope.allRulePropertyTypes = data["data"];
            if($scope.type==RULE_PROPERTY_TYPE)
            {
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allRulePropertyTypes});
            }
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getRuleTypes =  function getRuleTypes()
    {
        $http.get(RULE_TYPE_SERVICE).success(function(data)
        {
            console.log("Tipos de objetos")
            console.log(data["data"]);
            $scope.allRuleTypes = data["data"];
            if($scope.type==RULE_TYPE)
            {
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allRuleTypes});
            }
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }


    $scope.editModal= function editModal(id)
    {
        $scope.editing=true;
        if($scope.type == RULE)
        {
            $scope.infoRule = $scope.getById($scope.allRules,id);
            $scope.leftOptionsForms = addStateNotActive(complement($scope.allForms,$scope.infoRule["form"]));
            $scope.rightOptionsForms = addStateActive($scope.infoRule["form"]);
        }
        else if($scope.type == RULE_PROPERTY)
        {
            $scope.infoRuleProperty = $scope.getById($scope.allRuleProperties,id);
            $scope.leftOptionsForms = addStateNotActive(complement($scope.allForms,$scope.infoRuleProperty["form"]));
            $scope.rightOptionsForms = addStateActive($scope.infoRuleProperty["form"]);
        }
        else if($scope.type == RULE_PROPERTY_TYPE)
        {
            $scope.infoRulePropertyType = $scope.getById($scope.allRulePropertyTypes,id);
        }
        else if($scope.type == RULE_TYPE)
        {
            $scope.inforRuleType = $scope.getById($scope.allRuleTypes,id);
        }
        else if($scope.type == DATA_TYPE)
        {
            $scope.infoDataType = $scope.getById($scope.allDataTypes,id);
        }
    }

    $scope.addModal = function addModal()
    {
        $scope.editing=false;
        $scope.infoRule = JSON.parse( JSON.stringify(templateRule));
        $scope.infoRuleProperty = JSON.parse( JSON.stringify(templateRuleProperty));
        $scope.infoRulePropertyType = JSON.parse( JSON.stringify(templateRulePropertyType));
        $scope.inforRuleType = JSON.parse( JSON.stringify(templateRuleType));
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

    $scope.addRule = function addRule()
    {
        var params = $scope.getParamsRule();
        $scope.insert(RULE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getRules);
        })
    }

    $scope.editRules = function editRules(id)
    {
        var params = $scope.getParamsRule(id);
        $scope.update(RULE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getRules);
        })
    }

    $scope.addRulePropertyType = function addRulePropertyType()
    {
        var params = $scope.getParamsRulePropertyType();
        $scope.insert(RULE_PROPERTY_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getRulePropertyType);
        })
    }

    $scope.editRulesPropertyType = function editRulesPropertyType(id)
    {
        var params = $scope.getParamsRulePropertyType(id);
        $scope.update(RULE_PROPERTY_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getRulePropertyType);
        })
    }

    $scope.addRuleType = function addRuleType()
    {
        var params = $scope.getParamsRuleType();
        $scope.insert(RULE_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getRuleTypes);
        })
    }

    $scope.editRuleType = function editRuleType(id)
    {
        var params = $scope.getParamsRuleType(id);
        $scope.update(RULE_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getRuleTypes);
        })
    }

    $scope.addRuleProperty = function addRuleProperty()
    {
        var params = $scope.getParamsRuleProperty();
        $scope.insert(RULE_PROPERTY_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getRuleProperties);
        })
    }

    $scope.editRulesProperty = function editRulesProperty(id)
    {
        var params = $scope.getParamsRuleProperty(id);
        $scope.update(RULE_PROPERTY_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getRuleProperties);
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
