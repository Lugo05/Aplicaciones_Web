var myApp = angular.module('Admin');

var USER_SERVICE = "/user/user/";
var FORM_SERVICE  = "/modules/form/";
var ROLE_SERVICE = "/user/role/";
var JOB_SERVICE = "/user/job/";
var GROUP_SERVICE = "/user/group/";
var HIERARCHY_SERVICE = "/user/hierarchy/";
var PERMISSION_SERVICE = "/user/permission/";

var MODULE_ROLE_SERVICE = "/composite/module-role/"
var ROLE_PERMISSION_SERVICE = "/composite/role-permission/"
var USER_ROLE_SERVICE = "/composite/user-role/"
var USER_GROUP_SERVICE = "/composite/user-group/"
var USER_FORM_SERVICE = "/composite/user-form/"
var USER_DEVICE_SERVICE = "/composite/user-device/"

var DEVICE_SERVICE = "/devices/device/";
var MODULE_SERVICE = "/modules/module/";

var ROLE = 0;
var HIERARCHY = 1;
var USER = 2;
var GROUP = 3;
var JOB = 4;
var PERMISSION = 5;
var language = {};


myApp.controller('UserController',['$rootScope','$scope','$http','$location','$timeout','NgTableParams',function($rootScope, $scope,$http,$location,$timeout,NgTableParams){
    var templateUser = {
        "id":0,
        "username":"",
        "password":"",
        "confirmPassword":"",
        "name":"",
        "firstName":"",
        "lastName":"",
        "gender":"",
        "age":0,
        "superior":0,
        "email":"",
        "job":0,
        "hierarchy":0,
        "active":true,
        "createdAt":"",
        "file":1,
        "updatedAt":""
    };

    var templateRole = {
        "id":0,
        "name":"",
        "description":"",
        "updatedAt":"",
        "createdAt":"",
        "active":true,
    };

    var templateGroup = {
        "id":0,
        "name":"",
        "createdAt":"",
        "active":true,
    };

    var templateHierarchy = {
        "id":0,
        "name":"",
        "description":"",
        "parent":0,
        "createdAt":"",
        "active":true,
    };

    var templateJob = {
        "id":0,
        "name":"",
        "description":"",
        "createdAt":"",
        "active":true,
    };

    var templatePermission = {
        "id":0,
        "name":"",
        "createdAt":"",
        "active":true,
    };

    $scope.editing = false;
    $scope.type = 0;

    $scope.infoUser = templateUser;
    $scope.infoHierarchy = {};
    $scope.infoRole = templateRole;
    $scope.infoGroup = {};
    $scope.infoJob = {};
    $scope.infoPermission = {};

    $scope.leftOptionsForms = [];
    $scope.rightOptionsForms = [];
    $scope.leftOptionsRoles = [];
    $scope.rightOptionsRoles = [];
    $scope.leftOptionsDevices = [];
    $scope.rightOptionsDevices = [];
    $scope.leftOptionsGroups = [];
    $scope.rightOptionsGroups = [];
    $scope.id;

    $scope.allHierarchies = [];
    $scope.allRoles = [];
    $scope.allGroups = [];
    $scope.allForms = [];
    $scope.allUsers = [];
    $scope.allDevices = [];
    $scope.allModules = [];
    $scope.allJobs = [];
    $scope.allPermissions = [];

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
        $scope.infoFormComposite["users"] = $scope.infoUser.id;
        $scope.infoFormComposite["startTime"] = $("#dateStartFormComposite").val();
        $scope.infoFormComposite["endTime"] = $("#dateEndFormComposite").val();
        $scope.insert(USER_FORM_SERVICE,$scope.infoFormComposite).then(
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
        $scope.update(USER_FORM_SERVICE,$scope.infoFormComposite).then(
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

    $scope.getForms = function getForms()
    {
        $http.get(FORM_SERVICE).success(function(data)
        {
            console.log("Forms");
            $scope.allForms = data["data"];
            console.log($scope.allForms);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getDevices = function getDevices()
    {
        $http.get(DEVICE_SERVICE).success(function(data)
        {
            console.log("Devices");
            $scope.allDevices = addStateNotActive(data["data"]);
            console.log($scope.allDevices);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getModules= function getModules()
    {
        $http.get(MODULE_SERVICE).success(function(data)
        {
            console.log("Modulos");
            console.log(data["data"]);
            $scope.allModules = addStateNotActive(data["data"]);


	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getParamsHierarchy = function getParamsHierarchy(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameHierarchy").val();
        params["description"] = $("#descriptionHierarchy").val();
        params["parent"] =($("#parentHierarchy").val()==0) ? null : {"id":parseInt($("#parentHierarchy").val())};
        params["active"] = $('#activeHierarchy').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateHierarchy").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsRole = function getParamsRole(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameRole").val();
        params["description"] = $("#descriptionRole").val();
        params["active"] = $('#activeRole').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateRole").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsPermission = function getParamsPermission(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#namePermission").val();
        params["active"] = $('#activePermission').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDatePermission").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsJob = function getParamsJob(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameJob").val();
        params["description"] = $("#descriptionJob").val();
        params["active"] = $('#activeJob').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateJob").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsGroup = function getParamsGroup(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameGroup").val();
        params["active"] = $('#activeGroup').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateGroup").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsUser = function getParamsUser(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameUser").val();
        params["username"] = $("#usernameUser").val();
        params["password"] = $("#passwordUser").val();
        params["firstName"] = ($("#firstNameUser").val()=="") ? null : $("#firstNameUser").val();
        params["lastName"] = ($("#lastNameUser").val()=="") ? null : $("#lastNameUser").val();
        params["gender"] = ($("#genderUser").val()=="") ? null : $("#genderUser").val();
        params["age"] = (parseInt($("#ageUser").val())==0) ? null : parseInt($("#ageUser").val());
        params["superior"] = ($("#superiorUser").val()==0) ? null : {"id":parseInt($("#superiorUser").val())};
        params["job"] = ($("#jobUser").val()==0) ? null : {"id":parseInt($("#jobUser").val())};
        params["hierarchy"] = ($("#hierarchyUser").val()==0) ? null: {"id":parseInt($("#hierarchyUser").val())};
        params["active"] = $('#activeUser').prop('checked');
        params["email"] = $("#emailUser").val();
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateUser").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getUserForm = function getUserForm(id)
    {
        return $http.get(USER_FORM_SERVICE+"?type=u&id="+id).success(function(data)
        {
            console.log("Users Form a");
            console.log(data["data"]);
            $scope.infoForm = data["data"]
            if($scope.infoForm.length > 0)
            {
                $scope.infoFormComposite = $scope.infoForm[0];
            }
            return true;
            //alert(data["data"].length)
        }).error(function(data, status)
        {
            console.log(data);
            return false;
        });
    }

    $scope.getModuleRole = function getModuleRole(id)
    {
        return $http.get(MODULE_ROLE_SERVICE+"?type=r&id="+id).success(function(data)
        {
            console.log("Modulos Rol");
            console.log(data["active"]["data"]);
            console.log(data["inactive"]["data"]);
            var aux = [];
            for(var i=0;i<data["active"]["data"].length;++i)
                aux.push(data["active"]["data"][i]["module"]);
            $scope.infoRole["modules-active"] = aux;
            var aux2 = [];
            for(var i=0;i<data["inactive"]["data"].length;++i)
                aux2.push(data["inactive"]["data"][i]["module"]);
            $scope.infoRole["modules-inactive"] = aux2;
            return true;
            //alert(data["data"].length)
        }).error(function(data, status)
        {
            console.log(data);
            return false;
        });
    }

    $scope.getRolePermission = function getRolePermission(id)
    {
        var type = ($scope.type == ROLE) ? "r" : "p";
        return $http.get(ROLE_PERMISSION_SERVICE+"?type="+type+"&id="+id).success(function(data)
        {
            console.log("Permission Role");
            console.log(data["active"]["data"]);
            console.log(data["inactive"]["data"]);
            var aux = [];
            for(var i=0;i<data["active"]["data"].length;++i)
            {
                if($scope.type==ROLE)
                    aux.push(data["active"]["data"][i]["permission"]);
                else
                    aux.push(data["active"]["data"][i]["role"]);
            }
            if($scope.type==ROLE)
                $scope.infoRole["permissions-active"] = aux;
            else
                $scope.infoPermission["roles-active"] = aux;
            var aux2 = [];
            for(var i=0;i<data["inactive"]["data"].length;++i)
            {
                if($scope.type==ROLE)
                    aux2.push(data["inactive"]["data"][i]["group"]);
                else
                    aux2.push(data["inactive"]["data"][i]["role"]);
            }
            if($scope.type==ROLE)
                $scope.infoRole["permission-inactive"] = aux2;
            else
                $scope.infoPermission["roles-active"] = aux2;
            return true;
            //alert(data["data"].length)
        }).error(function(data, status)
        {
            console.log(data);
            return false;
        });
    }

    $scope.getUserGroup = function getUserGroup(id)
    {
        var type = ($scope.type == USER) ? "u" : "g";
        return $http.get(USER_GROUP_SERVICE+"?type="+type+"&id="+id).success(function(data)
        {
            console.log("Grupos Users");
            console.log(data["active"]["data"]);
            console.log(data["inactive"]["data"]);
            var aux = [];
            for(var i=0;i<data["active"]["data"].length;++i)
            {
                if($scope.type==USER)
                    aux.push(data["active"]["data"][i]["group"]);
                else
                    aux.push(data["active"]["data"][i]["users"]);
            }
            if($scope.type==USER)
                $scope.infoUser["groups-active"] = aux;
            else
                $scope.infoGroup["users-active"] = aux;
            var aux2 = [];
            for(var i=0;i<data["inactive"]["data"].length;++i)
            {
                if($scope.type==USER)
                    aux2.push(data["inactive"]["data"][i]["group"]);
                else
                    aux2.push(data["inactive"]["data"][i]["users"]);
            }
            if($scope.type==USER)
                $scope.infoUser["groups-inactive"] = aux2;
            else
                $scope.infoGroup["users-active"] = aux2;
            return true;
            //alert(data["data"].length)
        }).error(function(data, status)
        {
            console.log(data);
            return false;
        });
    }

    $scope.getUserRole = function getUserRole(id)
    {
        return $http.get(USER_ROLE_SERVICE+"?type=u&id="+id).success(function(data)
        {
            console.log("Role Users");
            console.log(data["active"]["data"]);
            console.log(data["inactive"]["data"]);
            var aux = [];
            for(var i=0;i<data["active"]["data"].length;++i)
                aux.push(data["active"]["data"][i]["user"]);
            $scope.infoRole["users-active"] = aux;
            var aux2 = [];
            for(var i=0;i<data["inactive"]["data"].length;++i)
                aux2.push(data["inactive"]["data"][i]["user"]);
            $scope.infoRole["users-inactive"] = aux2;
            return true;
            //alert(data["data"].length)
        }).error(function(data, status)
        {
            console.log(data);
            return false;
        });
    }

    $scope.getUserDevice = function getUserDevice(id)
    {
        return $http.get(USER_DEVICE_SERVICE+"?type=u&id="+id).success(function(data)
        {
            console.log("Device Users");
            console.log(data["active"]["data"]);
            console.log(data["inactive"]["data"]);
            var aux = [];
            for(var i=0;i<data["active"]["data"].length;++i)
                aux.push(data["active"]["data"][i]["device"]);
            $scope.infoUser["devices-active"] = aux;
            var aux2 = [];
            for(var i=0;i<data["inactive"]["data"].length;++i)
                aux2.push(data["inactive"]["data"][i]["device"]);
            $scope.infoUser["devices-inactive"] = aux2;
            return true;
            //alert(data["data"].length)
        }).error(function(data, status)
        {
            console.log(data);
            return false;
        });
    }

    $scope.initUsers = function initUsers()
    {
        $scope.type = USER;
        $scope.getUsers();
        $scope.getJobs();
        $scope.getGroups();
        $scope.getForms();
        $scope.getHierarchies();
        $scope.getRoles();
        $scope.getDevices();
    }

    $scope.initHierarchies = function initHierarchies()
    {
        $scope.type = HIERARCHY;
        $scope.getHierarchies();
    }

    $scope.initPermissions = function initPermissions()
    {
        $scope.type = PERMISSION;
        $scope.getPermissions();
    }

    $scope.initGroups = function initGroups()
    {
        $scope.type = GROUP;
        $scope.getGroups();
        $scope.getUsers();
    }

    $scope.initJobs = function initJobs()
    {
        $scope.type = JOB;
        $scope.getJobs();
    }

    $scope.initRoles = function initRoles()
    {
        $scope.type = ROLE;
        $scope.getRoles();
        $scope.getPermissions();
        $scope.getUsers();
        $scope.getModules();
    }

    $scope.getUsers= function getUsers()
    {
        $http.get(USER_SERVICE).success(function(data)
        {
            console.log(("Usuarios"));
            console.log(data["data"]);
            if($scope.type==USER)
            {
                $scope.allUsers = data["data"];
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allUsers});
            }
            else
                $scope.allUsers = addStateNotActive(data["data"]);
            //alert(data["data"].length)
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getHierarchies = function getHierarchies()
    {
        $http.get(HIERARCHY_SERVICE).success(function(data)
        {
            console.log("Jerarquias")
            console.log(data["data"]);
            $scope.allHierarchies = data["data"];
            if($scope.type==HIERARCHY)
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allHierarchies});
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getPermissions = function getPermissions()
    {
        $http.get(PERMISSION_SERVICE).success(function(data)
        {
            console.log("Permisos")
            console.log(data["data"]);
            if($scope.type==PERMISSION)
            {
                $scope.allPermissions = data["data"];
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allPermissions});
            }
            else
            {
                $scope.allPermissions = addStateNotActive(data["data"]);
            }
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
            {
                $scope.allRoles = data["data"];
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allRoles});
            }
            else
                $scope.allRoles = addStateNotActive(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getJobs =  function getJobs()
    {
        $http.get(JOB_SERVICE).success(function(data)
        {
            console.log(("Jobs"));
            console.log(data["data"]);
            $scope.allJobs = data["data"];
            if($scope.type==JOB)
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allJobs});
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getGroups =  function getGroups()
    {
        $http.get(GROUP_SERVICE).success(function(data)
        {
            console.log(("Grupos"));
            console.log(data["data"]);
            $scope.allGroups = data["data"];
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }


    $scope.editModal= function editModal(id)
    {
        $scope.editing=true;
        if($scope.type == USER)
        {
            $scope.infoUser = JSON.parse( JSON.stringify($scope.getById($scope.allUsers,id)));
            $scope.infoUser["createdAt"] = getDate($scope.infoUser["createdAt"]);

            $scope.leftOptionsRoles = addStateNotActive(complement($scope.allRoles,$scope.infoUser["roles"]),[]);
            setOptions("multiselectRoles",$scope.leftOptionsRoles,"name");
            $scope.rightOptionsRoles = addStateActive($scope.infoUser["roles"]);
            setOptions("multiselectRoles_to",$scope.rightOptionsRoles,"name");
            $scope.allRoles = $scope.leftOptionsRoles.concat($scope.rightOptionsRoles);

            $scope.getUserDevice(id).then(
                function(response){
                    $scope.leftOptionsDevices = addStateNotActive(complement($scope.allDevices,$scope.infoUser["devices-active"]),$scope.infoUser["devices-inactive"]);
                    setOptions("multiselectDevices",$scope.leftOptionsDevices,"uuid");
                    $scope.rightOptionsDevices = addStateActive($scope.infoUser["devices-active"]);
                    setOptions("multiselectDevices_to",$scope.rightOptionsDevices,"uuid");
                    $scope.allDevices = $scope.leftOptionsDevices.concat($scope.rightOptionsDevices);
            });

            $scope.getUserGroup(id).then(
                function(response){
                    $scope.leftOptionsGroups = addStateNotActive(complement($scope.allGroups,$scope.infoUser["groups-active"]),$scope.infoUser["groups-inactive"]);
                    setOptions("multiselectGroups",$scope.leftOptionsGroups,"name");
                    $scope.rightOptionsGroups = addStateActive($scope.infoUser["groups-active"]);
                    setOptions("multiselectGroups_to",$scope.rightOptionsGroups,"name");
                    $scope.allGroups = $scope.leftOptionsGroups.concat($scope.rightOptionsGroups);
            });

            $scope.getUserForm($scope.infoUser.id);
        }
        else if($scope.type == HIERARCHY)
        {
            $scope.infoHierarchy = JSON.parse( JSON.stringify($scope.getById($scope.allHierarchies,id)));
            $scope.infoHierarchy["createdAt"] = getDate($scope.infoHierarchy["createdAt"]);
        }
        else if($scope.type == ROLE)
        {
            $scope.infoRole = JSON.parse( JSON.stringify($scope.getById($scope.allRoles,id)));
            $scope.infoRole["createdAt"] = getDate($scope.infoRole["createdAt"]);

            $scope.getRolePermission(id).then(
                function(response){
                    $scope.leftOptionsPermissions = addStateNotActive(complement($scope.allPermissions,$scope.infoRole["permissions-active"]),$scope.infoRole["permissions-inactive"]);
                    setOptions("multiselectPermissions",$scope.leftOptionsPermissions,"name");
                    $scope.rightOptionsPermissions = addStateActive($scope.infoRole["permissions-active"]);
                    setOptions("multiselectPermissions_to",$scope.rightOptionsPermissions,"name");
                    $scope.allPermissions = $scope.leftOptionsPermissions.concat($scope.rightOptionsPermissions);
            });
            $scope.getUserRole(id).then(
                function(response){
                    $scope.leftOptionsUsers = addStateNotActive(complement($scope.allUsers,$scope.infoRole["users-active"]),$scope.infoRole["users-inactive"]);
                    setOptions("multiselectUsers",$scope.leftOptionsUsers,"username");
                    $scope.rightOptionsUsers = addStateActive($scope.infoRole["users-active"]);
                    setOptions("multiselectUsers_to",$scope.rightOptionsUsers,"username");
                    $scope.allUsers = $scope.leftOptionsUsers.concat($scope.rightOptionsUsers);
            });
            $scope.getModuleRole(id).then(
                function(response){
                    $scope.leftOptionsModules = addStateNotActive(complement($scope.allModules,$scope.infoRole["modules-active"]),$scope.infoRole["modules-inactive"]);
                    setOptions("multiselectModules",$scope.leftOptionsModules,"name");
                    $scope.rightOptionsModules = addStateActive($scope.infoRole["modules-active"]);
                    setOptions("multiselectModules_to",$scope.rightOptionsModules,"name");
                    $scope.allModules = $scope.leftOptionsModules.concat($scope.rightOptionsModules);
            });
        }
        else if($scope.type == GROUP)
        {
            $scope.infoGroup = JSON.parse( JSON.stringify($scope.getById($scope.allGroups,id)));
            $scope.infoGroup["createdAt"] = getDate($scope.infoGroup["createdAt"]);
            $scope.getModuleRole(id).then(
                function(response){
                    $scope.leftOptionsUsers = addStateNotActive(complement($scope.allUsers,$scope.infoGroup["users-active"]),$scope.infoGroup["users-inactive"]);
                    setOptions("multiselectUsers",$scope.leftOptionsUsers,"username");
                    $scope.rightOptionsUsers = addStateActive($scope.infoGroup["users-active"]);
                    setOptions("multiselectUsers_to",$scope.rightOptionsUsers,"username");
                    $scope.allUsers = $scope.leftOptionsUsers.concat($scope.rightOptionsUsers);
            });
        }
        else if($scope.type == JOB)
        {
            $scope.infoJob = JSON.parse( JSON.stringify($scope.getById($scope.allJobs,id)));
            $scope.infoJob["createdAt"] = getDate($scope.infoJob["createdAt"]);
        }
        else if($scope.type == PERMISSION)
        {
            $scope.infoPermission = JSON.parse( JSON.stringify($scope.getById($scope.allPermissions,id)));
            $scope.infoPermission["createdAt"] = getDate($scope.infoPermission["createdAt"]);
            $scope.getRolePermission(id).then(
                function(response){
                    $scope.leftOptionsRoles = addStateNotActive(complement($scope.allRoles,$scope.infoPermission["roles-active"]),$scope.infoPermission["roles-inactive"]);
                    setOptions("multiselectRoles",$scope.leftOptionsRoles,"name");
                    $scope.rightOptionsRoles = addStateActive($scope.infoPermission["roles-active"]);
                    setOptions("multiselectRoles_to",$scope.rightOptionsRoles,"name");
                    $scope.allRoles = $scope.leftOptionsRoles.concat($scope.rightOptionsRoles);
            });
        }
    }

    $scope.addModal = function addModal()
    {
        $scope.editing=false;
        $scope.infoUser = JSON.parse( JSON.stringify(templateUser));
        $scope.infoHierarchy = JSON.parse( JSON.stringify(templateHierarchy));
        $scope.infoRole = JSON.parse( JSON.stringify(templateRole));
        $scope.infoGroup = JSON.parse( JSON.stringify(templateGroup));
        $scope.infoJob = JSON.parse( JSON.stringify(templateJob));
        $scope.infoPermission = JSON.parse( JSON.stringify(templatePermission));

        $scope.leftOptionsRoles = $scope.allRoles;
        setOptions("multiselectRoles",$scope.leftOptionsRoles,"name");
        $scope.rightOptionsRoles = [];
        setOptions("multiselectRoles_to",$scope.rightOptionsRoles,"name");

        $scope.leftOptionsPermissions = $scope.allPermissions;
        setOptions("multiselectPermissions",$scope.leftOptionsPermissions,"name");
        $scope.rightOptionsPermissions = [];
        setOptions("multiselectPermissions_to",$scope.rightOptionsPermissions,"name");

        $scope.leftOptionsGroups = $scope.allGroups;
        setOptions("multiselectGroups",$scope.leftOptionsGroups,"name");
        $scope.rightOptionsGroups = [];
        setOptions("multiselectGroups_to",$scope.rightOptionsGroups,"name");

        $scope.leftOptionsDevices = $scope.allDevices;
        setOptions("multiselectDevices",$scope.leftOptionsDevices,"uuid");
        $scope.rightOptionsDevices = [];
        setOptions("multiselectDevices_to",$scope.rightOptionsDevices,"uuid");

        $scope.leftOptionsUsers = $scope.allUsers;
        setOptions("multiselectUsers",$scope.leftOptionsUsers,"username");
        $scope.rightOptionsUsers = [];
        setOptions("multiselectUsers_to",$scope.rightOptionsUsers,"username");

        $scope.leftOptionsModules = $scope.allModules;
        setOptions("multiselectModules",$scope.leftOptionsModules,"name");
        $scope.rightOptionsModules = [];
        setOptions("multiselectModules_to",$scope.rightOptionsModules,"name");
    }

    $scope.addUser = function addUser()
    {
        var params = $scope.getParamsUser();

        //console.log("MULTISELECT RIGHT");
        var aux2 = getAdded(getSubsetByIds($scope.allRoles,getOptionsRight("multiselectRoles")));
        var aux=[];
        for(var i=0;i<aux2.length;++i)
            aux.push({"id": aux2[i]["id"],"name":aux2[i]["name"]});
        params["roles"]= aux;
        //console.log("MULTISELECT RIGHT");
        params["groups"]=getAdded(getSubsetByIds($scope.allGroups,getOptionsRight("multiselectGroups")));
        //console.log("MULTISELECT RIGHT");
        params["devices"] = getAdded(getSubsetByIds($scope.allDevices,getOptionsRight("multiselectDevices")));
        $scope.insert(USER_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getUsers);
        })
    }

    $scope.editUser = function editUser(id)
    {
        var params = $scope.getParamsUser(id);
        params["password"] = "       ";
        /*console.log("MULTISELECT LEFT");
        console.log(getRemoved(getSubsetByIds($scope.allRoles,getOptionsLeft("multiselectRoles"))));*/

        params["groups-remove"] = getRemoved(getSubsetByIds($scope.allGroups,getOptionsLeft("multiselectGroups")));
        params["devices-remove"] = getRemoved(getSubsetByIds($scope.allDevices,getOptionsLeft("multiselectDevices")));

        var aux2= getSubsetByIds($scope.allRoles,getOptionsRight("multiselectRoles"));
        var aux=[];
        for(var i=0;i<aux2.length;++i)
            aux.push({"id": aux2[i]["id"],"name":aux2[i]["name"]});
        params["roles"]= aux;

        params["groups-add"]=getAdded(getSubsetByIds($scope.allGroups,getOptionsRight("multiselectGroups")));
        params["devices-add"]=getAdded(getSubsetByIds($scope.allDevices,getOptionsRight("multiselectDevices")));

        params["groups-re-add"] = getReAdded(getSubsetByIds($scope.allGroups,getOptionsRight("multiselectGroups")));
        params["devices-re-add"] = getReAdded(getSubsetByIds($scope.allDevices,getOptionsRight("multiselectDevices")));

        $scope.update(USER_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getUsers);
        })

    }

    $scope.addPermission = function addPermission()
    {
        var params = $scope.getParamsPermission();
        params["roles"] = getAdded(getSubsetByIds($scope.allRoles,getOptionsRight("multiselectRoles")));
        $scope.insert(PERMISSION_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getPermissions);
        })
    }

    $scope.editPermission = function editPermission(id)
    {
        var params = $scope.getParamsPermission(id);
        params["roles-add"] = getAdded(getSubsetByIds($scope.allRoles,getOptionsRight("multiselectRoles")));
        params["roles-re-add"] = getReAdded(getSubsetByIds($scope.allRoles,getOptionsRight("multiselectRoles")));
        params["roles-remove"] = getRemoved(getSubsetByIds($scope.allRoles,getOptionsLeft("multiselectRoles")));
        $scope.update(PERMISSION_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getPermissions);
        })
    }

    $scope.addRole = function addRole()
    {
        var params = $scope.getParamsRole();
        params["users"] = []//getAdded(getSubsetByIds($scope.allUsers,getOptionsRight("multiselectUsers")));
        params["permissions"] = getAdded(getSubsetByIds($scope.allPermissions,getOptionsRight("multiselectPermissions")));
        params["modules"] = getAdded(getSubsetByIds($scope.allModules,getOptionsRight("multiselectModules")));
        console.log(params);
        console.log($scope.allPermissions);
        console.log(getOptionsRight("multiselectPermissions"));
        $scope.insert(ROLE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getRoles);
        })
    }

    $scope.editRole = function editRole(id)
    {
        var params = $scope.getParamsRole(id);
        params["users-add"] = []//getAdded(getSubsetByIds($scope.allUsers,getOptionsRight("multiselectUsers")));
        params["users-re-add"] = []//getReAdded(getSubsetByIds($scope.allUsers,getOptionsRight("multiselectUsers")));
        params["users-remove"] = []//getRemoved(getSubsetByIds($scope.allUsers,getOptionsLeft("multiselectUsers")));

        params["permissions-add"] = getAdded(getSubsetByIds($scope.allPermissions,getOptionsRight("multiselectPermissions")));
        params["permissions-re-add"] = getReAdded(getSubsetByIds($scope.allPermissions,getOptionsRight("multiselectPermissions")));
        params["permissions-remove"] = getRemoved(getSubsetByIds($scope.allPermissions,getOptionsLeft("multiselectPermissions")));

        params["modules-add"] = getAdded(getSubsetByIds($scope.allModules,getOptionsRight("multiselectModules")));
        params["modules-re-add"] = getReAdded(getSubsetByIds($scope.allModules,getOptionsRight("multiselectModules")));
        params["modules-remove"] = getRemoved(getSubsetByIds($scope.allModules,getOptionsLeft("multiselectModules")));

        $scope.update(ROLE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getRoles);
        })
    }

    $scope.addJob = function addJob()
    {
        var params = $scope.getParamsJob();
        $scope.insert(JOB_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getJobs);
        })
    }

    $scope.editJob = function editJob(id)
    {
        var params = $scope.getParamsJob(id);
        $scope.update(JOB_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getJobs);
        })
    }

    $scope.addGroup = function addGroup()
    {
        var params = $scope.getParamsGroup();
        params["users"] = getAdded(getSubsetByIds($scope.allUsers,getOptionsRight("multiselectUsers")));
        $scope.insert(GROUP_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getGroups);
        })
    }

    $scope.editGroup = function editGroup(id)
    {
        var params = $scope.getParamsGroup(id);
        params["users-add"] = getAdded(getSubsetByIds($scope.allUsers,getOptionsRight("multiselectUsers")));
        params["users-re-add"] = getReAdded(getSubsetByIds($scope.allUsers,getOptionsRight("multiselectUsers")));
        params["users-remove"] = getRemoved(getSubsetByIds($scope.allUsers,getOptionsLeft("multiselectUsers")));
        $scope.update(GROUP_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getGroups);
        })
    }

    $scope.addHierarchy = function addHierarchy()
    {
        var params = $scope.getParamsHierarchy();
        $scope.insert(HIERARCHY_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getHierarchies);
        })
    }

    $scope.editHierarchy = function editHierarchy(id)
    {
        var params = $scope.getParamsHierarchy(id);
        $scope.update(HIERARCHY_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getHierarchies);
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
            functionReload();
        }
    }

}]);
