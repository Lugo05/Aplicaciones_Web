export function serviceMassive ($http)
{
    this.data = {
        "correct":{
            "headers":["Usuario","Clave"],
            "data":[{"usuario":"usuario1","clave":"clave1"}]
        }, 
        "invalid":{
            "headers":["Usuario","Clave"],
            "data":[{"usuario":"usuario2","clave":"clave2"}]
        }
    }
    this.formatError = false
    this.urlValidate = "/loading/validate/"

    this.validateData = function (file)
    {
        var fd = new FormData();
        fd.append('file', file);

        var call = $http.post(this.urlValidate, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
        call.success(this.setData)
    };

    this.isFormatError = function()
    {
        console.log("Service")
        console.log(window.location.pathname);
        return this.formatError;
    }

    this.getData = function (type)
    {
        return this.data[type];
    };

    this.sendCorrectData = function()
    {
        return 1;
    };

    this.setData = function(response)
    {
        if(response.error)
        {
            this.formatError= true;
            this.data = {"correct":null, "invalid":null};
        }
        else
        {
            this.formatError = false;
            this.data = response.data;
        }
    };
}