var myApp = angular.module('Admin');

var USER_SERVICE = "/user/user/";

var DEVICE_SERVICE = "/devices/device/";
var DEVICE_TYPE_SERVICE = "/devices/deviceType/";

var USER_DEVICE_SERVICE = "/composite/user-device";

var DEVICE_TYPE = 1;
var DEVICE = 2;

myApp.controller('DeviceController',['$rootScope','$scope','$http','$location','$timeout','NgTableParams',function($rootScope, $scope,$http,$location,$timeout,NgTableParams){
    var templateDevice = {
        "id":0,
        "uuid":"",
        "phone":"",
        "gfbToken":"",
        "data":"",
        "deviceType":{"id":0},
        "lastPosition":"",
        "version":"",
        "createdAt":"",
        "active":true,
    }

    var templateDeviceType = {
        "id":0,
        "name":"",
        "description":"",
        "createdAt":"",
        "active":true,
    };

    $scope.editing = false;
    $scope.type = 0;

    $scope.infoDevice = templateDevice;
    $scope.infoDeviceType = templateDeviceType;

    $scope.leftOptionsUsers = [];
    $scope.rightOptionsUsers = [];


    $scope.allUsers = []

    $scope.allDeviceTypes = [];
    $scope.allDevices = [];

    $scope.tableParameters;


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

    $scope.getById = function getById(all,id)
    {
        for(i=0;i<all.length;++i)
            if(all[i]["id"] == id)
                return all[i];
        return new Array();
    }

    $scope.getParamsDeviceType = function getParamsDeviceType(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameDeviceType").val();
        params["description"] = $("#descriptionDeviceType").val();
        params["active"] = $('#activeDeviceType').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateDeviceType").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }


    $scope.getParamsDevice = function getParamsDevice(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["uuid"] = $("#uuidDevice").val();
        params["phone"] = $("#phoneDevice").val();
        params["gfbToken"] = $("#gfbTokenDevice").val();
        params["data"] = $("#dataDevice").val();
        params["deviceType"] = ($("#deviceType").val()==0) ? null : {"id":parseInt($("#deviceType").val())};
        params["lastPosition"] = $("#lastPositionDevice").val();
        params["version"] = $("#versionDevice").val();
        params["active"] = $('#activeDevice').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateModule").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getUserDevice = function getUserDevice(id)
    {
        return $http.get(USER_DEVICE_SERVICE+"?type=d&id="+id).success(function(data)
        {
            console.log("User Device");
            console.log(data["active"]["data"]);
            console.log(data["inactive"]["data"]);
            var aux = [];
            for(var i=0;i<data["active"]["data"].length;++i)
                aux.push(data["active"]["data"][i]["user"]);
            $scope.infoDevice["users-active"] = aux;
            var aux2 = [];
            for(var i=0;i<data["inactive"]["data"].length;++i)
                aux2.push(data["inactive"]["data"][i]["user"]);
            $scope.infoDevice["users-inactive"] = aux2;
            return true;
            //alert(data["data"].length)
        }).error(function(data, status)
        {
            console.log(data);
            return false;
        });
    }

    $scope.initDevices = function initDevices()
    {
        $scope.type = DEVICE;
        $scope.getDevices();
        $scope.getDeviceTypes();
        $scope.getUsers();
    }


    $scope.initDeviceTypes = function initDeviceTypes()
    {
        $scope.type = DEVICE_TYPE;
        $scope.getDeviceTypes();
    }

    $scope.getDevices= function getDevices()
    {
        $http.get(DEVICE_SERVICE).success(function(data)
        {
            console.log("Dispositivo");
            console.log(data["data"]);
            $scope.allDevices = data["data"];
            if($scope.type == DEVICE)
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allDevices});

	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getDeviceTypes =  function getDeviceTypes()
    {
        $http.get(DEVICE_TYPE_SERVICE).success(function(data)
        {
            console.log("Tipos de Dispositivo");
            console.log(data["data"]);
            if($scope.type == DEVICE_TYPE)
            {
                $scope.allDeviceTypes = data["data"];
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allDeviceTypes});

            }
            else
                $scope.allDeviceTypes = addStateNotActive(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }


    $scope.editModal= function editModal(id)
    {
        $scope.editing=true;
        if($scope.type == DEVICE)
        {
            $scope.infoDevice = JSON.parse( JSON.stringify($scope.getById($scope.allDevices,id)));
            $scope.infoDevice["createdAt"] = getDate($scope.infoDevice["createdAt"]);
            $scope.getUserDevice(id).then(
                function(response){
                    $scope.leftOptionsUsers = addStateNotActive(complement($scope.allUsers,$scope.infoDevice["users-active"]),$scope.infoDevice["users-inactive"]);
                    setOptions("multiselectUsers",$scope.leftOptionsUsers,"username");
                    $scope.rightOptionsUsers = addStateActive($scope.infoDevice["users-active"]);
                    setOptions("multiselectUsers_to",$scope.rightOptionsUsers,"username");
                    $scope.allUsers = $scope.leftOptionsUsers.concat($scope.rightOptionsUsers);
            })
        }
        else if($scope.type == DEVICE_TYPE)
        {
            $scope.infoDeviceType = JSON.parse( JSON.stringify($scope.getById($scope.allDeviceTypes,id)));
            $scope.infoDeviceType["createdAt"] = getDate($scope.infoDeviceType["createdAt"]);
        }
    }

    $scope.addModal = function addModal()
    {
        $scope.editing=false;
        $scope.infoDevice = JSON.parse( JSON.stringify(templateDevice));
        $scope.infoDeviceType = JSON.parse( JSON.stringify(templateDeviceType));

        if($scope.type == DEVICE)
        {
            $scope.leftOptionsUsers = $scope.allUsers;
            setOptions("multiselectUsers",$scope.leftOptionsUsers,"username");
            $scope.rightOptionsUsers = [];
            setOptions("multiselectUsers_to",$scope.rightOptionsUsers,"username");
        }
    }

    $scope.addDevice = function addDevice()
    {
        var params = $scope.getParamsDevice();
        console.log("MULTISELECT RIGHT");
        params["users"] = getAdded(getSubsetByIds($scope.allUsers,getOptionsRight("multiselectUsers")));
        $scope.insert(DEVICE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getDevices);
        })
    }

    $scope.editDevice = function editDevice(id)
    {
        var params = $scope.getParamsDevice(id);
        console.log("MULTISELECT RIGHT");
        console.log(getAdded(getSubsetByIds($scope.allUsers,getOptionsRight("multiselectUsers"))));
        params["users-add"] = getAdded(getSubsetByIds($scope.allUsers,getOptionsRight("multiselectUsers")));
        console.log("MULTISELECT RIGHT 2");
        console.log(getReAdded(getSubsetByIds($scope.allUsers,getOptionsRight("multiselectUsers"))));
        params["users-re-add"] = getReAdded(getSubsetByIds($scope.allUsers,getOptionsRight("multiselectUsers")));
        console.log("MULTISELECT LEFT");
        console.log(getRemoved(getSubsetByIds($scope.allUsers,getOptionsLeft("multiselectUsers"))));
        params["users-remove"] = getRemoved(getSubsetByIds($scope.allUsers,getOptionsLeft("multiselectUsers")));
        $scope.update(DEVICE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getDevices);
        })
    }

    $scope.addDeviceType = function addDeviceType()
    {
        var params = $scope.getParamsDeviceType();
        $scope.insert(DEVICE_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getDeviceTypes);
        })
    }

    $scope.editDeviceType = function editDeviceType(id)
    {
        var params = $scope.getParamsDeviceType(id);
        $scope.update(DEVICE_TYPE_SERVICE,params).then(
            function(response)
            {
                data = response.data;
                $scope.getDeviceTypes();
                if(data["error"])
                    toastr["error"](data["message"]);
                else
                    toastr["success"](data["message"]);
                $('#modalEdition').modal('toggle');
            }
       )
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
