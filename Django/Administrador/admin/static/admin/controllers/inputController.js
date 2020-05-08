var myApp = angular.module('Admin');

var INPUT_SERVICE = "/inputs/input/";
var FILE_SERVICE = "/inputs/file/";
var INPUT_TYPE_SERVICE = "/inputs/inputType/";
var INPUT_OPTION_SERVICE = "/inputs/inputOption/";
var FILE_TYPE_SERVICE = "/inputs/fileType/";
var ANSWER_SERVICE = "/inputs/answer/";
var ANSWER_FILE_SERVICE = "/inputs/answerFile/";
var REPORT_SERVICE = "/inputs/report/"


var SECTION_SERVICE = "/modules/section/";
var OBJECT_TYPE_SERVICE = "/objects/object/";
var OBJECT_PROPERTY_TYPE_SERVICE = "/objects/objectPropertyType/";
var SITE_INTEREST_SERVICE = "/sites/siteInterest/";
var DEVICE_SERVICE = "/devices/device/";
var RULE_SERVICE = "/rules/rule/"

var INPUT_RULE_SERVICE = "/composite/input-rule/"

var INPUT_TYPE = 0;
var INPUT_OPTION = 1;
var INPUT = 2;
var FILE = 3;
var FILE_TYPE = 4;
var ANSWER_FILE = 5;
var ANSWER = 6;
var REPORT = 7;

myApp.controller('InputController',['$rootScope','$scope','$http','$location','$timeout','NgTableParams',function($rootScope, $scope,$http,$location,$timeout,NgTableParams){
    var templateInput = {
        "id":0,
        "text":"",
        "objectProperty":{"id":0},
        "inputType":{"id":0},
        "file":{"id":0},
        "length":0,
        "readOnly":false,
        "active":true,
        "createdAt":"",
        "objectType":{"id":0},
        "section":{"id":0},
        "regex":"",
        "orderBy":0,
        "parent":{"id":0},
        "required":true
    };

    var templateInputOption = {
        "id":0,
        "value":"",
        "input":{"id":0},
        "file":{"id":0},
        "active":true,
        "createdAt":""
    };

    var templateInputType = {
        "id":0,
        "name":"",
        "description":"",
        "createdAt":"",
        "active":true
    };

    var templateFile = {
        "id":0,
        "name":"",
        "description":"",
        "url":"",
        "fileType":{"id":0},
        "fileSize":0,
        "createdAt":"",
        "active":true
    };

    var templateFileType = {
        "id":0,
        "name":"",
        "extension":"",
        "maxSize":"",
        "createdAt":"",
        "active":true
    };

    var templateAnswerFile = {
        "id":0,
        "name":"",
        "url":"",
        "answer":{"id":0},
        "reportIdentifier":"",
        "createdAt":"",
        "receivedAt":""
    };

    var templateAnswer = {
        "id":0,
        "answer":"",
        "report":{"id":0},
        "input":{"id":0},
        "reportIdentifier":"",
        "siteInterest":"",
        "createdAt":"",
        "receivedAt":""
    };

    var templateReport = {
        "id":0,
        "identifier":"",
        "device":{"id":0},
        "data":"",
        "position":"",
        "startedAt":"",
        "finishedAt":"",
        "createdAt":"",
        "active":true
    };

    $scope.editing = false;
    $scope.type = 0;
    $scope.leftOptionsRules=[];
    $scope.rightOptionsRules= [];

    $scope.infoInput = templateInput;
    $scope.infoFile = templateFile;
    $scope.infoInputOption = templateInputOption;
    $scope.infoInputType = templateInputType;
    $scope.infoAnswer = templateAnswer;
    $scope.infoAnswerFile = templateAnswerFile;
    $scope.infoReport = templateReport;
    $scope.infoFileType = templateFileType;

    $scope.allFiles = [];
    $scope.allInputOptions = [];
    $scope.allInputTypes = [];
    $scope.allInputs = [];
    $scope.allReports = [];
    $scope.allAnswerFiles= [];
    $scope.allFileTypes = [];
    $scope.allAnswers = [];

    $scope.allObjectTypes = [];
    $scope.allObjectPropertyTypes = [];
    $scope.allSections = [];
    $scope.allInterestSites = [];
    $scope.allDevices = [];
    $scope.allRules = [];

    $scope.tableParameters;

    $scope.getById = function getById(all,id)
    {
        for(i=0;i<all.length;++i)
            if(all[i]["id"] == id)
                return all[i];
        return new Array();
    }
    $scope.getSections = function getSections()
    {
        $http.get(SECTION_SERVICE).success(function(data)
        {
            console.log("Secciones")
            console.log(data["data"]);
            $scope.allSections = data["data"];
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }


    $scope.getObjectTypes = function getObjectTypes()
    {
        $http.get(OBJECT_TYPE_SERVICE).success(function(data)
        {
            console.log("Tipos Objetos")
            console.log(data["data"]);
            $scope.allObjectTypes = data["data"];
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getObjectPropertyTypes =  function getObjectPropertyTypes()
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

    $scope.getInterestSites = function getInterestSites()
    {
        $http.get(SITE_INTEREST_SERVICE).success(function(data)
        {
            console.log("Sitios de interes")
            console.log(data["data"]);
            $scope.allInterestSites = data["data"];
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getDevices = function getDevices()
    {
        $http.get(DEVICE_SERVICE).success(function(data)
        {
            console.log("Dispositivos")
            console.log(data["data"]);
            $scope.allDevices = data["data"];
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getFiles = function getFiles()
    {
        $http.get(FILE_SERVICE).success(function(data)
        {
            console.log("files")
            console.log(data["data"]);
            $scope.allFiles = data["data"];
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getParamsFile = function getParamsFile(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameFile").val();
        params["description"] = $("#descriptionFile").val();
        params["url"] = $("#urlFile").val();
        params["fileType"] = ($("#typeFile").val()==0) ? null : {"id":parseInt($("#typeFile").val())};
        params["fileSize"] = parseInt($("#sizeFile").val());
        params["active"] = $('#activeFile').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateFile").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsInputOption = function getParamsInputOption(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["value"] = $("#valueInputOption").val();
        params["input"] = ($("#inputOption").val()==0) ? null : {"id":parseInt($("#inputOption").val())};
        params["files"] = ($("#fileInputOption").val()==0) ? null : {"id":parseInt($("#fileInputOption").val())};
        params["orderBy"] = parseInt($("#orderByInputOption").val());
        params["active"] = $('#activeInputOption').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateInputOption").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsInputType = function getParamsInputType(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameTypeInput").val();
        params["description"] = $("#descriptionTypeInput").val();
        params["active"] = $('#activeTypeInput').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateTypeInput").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsInput = function getParamsInput(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["text"] = $("#textInput").val();
        params["objectProperty"] = ($("#objectPropertyTypeInput").val()==0) ? null : {"id":parseInt($("#objectPropertyTypeInput").val())};
        params["inputType"] = ($("#typeInput").val()==0) ? null : {"id":parseInt($("#typeInput").val())};
        //params["file"] = ($("#fileInput").val()==0) ? null : {"id":parseInt($("#fileInput").val())};
        params["objectType"] = ($("#objectTypeInput").val()==0) ? null : {"id":parseInt($("#objectTypeInput").val())};
        params["section"] = ($("#sectionInput").val()==0) ? null : {"id":parseInt($("#sectionInput").val())};
        params["parent"] = ($("#parentInput").val()==0) ? null : {"id":parseInt($("#parentInput").val())};
        params["length"] = parseInt($("#lengthInput").val());
        params["readOnly"] = $('#readOnlyInput').prop('checked');
        params["required"] = $('#requiredInput').prop('checked');
        params["regex"] = $("#regexInput").val();
        params["orderBy"] = parseInt($("#orderByInput").val());
        params["active"] = $('#activeInput').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateInput").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsFileType = function getParamsFileType(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameTypeFile").val();
        params["extension"] = $("#extensionTypeFile").val();
        params["maxSize"] = $("#maxSizeTypeFile").val();
        params["active"] = $('#activeTypeFile').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateTypeFile").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsAnwserFile = function getParamsAnwserFile(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["name"] = $("#nameAnswerFile").val();
        params["url"] = $("#urlAnswerFile").val();
        params["answer"] = ($("#answerFile").val()==0) ? null : {"id":parseInt($("#answerFile").val())};
        params["reportIdentifier"] = $("#reportIdentifierAnswerFile").val();
        params["createdAt"] = $("#creationDateAnswerFile").val();
        if($scope.editing)
        {
            params["receivedAt"] = $("#receivedDateAnswerFile").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsAnwser = function getParamsAnwser(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["answer"] = $("#answerAnswer").val();
        params["input"] = ($("#inputAnswer").val()==0) ? null : {"id":parseInt($("#inputAnswer").val())};
        params["report"] = ($("#reportAnswer").val()==0) ? null : {"id":parseInt($("#reportAnswer").val())};
        params["createdAt"] = $("#creationDateAnswer").val();
        if($scope.editing)
        {
            params["receivedAt"] = $("#receivedDateAnswer").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getParamsReport = function getParamsReport(id=0)
    {
        var params = {}
        if(id!=0)
            params["id"] = id;
        params["identifier"] = $("#identifierReport").val();
        params["device"] = ($("#deviceReport").val()==0) ? null : {"id":parseInt($("#deviceReport").val())};
        params["data"] = $("#dataReport").val();
        params["lat"] = parseFloat($("#latReport").val());
        params["lng"] = parseFloat($("#lonReport").val());
        params["startedAt"] = $("#dateStartReport").val();
        params["finishedAt"] = $("#dateEndReport").val();
        params["active"] = $('#activeReport').prop('checked');
        if($scope.editing)
        {
            params["createdAt"] = $("#creationDateReport").val();
        }
        console.log("PARAMS");
        console.log(params);
        return params;
    }

    $scope.getInputRule = function getInputRule(id)
    {
        return $http.get(INPUT_RULE_SERVICE+"?type=i&id="+id).success(function(data)
        {
            console.log("Input Rule");
            console.log(data["active"]["data"]);
            console.log(data["inactive"]["data"]);
            var aux = [];
            for(var i=0;i<data["active"]["data"].length;++i)
                aux.push(data["active"]["data"][i]["rule"]);
            $scope.infoInput["rules-active"] = aux;
            var aux2 = [];
            for(var i=0;i<data["inactive"]["data"].length;++i)
                aux2.push(data["inactive"]["data"][i]["rule"]);
            $scope.infoInput["rules-inactive"] = aux2;
            return true;
            //alert(data["data"].length)
        }).error(function(data, status)
        {
            console.log(data);
            return false;
        });
    }

    $scope.initInputs = function initInputs()
    {
        $scope.type = INPUT;
        $scope.getInputs();
        $scope.getSections();
        $scope.getObjectTypes();
        $scope.getObjectPropertyTypes();
        $scope.getInputTypes();
        $scope.getFiles();
    }

    $scope.initFiles = function initFiles()
    {
        $scope.type = FILE;
        $scope.getFiles();
        $scope.getFileTypes();
    }
    $scope.initInputTypes = function initInputTypes()
    {
        $scope.type = INPUT_TYPE;
        $scope.getInputTypes();
    }

    $scope.initInputOptions = function initInputOptions()
    {
        $scope.type = INPUT_OPTION;
        $scope.getInputOptions();
        $scope.getInputs();
        $scope.getFiles();
    }

    $scope.initAnswerFile = function initAnswerFile()
    {
        $scope.type = ANSWER_FILE;
        $scope.getAnswerFiles();
        $scope.getAnswers();
    }

    $scope.initFileTypes = function initFileTypes()
    {
        $scope.type = FILE_TYPE;
        $scope.getFileTypes();
    }

    $scope.initAnswers = function initAnswers()
    {
        $scope.type = ANSWER;
        $scope.getAnswers();
        $scope.getInterestSites();
        $scope.getInputs();
        $scope.getReports();
    }

    $scope.initReports = function initReports()
    {
        $scope.type = REPORT;
        $scope.getReports();
        $scope.getDevices();
    }

    $scope.getInputs= function getInputs()
    {
        $http.get(INPUT_SERVICE).success(function(data)
        {
            console.log("Inputs");
            $scope.allInputs = data["data"];
            console.log($scope.allInputs);
            if($scope.type==INPUT)
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allInputs});
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getFiles = function getFiles()
    {
        $http.get(FILE_SERVICE).success(function(data)
        {
            console.log("Archivos")
            console.log(data["data"]);
            $scope.allFiles = data["data"];
            if($scope.type == FILE)
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allFiles});
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getInputOptions =  function getInputOptions()
    {
        $http.get(INPUT_OPTION_SERVICE).success(function(data)
        {
            console.log("Input Option")
            console.log(data["data"]);
            $scope.allInputOptions = data["data"];
            if($scope.type == INPUT_OPTION)
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allInputOptions});
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getInputTypes =  function getInputTypes()
    {
        $http.get(INPUT_TYPE_SERVICE).success(function(data)
        {
            console.log("Input types")
            console.log(data["data"]);
            $scope.allInputTypes = data["data"];
            if($scope.type == INPUT_TYPE)
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allInputTypes});
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getFileTypes =  function getFileTypes()
    {
        $http.get(FILE_TYPE_SERVICE).success(function(data)
        {
            console.log("Tipos de Archivo")
            console.log(data["data"]);
            $scope.allFileTypes = data["data"];
            if($scope.type == FILE_TYPE)
                $scope.tableParameters = new NgTableParams({}, { dataset: $scope.allFileTypes});
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getAnswerFiles =  function getAnswerFiles()
    {
        $http.get(ANSWER_FILE_SERVICE).success(function(data)
        {
            console.log("Archivos Respuesta")
            console.log(data["data"]);
            $scope.allAnswerFiles = data["data"];

	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getAnswers =  function getAnswers()
    {
        $http.get(ANSWER_SERVICE).success(function(data)
        {
            console.log("Respuestas")
            console.log(data["data"]);
            $scope.allAnswers = data["data"];
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }

    $scope.getReports =  function getReports()
    {
        $http.get(REPORT_SERVICE).success(function(data)
        {
            console.log("Reportes")
            console.log(data["data"]);
            $scope.allReports = data["data"];
	    }).error(function(data, status)
        {
	    	console.log(data);
	    });
    }


    $scope.editModal= function editModal(id)
    {
        $scope.editing=true;
        if($scope.type == INPUT)
        {
            $scope.infoInput = JSON.parse( JSON.stringify($scope.getById($scope.allInputs,id)));
            $scope.infoInput["createdAt"] = $scope.infoInput["createdAt"].replace("T"," ");
            $scope.getInputRule(id).then(
                function(response){
                    $scope.leftOptionsRules = addStateNotActive(complement($scope.allRules,$scope.infoInput["rules-active"]),$scope.infoInput["rules-inactive"]);
                    setOptions("multiselectRules",$scope.leftOptionsRules,"id");
                    $scope.rightOptionsRules = addStateActive($scope.infoInput["rules-active"]);
                    setOptions("multiselectRules_to",$scope.rightOptionsRules,"id");
                    $scope.allRules = $scope.leftOptionsRules.concat($scope.rightOptionsRules);
            })
        }
        else if($scope.type == FILE)
        {
            $scope.infoFile = JSON.parse( JSON.stringify($scope.getById($scope.allFiles,id)));
            $scope.infoFile["createdAt"] = getDate($scope.infoFile["createdAt"]);
        }
        else if($scope.type == INPUT_OPTION)
        {
            $scope.infoInputOption = JSON.parse( JSON.stringify($scope.getById($scope.allInputOptions,id)));
            $scope.infoInputOption["createdAt"] = $scope.infoInputOption["createdAt"].replace("T"," ");
        }
        else if($scope.type == INPUT_TYPE)
        {
            $scope.infoInputType = JSON.parse( JSON.stringify($scope.getById($scope.allInputTypes,id)));
            $scope.infoInputType["createdAt"] = getDate($scope.infoInputType["createdAt"]);
        }
        else if($scope.type == FILE_TYPE)
        {
            $scope.infoFileType = JSON.parse( JSON.stringify($scope.getById($scope.allFileTypes,id)));
            $scope.infoFileType["createdAt"] = getDate($scope.infoFileType["createdAt"]);
        }
        else if($scope.type == ANSWER_FILE)
        {
            $scope.infoAnswerFile =JSON.parse( JSON.stringify( $scope.getById($scope.allAnswerFiles,id)));
        }
        else if($scope.type == ANSWER)
        {
            $scope.infoAnswer = JSON.parse( JSON.stringify($scope.getById($scope.allAnswers,id)));
        }
        else if($scope.type == REPORT)
        {
            $scope.infoReport = JSON.parse( JSON.stringify($scope.getById($scope.allReports,id)));
        }
    }

    $scope.addModal = function addModal()
    {
        $scope.editing=false;
        $scope.infoInput = JSON.parse( JSON.stringify(templateInput));
        $scope.infoFile = JSON.parse( JSON.stringify(templateFile));
        $scope.infoInputOption = JSON.parse( JSON.stringify(templateInputOption));
        $scope.infoInputType = JSON.parse( JSON.stringify(templateInputType));
        $scope.infoFileType = JSON.parse( JSON.stringify(templateFileType));
        $scope.infoAnswerFile = templateAnswerFile;
        $scope.infoAnswer = templateAnswer;
        $scope.infoReport = templateReport;

        $scope.leftOptionsRules = $scope.allRules;
        setOptions("multiselectRules",$scope.leftOptionsRules,"id");
        $scope.rightOptionsRules = [];
        setOptions("multiselectRules_to",$scope.rightOptionsRules,"id");
    }

    $scope.addInput = function addInput()
    {
        var params = $scope.getParamsInput();
        $scope.insert(INPUT_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getInputs);
        })
    }

    $scope.editInput = function editInput(id)
    {
        var params = $scope.getParamsInput(id);
        $scope.update(INPUT_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getInputs);
        })
    }

    $scope.addInputOption = function addInputOption()
    {
        var params = $scope.getParamsInputOption();
        $scope.insert(INPUT_OPTION_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getInputOptions);
        })
    }

    $scope.editInputOption = function editInputOption(id)
    {
        var params = $scope.getParamsInputOption(id);
        $scope.update(INPUT_OPTION_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getInputOptions);
        })
    }

    $scope.addInputType = function addInputType()
    {
        var params = $scope.getParamsInputType()
        $scope.insert(INPUT_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getInputTypes);
        })
    }

    $scope.editInputType = function editInputType(id)
    {
        var params = $scope.getParamsInputType(id);
        $scope.update(INPUT_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getInputTypes);
        })
    }

    $scope.addFile = function addFile()
    {
        var params = $scope.getParamsFile();
        $scope.insert(FILE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getFiles);
        })
    }

    $scope.editFile = function editFile(id)
    {
        var params = $scope.getParamsFile(id);
        $scope.update(FILE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getFiles);
        })
    }

    $scope.addFileType = function addFileType()
    {
        var params = $scope.getParamsFileType();
        $scope.insert(FILE_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getFileTypes);
        })
    }

    $scope.editFileType = function editFileType(id)
    {
        var params = $scope.getParamsFileType(id);
        $scope.update(FILE_TYPE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getFileTypes);
        })
    }

    $scope.addAnswerFile = function addAnswerFile()
    {
        var params = $scope.getParamsAnwserFile();
        $scope.insert(ANSWER_FILE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getAnswerFiles);
        })
    }

    $scope.editAnswerFile = function editAnswerFile(id)
    {
        var params = $scope.getParamsAnwserFile(id);
        $scope.update(ANSWER_FILE_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getAnswerFiles);
        })
    }

    $scope.addAnswer = function addAnswer()
    {
        var params = $scope.getParamsAnwser();
        $scope.insert(ANSWER_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getAnswers);
        })
    }

    $scope.editAnswer = function editAnswer(id)
    {
        var params = $scope.getParamsAnwser(id);
        $scope.update(ANSWER_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getAnswers);
        })
    }

    $scope.addReport = function addReport()
    {
        var params = $scope.getParamsReport();
        $scope.insert(REPORT_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getReports);
        })
    }

    $scope.editReport = function editReport(id)
    {
        var params = $scope.getParamsReport(id);
        $scope.update(REPORT_SERVICE,params).then(
            function(response){
                $scope.success(response.data,$scope.getReports);
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
