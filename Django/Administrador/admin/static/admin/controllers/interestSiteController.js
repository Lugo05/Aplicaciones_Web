var myApp = angular.module('Admin');

var SITE_INTEREST_SERVICE = "/sites/siteInterest/";
var FORM_SERVICE  = "/modules/form/";
var LOAD_FILE_SERVICE = " /modules/file/";
var TERRITORY_SERVICE = "/sites/territory/";
var POLYGON_SERVICE = "/sites/polygon/";
var TYPE_POLYGON_SERVICE = "/sites/polygonType/";
var DIVISION_TYPE_SERVICE = "/sites/divisionType/";
var OBJECT_SERVICE = "/objects/object/";

var TERRITORY_FORM_SERVICE = "/composite/territory-form/"
var SITE_FORM_SERVICE = "/composite/site-form/"

var TYPE_POLYGON = 0;
var POLYGON = 1;
var INTEREST_SITE = 2;
var TERRITORY = 3;
var DIVISION_TYPE = 4;

var GEOFENCE_SERVICE = "/sites/geofence/";
var UPLOAD_KML_SERVICE = "/upload/kml/"

var language = {};

var marker;
var map;
var drawingManager;
var mapPolygon = [];

function initMap()
{
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 19.42633162, lng: -99.1333328},
        zoom: 6
    });

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['circle', 'polygon','rectangle']
        },
        polygonOptions:{
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            editable : true,
            draggable: true,
            geodesic: true
        },
        rectangleOptions:{
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            editable : true,
            draggable: true,
            geodesic: true
        },
        circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            draggable: true,
            geodesic: true,
            zIndex: 1
        }
    });
}

myApp.controller('InterestSiteController',['$rootScope','$scope','$http','$location','$timeout','NgTableParams',function($rootScope, $scope,$http,$location,$timeout,NgTableParams){
    var templateInterestSite = {
        "id":0,
        "name":"",
        "code":"",
        "codeNumber":0,
        "street":"",
        "streetRight":"",
        "streetLeft":"",
        "externalNumber":0,
        "internalNumber":0,
        "postalCode":"",
        "active":true,
        "createdAt":"",
        "file":{"id":0},
        "territory":{"id":0}
    };

    var templatePolygon = {
        "id":0,
        "geofence":"",
        "polygonTypeId":2,
        "createdAt":"",
        "active":true,
    };

    var templateTypePolygon = {
        "id":0,
        "name":"",
        "description":"",
        "createdAt":"",
        "active":true,
    };

    var templateTerritory = {
        "id":0,
        "name":"",
        "polygon":0,
        "divisionTypeId":0,
        "parent":1,
        "createdAt":"",
        "active":true,
    };

    var templateDivisionType = {
        "id":0,
        "name":"",
        "createdAt":"",
        "active":true,
    };

    $scope.editing = false;
    $scope.type = 0;
    $scope.labelFileKML = "";

    $scope.infoInterestSite = {};
    $scope.infoTerritory = {};
    $scope.infoPolygon = {};
    $scope.infoTypePolygon = {};

    $scope.leftOptionsForms = [];
    $scope.rightOptionsForms = [];
    $scope.id;

    $scope.allTerritories = [];
    $scope.allPolygons = [];
    $scope.allTypesPolygon = [];
    $scope.allFiles = [];
    $scope.allForms = [];
    $scope.allInterestSites = [];
    $scope.allDivisionTypes = [];
    $scope.allObjects = [];

    $scope.tableParameters;

    $scope.infoForm = [];
    $scope.infoFormComposite = [];
    $scope.opcForm = 0;


    function deleteMapPolygons()
    {
        for (i = 0; i<mapPolygon.length ; ++i)
            mapPolygon[i].setMap(null);
        mapPolygon = [];
    }

    function visibleMapPolygon(map,status)
    {
        for (i = 0; i<mapPolygon.length ; ++i)
        {
            if(i == map)
                mapPolygon[i].setMap(map);
            else
                mapPolygon[i].setMap(null);
        }
    }

    function parserKML(file)
    {
        $scope.text;
        fr = new FileReader();
        fr.onload = function(e)
        {
            $scope.labelFileKML = file.name;
            $scope.text = fr.result;
            xmlDoc = $.parseXML( $scope.text )
            $xml = $( xmlDoc ),
            $options = $xml.find("Polygon").find("coordinates");
            $scope.infoPolygon["polygon"] = [];

            deleteMapPolygons()
            var id = 0;
            $.each($options, function()
            {
                var arrayAux = $(this).text().split(" ");
                var aux = [];
                for(var i=0;i<arrayAux.length;++i)
                {
                    var a = arrayAux[i].split(",");
                    var elem = {"lng":parseFloat(a[0]),"lat":parseFloat(a[1])};
                    if(!(isNaN(a[0]) || isNaN(a[1])))
                    {
                        aux.push(elem);
                    }
                }
                var polygon = new google.maps.Polygon({
                    paths: aux,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    indexID:id
                });
                id++;
                mapPolygon.push(polygon);
                mapPolygon[mapPolygon.length-1].setMap(map);
                google.maps.event.addListener(mapPolygon[mapPolygon.length-1], 'click', function (event)
                {
                    for(i = 0; i<mapPolygon.length;++i)
                        mapPolygon[i].setOptions({fillColor: "#FF0000"});
                    mapPolygon[this.indexID].setOptions({fillColor: "#0000FF"});
                    $scope.infoPolygon["polygon"] = aux
                    console.log(this.indexID);
                });
                $scope.infoPolygon.polygon = aux;
            });
            if(mapPolygon.length>0)
            {
                mapPolygon[mapPolygon.length-1].setOptions({fillColor: "#0000FF"});
                console.log($scope.infoPolygon.polygon);
                if($scope.infoPolygon["polygon"].length>0)
                    map.setCenter({"lat":$scope.infoPolygon["polygon"][0].lat,"lng":$scope.infoPolygon["polygon"][0].lng});
            }

        }
        fr.onerror = function(err) {
           console.log(err, err.loaded, err.loaded === 0, file);
           $scope.labelFileKML = "Error";
        }
        fr.readAsText(file);
    }



    $scope.changeKML = function changeKML()
    {
        var fd = new FormData();
        var file=$('#fileKML').prop('files')[0];

        fd.append("file",file);
        var headers = {
	        withCredentials: true,
	        headers: {'Content-Type': undefined },
	        transformRequest: angular.identity
	    }
        var file=$('#fileKML').prop('files')[0]
        parserKML(file)
    }

    $scope.changeCheckbox = function changeCheckbox()
    {
        if($scope.checkedFile)
        {
            map = new google.maps.Map(document.getElementById('map'), {
               center: {lat: 19.42633162, lng: -99.1333328},
               zoom: 6
           });
            drawingManager.setMap(null);
            deleteMapPolygons();
            return;
        }

        $scope.labelFileKML = ""
        $('#fileKML').val("");
        deleteMapPolygons();
        drawingManager.setMap(map);
        google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
            var path = polygon.getPath()
            $scope.infoPolygon["polygon"] = [];
            for (var i = 0 ; i < path.length ; i++)
            {
               $scope.infoPolygon["polygon"].push({
                "lat": path.getAt(i).lat(),
                "lng": path.getAt(i).lng()
              });
            }
            console.log($scope.infoPolygon["polygon"]);
        });
    }

    $scope.getGeofence = function getGeofence(id)
    {
        $http.get(GEOFENCE_SERVICE+"?id="+id).success(function(data)
        {
            console.log("Geofence")
            console.log(data["data"]);
            $scope.infoPolygon["polygon"] = data["data"]["geofence"];
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.appendFormComposite = function appendFormComposite()
    {
        $scope.infoForm.push({"form":{"id":$scope.opcForm.id,"name":$scope.opcForm.name},"startTime":"","endTime":"","active":true});
        $scope.infoFormComposite = $scope.infoForm[$scope.infoForm.length-1];
    }

    $scope.addFormComposite = function addFormComposite()
    {
        var server = ($scope.type == TERRITORY)? TERRITORY_FORM_SERVICE : SITE_FORM_SERVICE;
        $scope.infoFormComposite["form"] = $scope.infoFormComposite["form"]["id"];
        if($scope.type== TERRITORY)
            $scope.infoFormComposite["territory"] = $scope.infoTerritory.id;
        else
            $scope.infoFormComposite["siteInterest"] = $scope.infoInterestSite.id;
        $scope.infoFormComposite["startTime"] = $("#dateStartFormComposite").val();
        $scope.infoFormComposite["endTime"] = $("#dateEndFormComposite").val();
        $scope.insert(server,$scope.infoFormComposite).then(
            function(response){
                data = response.data;
                if($scope.type==INTEREST_SITE)
                    $scope.getSiteForm($scope.infoInterestSite.id);
                else
                    $scope.getTerritoryForm($scope.infoTerritory.id);
                if(data["error"])
                    toastr["error"](data["message"]);
                else
                    toastr["success"](data["message"]);
        })
    }

    $scope.editFormComposite = function editFormComposite()
    {
        var server = ($scope.type == TERRITORY)? TERRITORY_FORM_SERVICE : SITE_FORM_SERVICE;
        if($scope.type== TERRITORY)
            $scope.infoFormComposite["territory"] = $scope.infoTerritory.id;
        else
            $scope.infoFormComposite["siteInterest"] = $scope.infoInterestSite.id;
        $scope.infoFormComposite["startTime"] = $("#dateStartFormComposite").val();
        $scope.infoFormComposite["endTime"] = $("#dateEndFormComposite").val();
        $scope.update(server,$scope.infoFormComposite).then(
            function(response){
                data = response.data;
                if($scope.type==INTEREST_SITE)
                    $scope.getSiteForm($scope.infoInterestSite.id);
                else
                    $scope.getTerritoryForm($scope.infoTerritory.id);
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
            console.log("Formularios")
            console.log(data["data"]);
            $scope.allForms = addStateNotActive(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
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

    $scope.getObjects= function getObjects()
    {
        $http.get(OBJECT_SERVICE).success(function(data)
        {
            console.log("Objetos")
            console.log(data["data"]);
            $scope.allObjects = addStateNotActive(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }


    $scope.getParamsDivisionType = function getParamsDivisionType(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameDivisionType").val();
        //params["polygon"] = $("#polygonTerritory").val();
        params["active"] = $('#activeDivisionType').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateDivisionType").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsTerritory = function getParamsTerritory(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameTerritory").val();
        //params["polygon"] = ($("#fatherTerritory").val()==0) ? null : {"id":parseInt($("#fatherTerritory").val())};
        params["divisionTypeId"] = $scope.infoTerritory.divisionTypeId;
        params["parent"] =($("#fatherTerritory").val()==0) ? null : {"id":parseInt($("#fatherTerritory").val())};
        params["active"] = $('#activeTerritory').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateTerritory").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsPolygon = function getParamsPolygon(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["polygon"] = $scope.infoPolygon["polygon"]
        params["polygonType"] = ($("#typePolygon").val()==0) ? null : {"id":parseInt($("#typePolygon").val())};
        params["active"] = $('#activePolygon').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDatePolygon").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsTypePolygon = function getParamsTypePolygon(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameTypePolygon").val();
        params["description"] = $("#descriptionTypePolygon").val();
        params["active"] = $('#activeTypePolygon').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateTypePolygon").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsInterestSite = function getParamsInterestSite(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameSite").val();
        params["code"] = $("#codeSite").val();
        params["codeNumber"] = parseInt($("#codeNumberSite").val());
        params["street"] = $("#streetSite").val();
        params["streetRight"] = $("#streetRightSite").val();
        params["streetLeft"] = $("#streetLeftSite").val();
        params["externalNumber"] = $("#externalNumberSite").val();
        params["internalNumber"] = $("#internalNumberSite").val();
        params["postalCode"] = ($("#postalCodeSite").val()=="") ? null : parseInt($("#postalCodeSite").val());
        params["lng"] = marker.position.lat();
        params["lat"] = marker.position.lng();
        params["active"] = $('#activeSite').prop('checked');
        params["file"] = null;
        params["object"] = ($("#objectSite").val()==0) ? null : {"id":parseInt($("#objectSite").val())};
        params["territory"] = ($("#territorySite").val()==0) ? 0 : parseInt($("#territorySite").val());
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateSite").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getTerritoryForm = function getTerritoryForm(id)
    {
        return $http.get(TERRITORY_FORM_SERVICE+"?type=t&id="+id).success(function(data)
        {
            console.log("Territorios Form");
            console.log(data["data"]);
            $scope.infoForm = data["data"]
            if($scope.infoForm.length>0)
                $scope.infoFormComposite = $scope.infoForm[0];
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
        return $http.get(SITE_FORM_SERVICE+"?type=s&id="+id).success(function(data)
        {
            console.log("Sites Form");
            console.log(data["data"]);
            $scope.infoForm = data["data"]
            if($scope.infoForm.length>0)
                $scope.infoFormComposite = $scope.infoForm[0];
            return true;
            //alert(data["data"].length)
        }).error(function(data, status)
        {
            console.log(data);
            return false;
        });
    }

    $scope.initDivisionTypes = function initDivisionTypes()
    {
        $scope.type = DIVISION_TYPE;
        $scope.getDivisionTypes();
    }

    $scope.initInterestSites = function initInterestSites()
    {
        $scope.type = INTEREST_SITE;
        $scope.getInterestSites();
        $scope.getTerritories();
        $scope.getForms();
        $scope.getFiles();
        $scope.getObjects();
    }

    $scope.initTerritories = function initTerritories()
    {
        $scope.type = TERRITORY;
        $scope.getTerritories();
        $scope.getForms();
        $scope.getDivisionTypes();
    }
    $scope.initTypesPolygon = function initTypesPolygon()
    {
        $scope.type = TYPE_POLYGON;
        $scope.getTypesPolygon();
    }

    $scope.initPolygon = function initPolygon()
    {
        $scope.type = POLYGON;
        $scope.getPolygons();
        $scope.getTypesPolygon();
    }


    $scope.getDivisionTypes = function getDivisionTypes()
    {
        $http.get(DIVISION_TYPE_SERVICE).success(function(data)
        {
            console.log("Tipos de division")
            console.log(data["data"]);
            $scope.allDivisionTypes = data["data"];
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getInterestSites= function getInterestSites()
    {
        $http.get(SITE_INTEREST_SERVICE).success(function(data)
        {
            console.log("Sitios de interest")
            console.log(data["data"]);
            if($scope.type==INTEREST_SITE)
            {
                $scope.allInterestSites = data["data"];
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allInterestSites});
            }
            else
                $scope.allInterestSites = addStateNotActive(data["data"]);
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
            if($scope.type==TERRITORY)
            {
                $scope.allTerritories = data["data"];
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allTerritories});
            }
            else
                $scope.allTerritories = addStateNotActive(data["data"]);
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }


    $scope.getPolygons =  function getPolygons()
    {
        $http.get(POLYGON_SERVICE).success(function(data)
        {
            console.log("Poligonos")
            console.log(data["data"]);
            $scope.allPolygons = data["data"];
            if($scope.type==POLYGON)
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allPolygons});
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getTypesPolygon =  function getTypesPolygon()
    {
        $http.get(TYPE_POLYGON_SERVICE).success(function(data)
        {
            console.log("Tipos de poligono")
            console.log(data["data"]);
            $scope.allTypesPolygon = data["data"];
            if($scope.type==TYPE_POLYGON)
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allTypesPolygon});
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }


    $scope.editModal= function editModal(id)
    {
        $scope.editing=true;
        if($scope.type == INTEREST_SITE)
        {
            $scope.infoInterestSite = JSON.parse( JSON.stringify($scope.getById($scope.allInterestSites,id)));
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: $scope.infoInterestSite.position.coordinates[1], lng: $scope.infoInterestSite.position.coordinates[0]},
                zoom: 10
            });
            marker = new google.maps.Marker({
                    position: {lat: $scope.infoInterestSite.position.coordinates[1], lng: $scope.infoInterestSite.position.coordinates[0]},
                    map: map,
                    title: $scope.infoInterestSite.name,
                    draggable:true
            });
            $scope.getSiteForm($scope.infoInterestSite.id);
        }
        else if($scope.type == TERRITORY)
        {
            $scope.infoTerritory = JSON.parse( JSON.stringify($scope.getById($scope.allTerritories,id)));
            $scope.infoTerritory["createdAt"] = getDate($scope.infoTerritory["createdAt"]);
            $scope.getTerritoryForm($scope.infoTerritory.id);
        }
        else if($scope.type == POLYGON)
        {
            $scope.infoPolygon = JSON.parse( JSON.stringify($scope.getById($scope.allPolygons,id)));
            $scope.getGeofence(id);
            if($scope.infoPolygon.polygon.length>0)
            {
                map.setCenter({lat: $scope.infoPolygon.polygon[0]["lat"], lng: $scope.infoPolygon.polygon[0]["lng"]});
                var polygon = new google.maps.Polygon({
                    paths: $scope.infoPolygon.polygon,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35
                    //editable : true
                });
                polygon.setMap(map)
            }
        }
        else if($scope.type == TYPE_POLYGON)
        {
            $scope.infoTypePolygon = JSON.parse( JSON.stringify($scope.getById($scope.allTypesPolygon,id)));
            $scope.infoTypePolygon["createdAt"] = getDate($scope.infoTypePolygon["createdAt"]);
        }
        else if($scope.type== DIVISION_TYPE)
        {
            $scope.infoDivisionType = JSON.parse( JSON.stringify($scope.getById($scope.allDivisionTypes,id)));
        }
    }

    $scope.addModal = function addModal()
    {
        $scope.editing=false;
        $scope.infoInterestSite = JSON.parse( JSON.stringify(templateInterestSite));
        $scope.infoTerritory = JSON.parse( JSON.stringify(templateTerritory));
        $scope.infoPolygon = JSON.parse( JSON.stringify(templatePolygon));
        $scope.infoTypePolygon = JSON.parse( JSON.stringify(templateTypePolygon));

        if($scope.type==INTEREST_SITE)
        {
            var map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 19.42633162, lng: -99.1333328},
                zoom: 10
            });
            marker = new google.maps.Marker({
                    position: {lat: 19.42633162, lng: -99.1333328},
                    map: map,
                    title: $scope.infoInterestSite.name,
                    draggable:true
            });
        }
        else if($scope.type==POLYGON)
        {
            $scope.checkedFile=false;
            $scope.changeCheckbox();
        }
    }

    $scope.addDivisionType = function addDivisionType()
    {
        var params = $scope.getParamsDivisionType();
        $scope.insert(DIVISION_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getDivisionTypes);
        })
    }

    $scope.editDivisionType = function editDivisionType(id)
    {
        var params = $scope.getParamsDivisionType(id);
        $scope.update(DIVISION_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getDivisionTypes);
        })
    }

    $scope.addInterestSite = function addInterestSite()
    {
        var params = $scope.getParamsInterestSite();
        var formsRemoved = getRemoved(getSubsetByIds($scope.allForms,getOptionsLeft("multiselectForms")));
        var formsAdded= getAdded(getSubsetByIds($scope.allForms,getOptionsRight("multiselectForms")));
        console.log("Remover");
        console.log(formsRemoved);
        console.log("Agregar");
        console.log(formsAdded);
        $scope.insert(SITE_INTEREST_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getInterestSites);
        })
    }

    $scope.editInterestSite = function editInterestSite(id)
    {
        var params = $scope.getParamsInterestSite(id);
        $scope.update(SITE_INTEREST_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getInterestSites);
        })
    }

    $scope.addPolygon = function addPolygon()
    {
        var params = $scope.getParamsPolygon();
        $scope.insert(POLYGON_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getPolygons);
        })
    }

    $scope.editPolygon = function editPolygon(id)
    {
        var params = $scope.getParamsPolygon(id);
        $scope.update(POLYGON_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getPolygons);
        })
    }

    $scope.addTypePolygon = function addTypePolygon()
    {
        var params = $scope.getParamsTypePolygon();
        $scope.insert(TYPE_POLYGON_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getTypesPolygon);
        })
    }

    $scope.editTypePolygon = function editTypePolygon(id)
    {
        var params = $scope.getParamsTypePolygon(id);
        $scope.update(TYPE_POLYGON_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getTypesPolygon);
        })
    }

    $scope.addTerritory = function addTerritory()
    {
        var params = $scope.getParamsTerritory();
        $scope.insert(TERRITORY_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getTerritories);
        })
    }

    $scope.editTerritory = function editTerritory(id)
    {
        var params = $scope.getParamsTerritory(id);
        $scope.update(TERRITORY_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getTerritories);
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
