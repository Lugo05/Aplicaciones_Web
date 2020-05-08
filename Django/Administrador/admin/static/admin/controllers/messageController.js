var myApp = angular.module('Admin');

var USER_SERVICE = "/user/user/";
var GROUP_SERVICE = "/user/group/";

var MESSAGE_SERVICE = "/message/message/";
var MESSAGE_TYPE_SERVICE = "/message/messageType/";

var MESSAGE_TYPE = 1;
var MESSAGE = 2;

myApp.controller('MessageController',['$rootScope','$scope','$http','$location','$timeout','NgTableParams',function($rootScope, $scope,$http,$location,$timeout,NgTableParams){
    var templateMessage = {
        "id":0,
        "title":"",
        "body":"",
        "content":"",
        "fromUser":{"id":0},
        "toUser":{"id":0},
        "toGroup":{"id":0},
        "position":"",
        "messageType":{"id":0},
        "createdAt":"",
    }

    var templateMessageType = {
        "id":0,
        "name":"",
        "description":"",
        "createdAt":"",
        "active":true,
    };

    $scope.editing = false;
    $scope.type = 0;

    $scope.infoMessage = templateMessage;
    $scope.infoMessageType = templateMessageType;

    $scope.allMessageTypes = [];
    $scope.allMessages = [];
    $scope.allUsers = [];
    $scope.allGroups = [];

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

    $scope.getGroups= function getGroups()
    {
        $http.get(GROUP_SERVICE).success(function(data)
        {
            console.log("Grupos");
            console.log(data["data"]);
            $scope.allGroups = addStateNotActive(data["data"]);
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

    $scope.getParamsMessageType = function getParamsMessageType(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameDeviceType").val();
        params["description"] = $("#descriptionDeviceType").val();
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateDeviceType").val();
            params["active"] = $('#activeDeviceType').prop('checked');
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }


    $scope.getParamsMessage = function getParamsMessage(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["title"] = $("#titleMessage").val();
        params["body"] = $("#bodyMessage").val();
        params["content"] = $("#contentMessage").val();
        params["fromUser"] = ($("#fromUserMessage").val()==0) ? null : {"id":parseInt($("#fromUserMessage").val())};
        params["toUser"] = ($("#toUserMessage").val()==0) ? null : {"id":parseInt($("#toUserMessage").val())};
        params["toGroup"] = ($("#toGroupMessage").val()==0) ? null : {"id":parseInt($("#toGroupMessage").val())};
        params["messageType"] = ($("#typeMessage").val()==0) ? null : {"id":parseInt($("#typeMessage").val())};

        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateMessage").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.initMessages = function initMessages()
    {
        $scope.type = MESSAGE;
        $scope.getMessages();
        $scope.getMessageTypes();
        $scope.getUsers();
        $scope.getGroups();
    }


    $scope.initMessageTypes = function initMessageTypes()
    {
        $scope.type = MESSAGE_TYPE;
        $scope.getMessageTypes();
    }

    $scope.getMessages= function getMessages()
    {
        $http.get(MESSAGE_SERVICE).success(function(data)
        {
            console.log("Mensajes");
            console.log(data["data"]);
            $scope.allMessages = data["data"];
            if($scope.type==MESSAGE)
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allMessages});

	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getMessageTypes =  function getMessageTypes()
    {
        $http.get(MESSAGE_TYPE_SERVICE).success(function(data)
        {
            console.log("Tipos de mensaje");
            console.log(data["data"]);
            if($scope.type==MESSAGE_TYPE)
            {
                $scope.allMessageTypes = data["data"];
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allMessageTypes});
            }
            else
                $scope.allMessageTypes = addStateNotActive(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }


    $scope.editModal= function editModal(id)
    {
        $scope.editing=true;
        if($scope.type == MESSAGE)
        {
            $scope.infoMessage = $scope.getById($scope.allMessages,id);
        }
        else if($scope.type == MESSAGE_TYPE)
        {
            $scope.infoMessageType = $scope.getById($scope.allMessageTypes,id);
        }
    }

    $scope.addModal = function addModal()
    {
        $scope.editing=false;
        $scope.infoMessage = JSON.parse( JSON.stringify(templateMessage));
        $scope.infoMessageType = JSON.parse( JSON.stringify(templateMessageType));

    }

    $scope.addMessage = function addMessage()
    {
        var params = $scope.getParamsMessage();
        $scope.insert(MESSAGE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getMessages);
        })
    }

    $scope.editMessage = function editMessage(id)
    {
        var params = $scope.getParamsMessage(id);
        $scope.update(MESSAGE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getMessages);
        })

    }

    $scope.addMessageType = function addMessageType()
    {
        var params = $scope.getParamsMessageType();
        $scope.insert(MESSAGE_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getMessageTypes);
        })
    }

    $scope.editMessageType = function editMessageType(id)
    {
        var params = $scope.getParamsMessageType(id);
        $scope.update(MESSAGE_TYPE_SERVICE,params).then(
            function(response)
            {
                data = response.data;
                $scope.getMessageTypes();
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
