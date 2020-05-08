var myApp = angular.module('Admin');

var TERRITORY_SERVICE = "/sites/territory/";
var SITE_INTEREST_SERVICE = "/sites/siteInterest/";
var LOAD_FILE_SERVICE = "/modules/file/";
var ROLE_SERVICE = "/user/role/";
var USER_SERVICE = "/user/user/";
var OBJECT_SERVICE = "/objects/object/";
var OBJECT_TYPE_SERVICE = "/objects/objectType/"
var ROLE_SERVICE = "/user/role/";

var MODULE_SERVICE = "/modules/module/";
var FORM_SERVICE = "/modules/form/";
var SECTION_SERVICE = "/modules/section/";

var MODULE_ROLE_SERVICE = "/composite/module-role/"

var USER_FORM_SERVICE = "/composite/user-form/"
var TERRITORY_FORM_SERVICE = "/composite/territory-form/"
var SITE_FORM_SERVICE = "/composite/site-form/"
var OBJECT_FORM_SERVICE = "/composite/object-form/"
var ROLE_FORM_SERVICE = "/composite/role-form/"

var SECTION = 1;
var MODULE = 2;
var FORM = 3;
var language = {};


myApp.controller('ModuleController',['$rootScope','$scope','$http','$location','$timeout','NgTableParams',function($rootScope, $scope,$http,$location,$timeout,NgTableParams){
    var templateModule = {
        "id":0,
        "name":"",
        "description":"",
        "parent":{"id":0},
        "startTime":"",
        "endTime":"",
        "orderBy":0,
        "createdAt":"",
        "active":true,
    }

    var templateSection = {
        "id":0,
        "name":"",
        "description":"",
        "formId":null,
        "startTime":"",
        "endTime":"",
        "createdAt":"",
        "active":true
    };

    var templateForm = {
        "id":0,
        "name":"",
        "description":"",
        "startTime":"",
        "endTime":"",
        "createdAt":"",
        "active":true,
        "file":null,
        "period":0,
        "frecuency":0,
        "users":[],
        "territories":[],
        "roles":[],
        "objects":[],
        "sites":[]
    };

    var templateComposite = {
        "id":0,
        "startTime":"",
        "endTime":"",
        "active":true
    };

    $scope.editing = false;
    $scope.type = 0;
    $scope.otro = []

    $scope.opcUser = 1;
    $scope.infoUserComposite = {};
    $scope.opcRole = 1;
    $scope.infoRoleComposite = {};
    $scope.opcSite = 1;
    $scope.infoSiteComposite = {};
    $scope.opcTerritory = 1;
    $scope.infoTerritoryComposite = {};
    $scope.opcObject = 1;
    $scope.infoObjectComposite = {};

    $scope.infoModule = templateModule;
    $scope.infoForm = templateForm;
    $scope.infoSection = templateSection;

    $scope.leftOptionsForms = [];
    $scope.rightOptionsForms = [];
    $scope.leftOptionsSites = [];
    $scope.rightOptionsSites = [];
    $scope.leftOptionsObjects = [];
    $scope.rightOptionsObjects = [];
    $scope.leftOptionsUsers = [];
    $scope.rightOptionsUsers = [];
    $scope.leftOptionsModules = [];
    $scope.rightOptionsModules = [];
    $scope.leftOptionsSections = [];
    $scope.rightOptionsSections = [];
    $scope.leftOptionsTerritories = [];
    $scope.rightOptionsTerritories = [];

    $scope.allForms = [];
    $scope.allSections = [];
    $scope.allFiles = [];
    $scope.allModules = [];
    $scope.allTerritories = [];
    $scope.allModules = [];
    $scope.allInterestSites = [];
    $scope.allRoles = [];
    $scope.allUsers = [];
    $scope.allObjectTypes = [];
    $scope.allRoles = [];

    $scope.tableParameters;


    $scope.appendUserComposite = function appendUserComposite()
    {
        $scope.infoForm["users"].push({"user":{"id":$scope.opcUser.id,"username":$scope.opcUser.username},"startTime":"","endTime":"","active":true});
        $scope.infoUserComposite = $scope.infoForm["users"][$scope.infoForm["users"].length-1];
    }
    $scope.appendRoleComposite = function appendRoleComposite()
    {
        $scope.infoForm["roles"].push({"role":{"id":$scope.opcRole.id,"name":$scope.opcRole.name},"startTime":"","endTime":"","active":true});
        $scope.infoRoleComposite = $scope.infoForm["roles"][$scope.infoForm["roles"].length-1];
    }

    $scope.appendSiteComposite = function appendSiteComposite()
    {
        $scope.infoForm["sites"].push({"site":{"id":$scope.opcSite.id,"name":$scope.opcSite.name},"startTime":"","endTime":"","active":true});
        $scope.infoSiteComposite = $scope.infoForm["sites"][$scope.infoForm["sites"].length-1];
    }

    $scope.appendTerritoryComposite = function appendTerritoryComposite()
    {
        $scope.infoForm["territories"].push({"territory":{"id":$scope.opcTerritory.id,"name":$scope.opcTerritory.name},"startTime":"","endTime":"","active":true});
        $scope.infoTerritoryComposite = $scope.infoForm["territories"][$scope.infoForm["territories"].length-1];
    }

    $scope.appendObjectComposite = function appendObjectComposite()
    {
        $scope.infoForm["objects"].push({"object":{"id":$scope.opcObject.id,"key_code":$scope.opcObject.keyCode},"startTime":"","endTime":"","active":true});
        $scope.infoObjectComposite = $scope.infoForm["objects"][$scope.infoForm["objects"].length-1];
    }

    $scope.addUserComposite = function addUserComposite()
    {
        $scope.infoUserComposite["users"] = $scope.infoUserComposite["user"]["id"];
        $scope.infoUserComposite["form"] = $scope.infoForm.id;
        $scope.infoUserComposite["startTime"] = $("#dateStartUserComposite").val();
        $scope.infoUserComposite["endTime"] = $("#dateEndUserComposite").val();
        $scope.insert(USER_FORM_SERVICE,$scope.infoUserComposite).then(
            function(response){
                data = response.data;
                $scope.getUserForm($scope.infoForm.id);
                if(data["error"])
                    toastr["error"](data["message"]);
                else
                    toastr["success"](data["message"]);
        })
    }

    $scope.editUserComposite = function editUserComposite()
    {
        $scope.infoUserComposite["startTime"] = $("#dateStartUserComposite").val();
        $scope.infoUserComposite["endTime"] = $("#dateEndUserComposite").val();
        $scope.update(USER_FORM_SERVICE,$scope.infoUserComposite).then(
            function(response){
                data = response.data;
                $scope.getUserForm($scope.infoForm.id);
                if(data["error"])
                    toastr["error"](data["message"]);
                else
                    toastr["success"](data["message"]);
        })
    }

    $scope.addTerritoryComposite = function addTerritoryComposite()
    {
        $scope.infoTerritoryComposite["territory"] = $scope.infoTerritoryComposite["territory"]["id"];
        $scope.infoTerritoryComposite["form"] = $scope.infoForm.id;
        $scope.infoTerritoryComposite["startTime"] = $("#dateStartTerritoryComposite").val();
        $scope.infoTerritoryComposite["endTime"] = $("#dateEndTerritoryComposite").val();
        $scope.insert(TERRITORY_FORM_SERVICE,$scope.infoTerritoryComposite).then(
            function(response){
                data = response.data;
                $scope.getTerritoryForm($scope.infoForm.id);
                if(data["error"])
                    toastr["error"](data["message"]);
                else
                    toastr["success"](data["message"]);
        })
    }

    $scope.editTerritoryComposite = function editTerritoryComposite()
    {
        $scope.infoTerritoryComposite["startTime"] = $("#dateStartTerritoryComposite").val();
        $scope.infoTerritoryComposite["endTime"] = $("#dateEndTerritoryComposite").val();
        $scope.update(TERRITORY_FORM_SERVICE,$scope.infoTerritoryComposite).then(
            function(response){
                data = response.data;
                $scope.getTerritoryForm($scope.infoForm.id);
                if(data["error"])
                    toastr["error"](data["message"]);
                else
                    toastr["success"](data["message"]);
        })
    }

    $scope.addSiteComposite = function addSiteComposite()
    {
        $scope.infoSiteComposite["siteInterest"] = $scope.infoSiteComposite["site"]["id"];
        $scope.infoSiteComposite["form"] = $scope.infoForm.id;
        $scope.infoSiteComposite["startTime"] = $("#dateStartSiteComposite").val();
        $scope.infoSiteComposite["endTime"] = $("#dateEndSiteComposite").val();
        $scope.insert(SITE_FORM_SERVICE,$scope.infoSiteComposite).then(
            function(response){
                data = response.data;
                $scope.getSiteForm($scope.infoForm.id);
                if(data["error"])
                    toastr["error"](data["message"]);
                else
                    toastr["success"](data["message"]);
        })
    }

    $scope.editSiteComposite = function editSiteComposite()
    {
        $scope.infoSiteComposite["startTime"] = $("#dateStartSiteComposite").val();
        $scope.infoSiteComposite["endTime"] = $("#dateEndSiteComposite").val();
        $scope.update(SITE_FORM_SERVICE,$scope.infoSiteComposite).then(
            function(response){
                data = response.data;
                $scope.getSiteForm($scope.infoForm.id);
                if(data["error"])
                    toastr["error"](data["message"]);
                else
                    toastr["success"](data["message"]);
        })
    }

    $scope.addObjectComposite = function addObjectComposite()
    {
        $scope.infoObjectComposite["object"] = $scope.infoObjectComposite["object"]["id"];
        $scope.infoObjectComposite["form"] = $scope.infoForm.id;
        $scope.infoObjectComposite["startTime"] = $("#dateStartObjectComposite").val();
        $scope.infoObjectComposite["endTime"] = $("#dateEndObjectComposite").val();
        $scope.insert(OBJECT_FORM_SERVICE,$scope.infoObjectComposite).then(
            function(response){
                data = response.data;
                $scope.getObjectForm($scope.infoForm.id);
                if(data["error"])
                    toastr["error"](data["message"]);
                else
                    toastr["success"](data["message"]);
        })
    }

    $scope.editObjectComposite = function editObjectComposite()
    {
        $scope.infoObjectComposite["startTime"] = $("#dateStartObjectComposite").val();
        $scope.infoObjectComposite["endTime"] = $("#dateEndObjectComposite").val();
        $scope.update(OBJECT_FORM_SERVICE,$scope.infoObjectComposite).then(
            function(response){
                data = response.data;
                $scope.getObjectForm($scope.infoForm.id);
                if(data["error"])
                    toastr["error"](data["message"]);
                else
                    toastr["success"](data["message"]);
        })
    }

    $scope.addRoleComposite = function addRoleComposite()
    {
        $scope.infoRoleComposite["role"] = $scope.infoRoleComposite["role"]["id"];
        $scope.infoRoleComposite["form"] = $scope.infoForm.id;
        $scope.infoRoleComposite["startTime"] = $("#dateStartRoleComposite").val();
        $scope.infoRoleComposite["endTime"] = $("#dateEndRoleComposite").val();
        $scope.insert(ROLE_FORM_SERVICE,$scope.infoRoleComposite).then(
            function(response){
                data = response.data;
                $scope.getRoleForm($scope.infoForm.id);
                if(data["error"])
                    toastr["error"](data["message"]);
                else
                    toastr["success"](data["message"]);
        })
    }

    $scope.editRoleComposite = function editRoleComposite()
    {
        $scope.infoRoleComposite["startTime"] = $("#dateStartRoleComposite").val();
        $scope.infoRoleComposite["endTime"] = $("#dateEndRoleComposite").val();
        $scope.update(ROLE_FORM_SERVICE,$scope.infoRoleComposite).then(
            function(response){
                data = response.data;
                $scope.getRoleForm($scope.infoForm.id);
                if(data["error"])
                    toastr["error"](data["message"]);
                else
                    toastr["success"](data["message"]);
        })
    }


    $scope.getObjectTypes =  function getObjectTypes()
    {
        $http.get(OBJECT_TYPE_SERVICE).success(function(data)
        {
            console.log("Tipos de objetos")
            console.log(data["data"]);
            $scope.allObjectTypes = data["data"];
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getRoles =  function getRoles()
    {
        $http.get(ROLE_SERVICE).success(function(data)
        {
            console.log(("Roles"));
            console.log(data["data"]);
            if($scope.type==ROLE)
                $scope.allRoles = data["data"];
            else
                $scope.allRoles = addStateNotActive(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getTerritories = function getTerritories()
    {
        $http.get(TERRITORY_SERVICE).success(function(data)
        {
            console.log("Territorios")
            console.log(data["data"]);
            $scope.allTerritories = addStateNotActive(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getInterestSites = function getInterestSites()
    {
        $http.get(SITE_INTEREST_SERVICE).success(function(data)
        {
            console.log("Sitios")
            console.log(data["data"]);
            $scope.allInterestSites = addStateNotActive(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getRoles = function getRoles()
    {
        $http.get(ROLE_SERVICE).success(function(data)
        {
            console.log("Roles")
            console.log(data["data"]);
            $scope.allRoles = addStateNotActive(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getUsers= function getUsers()
    {
        $http.get(USER_SERVICE).success(function(data)
        {
            console.log("Usuarios");
            console.log(data["data"]);
            $scope.allUsers = addStateNotActive(data["data"]);
            //alert(data["data"].length)
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getObjects= function getObjects()
    {
        $http.get(OBJECT_SERVICE).success(function(data)
        {
            console.log("Objetos");
            console.log(data["data"]);
            $scope.allObjects = addStateNotActive(data["data"]);
            //alert(data["data"].length)
        }).error(function(data, status)
        {
            console.log(data);
        });
    }

    $scope.getFiles= function getFiles()
    {
        $http.get(LOAD_FILE_SERVICE).success(function(data)
        {
            console.log("Archivos");
            console.log(data["data"]);
            $scope.allFiles = addStateNotActive(data["data"]);
            //alert(data["data"].length)
        }).error(function(data, status)
        {
            console.log(data);
        });
    }

    $scope.getById = function getById(all,id)
    {
        for(i=0;i<all.length;++i)
            if(all[i]["id"] == id)
                return all[i];
        return new Array();
    }

    $scope.getParamsForm = function getParamsForm(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameForm").val();
        params["description"] = $("#descriptionForm").val();
        params["startTime"] = $("#dateStartForm").val().replace(" ",'T');;
        params["endTime"] = $("#dateEndForm").val().replace(" ",'T');;
        params["loadFile"] = ($("#fileForm").val()==0) ? null : {"id":parseInt($("#fileForm").val())};
        params["module"] = ($("#moduleForm").val()==0) ? null : {"id":parseInt($("#moduleForm").val())};
        params["period"] = $("#periodForm").val();
        params["frequency"] = $("#frequencyForm").val();
        params["required"] = ($('#requiredForm').prop('checked')) ? 1 : 0;
        params["active"] = $('#activeForm').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateForm").val();
        }
        else
        {
            params["active"] = true;
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsSection = function getParamsSection(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameSection").val();
        params["description"] = $("#descriptionSection").val();
        params["startTime"] = $("#dateStartSection").val().replace(" ",'T');
        params["endTime"] = $("#dateEndSection").val().replace(" ",'T');
        params["form"] = ($("#formSection").val()==0) ? null : {"id":parseInt($("#formSection").val())};
        params["active"] = $('#activeSection').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateSection").val();
        }
        else
        {
            params["active"] = true;
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsModule = function getParamsModule(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameModule").val();
        params["description"] = $("#descriptionModule").val();
        params["startTime"] = $("#dateStartModule").val()//.replace(" ",'T');;
        params["endTime"] = $("#dateEndModule").val()//.replace(" ",'T');;
        params["parent"] = ($("#parentModule").val()==0) ? null : {"id":parseInt($("#parentModule").val())};
        params["required"] = ($('#requiredModule').prop('checked')) ? 1 : 0;
        params["orderBy"] = parseInt($("#orderByModule").val());
        params["active"] = $('#activeModule').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateModule").val();
        }
        else
        {
            params["active"] = true;
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getModuleRole = function getModuleRole(id)
    {
        return $http.get(MODULE_ROLE_SERVICE+"?type=m&id="+id).success(function(data)
        {
            console.log("Modulos Rol");
            console.log(data["active"]["data"]);
            console.log(data["inactive"]["data"]);
            var aux = [];
            for(var i=0;i<data["active"]["data"].length;++i)
                aux.push(data["active"]["data"][i]["role"]);
            $scope.infoModule["roles-active"] = aux;
            var aux2 = [];
            for(var i=0;i<data["inactive"]["data"].length;++i)
                aux2.push(data["inactive"]["data"][i]["role"]);
            $scope.infoModule["roles-inactive"] = aux2;
            return true;
            //alert(data["data"].length)
        }).error(function(data, status)
        {
            console.log(data);
            return false;
        });
    }

    $scope.getUserForm = function getUserForm(id)
    {
        return $http.get(USER_FORM_SERVICE+"?type=f&id="+id).success(function(data)
        {
            console.log("Users Form a");
            console.log(data["data"]);
            $scope.infoForm["users"] = data["data"]
            if($scope.infoForm["users"].length>0)
                $scope.infoUserComposite = $scope.infoForm["users"][0];
            return true;
            //alert(data["data"].length)
        }).error(function(data, status)
        {
            console.log(data);
            return false;
        });
    }

    $scope.getObjectForm = function getObjectForm(id)
    {
        return $http.get(OBJECT_FORM_SERVICE+"?type=f&id="+id).success(function(data)
        {
            console.log("Objects Form");
            console.log(data["data"]);
            $scope.infoForm["objects"] = data["data"];
            if($scope.infoForm["objects"].length>0)
                $scope.infoObjectComposite = $scope.infoForm["objects"][0];
            return true;

        }).error(function(data, status)
        {
            console.log(data);
            return false;
        });
    }

    $scope.getTerritoryForm = function getTerritoryForm(id)
    {
        return $http.get(TERRITORY_FORM_SERVICE+"?type=f&id="+id).success(function(data)
        {
            console.log("Territorios Form");
            console.log(data["data"]);
            $scope.infoForm["territories"] = data["data"]
            if($scope.infoForm["territories"].length>0)
                $scope.infoTerritoryComposite = $scope.infoForm["territories"][0];
            return true;
            //alert(data["data"].length)
        }).error(function(data, status)
        {
            console.log(data);
            return false;
        });
    }

    $scope.getSiteForm = function getSiteForm(id)
    {
        return $http.get(SITE_FORM_SERVICE+"?type=f&id="+id).success(function(data)
        {
            console.log("Sites Form");
            console.log(data["data"]);
            $scope.infoForm["sites"] = data["data"]
            if($scope.infoForm["sites"].length>0)
                $scope.infoSiteComposite = $scope.infoForm["sites"][0];
            return true;
            //alert(data["data"].length)
        }).error(function(data, status)
        {
            console.log(data);
            return false;
        });
    }

    $scope.getRoleForm = function getRoleForm(id)
    {
        return $http.get(ROLE_FORM_SERVICE+"?type=f&id="+id).success(function(data)
        {
            console.log("Roles Form");
            console.log(data["data"]);
            $scope.infoForm["roles"] = data["data"]
            if($scope.infoForm["roles"].length>0)
                $scope.infoRoleComposite = $scope.infoForm["roles"][0];
            return true;
            //alert(data["data"].length)
        }).error(function(data, status)
        {
            console.log(data);
            return false;
        });
    }

    $scope.initModule = function initModule()
    {
        $scope.type = MODULE;
        $scope.getModules();
        $scope.getRoles();
    }

    $scope.initForms = function initForms()
    {
        $scope.type = FORM;
        $scope.getForms();
        $scope.getModules();
        $scope.getTerritories();
        $scope.getInterestSites();
        $scope.getSections();
        $scope.getUsers();
        $scope.getObjects();
        $scope.getFiles();
        $scope.getObjectTypes();
        $scope.getRoles();
    }

    $scope.initSection = function initSection()
    {
        $scope.type = SECTION;
        $scope.getSections();
        $scope.getForms();
    }

    $scope.getModules= function getModules()
    {
        $http.get(MODULE_SERVICE).success(function(data)
        {
            console.log("Modulos");
            console.log(data["data"]);
            $scope.allModules = data["data"];
            if($scope.type==MODULE)
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allModules});

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

    $scope.getSections =  function getSections()
    {
        $http.get(SECTION_SERVICE).success(function(data)
        {
            console.log("Secciones");
            console.log(data["data"]);
            if($scope.type==SECTION)
            {
                $scope.allSections = data["data"];
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allSections});
            }
            else
                $scope.allSections = addStateNotActive(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }


    $scope.editModal= function editModal(id)
    {
        $scope.editing=true;
        if($scope.type == MODULE)
        {
            $scope.infoModule = JSON.parse(JSON.stringify($scope.getById($scope.allModules,id)));
            $scope.infoModule["createdAt"] = getDate($scope.infoModule["createdAt"]);
            $scope.infoModule["required"] = ($scope.infoModule["required"]==1)
            $scope.getModuleRole(id).then(
                function(response){
                    $scope.leftOptionsRoles = addStateNotActive(complement($scope.allRoles,$scope.infoModule["roles-active"]),$scope.infoModule["roles-inactive"]);
                    setOptions("multiselectRoles",$scope.leftOptionsRoles,"name");
                    $scope.rightOptionsRoles = addStateActive($scope.infoModule["roles-active"]);
                    setOptions("multiselectRoles_to",$scope.rightOptionsRoles,"name");
                    $scope.allRoles = $scope.leftOptionsRoles.concat($scope.rightOptionsRoles);
            })
        }
        else if($scope.type == FORM)
        {
            $scope.infoForm = JSON.parse(JSON.stringify($scope.getById($scope.allForms,id)));
            $scope.infoForm["startTime"] = getDate($scope.infoForm["startTime"]);
            $scope.infoForm["endTime"] = getDate($scope.infoForm["endTime"]);
            $scope.infoForm["createdAt"] = getDate($scope.infoForm["createdAt"]);
            $scope.getUserForm(id).then(
                function(response){}
            )
            $scope.getSiteForm(id).then(
                function(response){}
            )
            $scope.getTerritoryForm(id).then(
                function(response){}
            )
            $scope.getObjectForm(id).then(
                function(response){}
            )
            $scope.getRoleForm(id).then(
                function(response){}
            )

        }
        else if($scope.type == SECTION)
        {
            $scope.infoSection = JSON.parse( JSON.stringify($scope.getById($scope.allSections,id)));
            $scope.infoSection.startTime = $scope.infoSection.startTime.replace('T',' ');
            $scope.infoSection.endTime = $scope.infoSection.endTime.replace('T',' ');
            $scope.infoSection.createdAt = $scope.infoSection.createdAt.replace('T',' ');
        }
    }

    $scope.addModal = function addModal()
    {
        $scope.editing=false;
        $scope.infoModule = JSON.parse( JSON.stringify(templateModule));
        $scope.infoForm = JSON.parse( JSON.stringify(templateForm));
        $scope.infoSection = JSON.parse( JSON.stringify(templateSection));

        if($scope.type == MODULE)
        {
            $scope.leftOptionsRoles = $scope.allRoles;
            setOptions("multiselectRoles",$scope.leftOptionsRoles,"name");
            $scope.rightOptionsRoles = [];
            setOptions("multiselectRoles_to",$scope.rightOptionsRoles,"name");
        }
    }

    $scope.addModule = function addModule()
    {
        var params = $scope.getParamsModule();
        console.log("MULTISELECT RIGHT");
        params["roles"] = getAdded(getSubsetByIds($scope.allRoles,getOptionsRight("multiselectRoles")));
        $scope.insert(MODULE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getModules);
        })
    }

    $scope.editModule = function editModule(id)
    {
        var params = $scope.getParamsModule(id);
        console.log("MULTISELECT RIGHT");
        console.log(getAdded(getSubsetByIds($scope.allRoles,getOptionsRight("multiselectRoles"))));
        params["roles-add"] = getAdded(getSubsetByIds($scope.allRoles,getOptionsRight("multiselectRoles")));
        console.log("MULTISELECT RIGHT 2");
        console.log(getReAdded(getSubsetByIds($scope.allRoles,getOptionsRight("multiselectRoles"))));
        params["roles-re-add"] = getReAdded(getSubsetByIds($scope.allRoles,getOptionsRight("multiselectRoles")));
        console.log("MULTISELECT LEFT");
        console.log(getRemoved(getSubsetByIds($scope.allRoles,getOptionsLeft("multiselectRoles"))));
        params["roles-remove"] = getRemoved(getSubsetByIds($scope.allRoles,getOptionsLeft("multiselectRoles")));
        $scope.update(MODULE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getModules);
        })
    }

    $scope.addSection = function addSection()
    {
        var params = $scope.getParamsSection();
        $scope.insert(SECTION_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getSections);
        })
    }

    $scope.editSection = function editSection(id)
    {
        var params = $scope.getParamsSection(id);
        $scope.update(SECTION_SERVICE,params).then(
            function(response)
            {
                data = response.data;
                $scope.getSections();
                if(data["error"])
                    toastr["error"](data["message"]);
                else
                    toastr["success"](data["message"]);
                $('#modalEdition').modal('toggle');
            }
       )
    }

    $scope.addForm = function addForm()
    {
        var params = $scope.getParamsForm();
        $scope.insert(FORM_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getForms);
        })
    }

    $scope.editForm = function editForm(id)
    {
        var params = $scope.getParamsForm(id);
        $scope.update(FORM_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getForms);
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
