export function serviceMassive ($http,$scope)
{
    var service = this

    service.URL_VALIDATE = "/loading/validate/"

    service.data = {"correct":[],  "invalid":[]}
    service.formatError = false
    service.fileName = ""

    service.validateData = function (file)
    {
        var fd = new FormData();
        fd.append('file', file);

        var call = $http.post(service.URL_VALIDATE, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
        call.success(service.setData)
        call.error(function (data,status,headers,config) {
            console.log(data)
            console.log(status)
            console.log(headers)
            console.log(config)
        })
    };

    service.getData = function (type)
    {
        return service.data[type];
    };

    service.setData = function(response)
    {
        if(response.error)
        {
            service.formatError= true;
            service.data = {"correct":[], "invalid":[]};
        }
        else
        {
            service.formatError = false;
            service.data = response.data;
        }
    };

    service.isFormatError = function()
    {
        return service.formatError;
    }

    service.setFileName = function(fileName)
    {
        service.fileName = fileName;
    }

    service.getFileName = function()
    {
        return service.fileName;
    }

    service.reset = function()
    {
        service.data = {"correct":[],  "invalid":[]}
        service.formatError = false
        service.fileName = ""
    }

    service.download = function(type)
    {
        var fileName = service.fileName.replace(".xlsx","") + "_" + type + ".xlsx";
        var stringData = JSON.stringify(service.data[type]).replace(/null/g, '""')
        var dataToExport = JSON.parse(stringData);
        alasql('SELECT * INTO XLSX("'+fileName+'",{headers:true}) FROM ?',[dataToExport]);
    }
}