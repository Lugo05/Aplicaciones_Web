var myApp = angular.module('Admin');

var DEVICE_SERVICE = "/devices/device/";

var GEO_SERVICE = "/geos/geo/";
var GEO_TYPE_SERVICE = "/geos/geoType/";

var GEO_TYPE = 1;
var GEO = 2;

myApp.controller('GeoController',['$rootScope','$scope','$http','$location','$timeout',function($rootScope, $scope,$http,$location,$timeout){
    var templateGeo = {
        "id":0,
        "position":"",
        "accurancy":"",
        "altitude":"",
        "gps":"",
        "device":{"id":0},
        "sentAt":"",
        "receivedAt":"",
        "geoType":{"id":0},
        "createdAt":"",
    }

    var templateGeoType = {
        "id":0,
        "name":"",
        "description":"",
        "createdAt":"",
        "active":true,
    };

    $scope.editing = false;
    $scope.type = 0;

    $scope.infoGeo = templateGeo;
    $scope.infoGeoType = templateGeoType;

    $scope.allGeoTypes = [];
    $scope.allGeos = [];
    $scope.allDevices = [];

    $scope.getDevices= function getDevices()
    {
        $http.get(GEO_SERVICE).success(function(data)
        {
            console.log("Dispositivos");
            console.log(data["data"]);
            $scope.allDevices = addStateNotOwn(data["data"]);
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

    $scope.getParamsGeoType = function getParamsGeoType(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameGeoType").val();
        params["description"] = $("#descriptionGeoType").val();
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateGeoType").val();
            params["active"] = $('#activeGeoType').prop('checked');
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }


    $scope.getParamsGeo = function getParamsGeo(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;

        params["position"] = $("#positionGeo").val();
        params["accuracy"] = $("#accuracy").val();
        params["altitude"] = $("#altitudeGeo").val();
        //params["gps"] = $("#gpsGeo").val();
        params["device"] = ($("#deviceGeo").val()==0) ? null : {"id":parseInt($("#deviceGeo").val())};
        params["geoType"] = ($("#typeGeo").val()==0) ? null : {"id":parseInt($("#typeGeo").val())};
        params["sentAt"] = $("#sentAtGeo").val();
        params["receivedAt"] = $("#receivedAtGeo").val();
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateGeo").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.initGeos = function initGeos()
    {
        $scope.type = GEO;
        $scope.getGeos();
        $scope.getGeoTypes();
        $scope.getDevices();
    }


    $scope.initGeoTypes = function initGeoTypes()
    {
        $scope.type = GEO_TYPE;
        $scope.getGeoTypes();
    }

    $scope.getGeos= function getGeos()
    {
        $http.get(GEO_SERVICE).success(function(data)
        {
            console.log("Geos");
            console.log(data["data"]);
            $scope.allGeos = data["data"];

	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getGeoTypes =  function getGeoTypes()
    {
        $http.get(GEO_TYPE_SERVICE).success(function(data)
        {
            console.log("Tipos de geo");
            console.log(data["data"]);
            if($scope.type==GEO_TYPE)
                $scope.allGeoTypes = data["data"];
            else
                $scope.allGeoTypes = addStateNotOwn(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }


    $scope.editModal= function editModal(id)
    {
        $scope.editing=true;
        if($scope.type == GEO)
        {
            $scope.infoGeo = $scope.getById($scope.allGeos,id);
        }
        else if($scope.type == GEO_TYPE)
        {
            $scope.infoGeoType = $scope.getById($scope.allGeoTypes,id);
        }
    }

    $scope.addModal = function addModal()
    {
        $scope.editing=false;
        $scope.infoGeo = templateGeo;
        $scope.infoGeoType = templateGeoType;

    }

    $scope.addGeo = function addGeo()
    {
        var params = $scope.getParamsGeo();
        $scope.insert(GEO_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getGeos);
        })
    }

    $scope.editGeo = function editGeo(id)
    {
        var params = $scope.getParamsGeo(id);
        $scope.update(GEO_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getGeos);
        })

    }

    $scope.addGeoType = function addGeoType()
    {
        var params = $scope.getParamsGeoType();
        $scope.insert(GEO_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getGeoTypes);
        })
    }

    $scope.editGeoType = function editGeoType(id)
    {
        var params = $scope.getParamsGeoType(id);
        $scope.update(GEO_TYPE_SERVICE,params).then(
            function(response)
            {
                data = response.data;
                $scope.getGeoTypes();
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
