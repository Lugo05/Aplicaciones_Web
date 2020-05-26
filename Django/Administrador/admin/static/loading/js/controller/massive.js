export function controllerMassive(ServiceMassive)
{
    var vm = this

    //functions
    vm.validateFile = onClickValidateFile;
    vm.$onInit = init;

    //data from service 
    vm.formatError = function()
    {
        return ServiceMassive.isFormatError();
    }

    vm.fileName = function()
    {
        var file = ServiceMassive.getFileName();
        if (file === "")
            return "No se ha seleccionado un archivo"
        else
            return "ARCHIVO SELECCIONADO: " + file;
    }

    vm.isEmptyCorrectData = function()
    {
        var aux = ServiceMassive.getData("correct");
        return (aux.length == 0);
    }

    vm.fileLoaded = function()
    {
        var file = ServiceMassive.getFileName();
        return !(file === "")
    }

    function init(){}

    function onClickValidateFile()
    {
        var files = document.getElementById("form_file").files;
        var file = files[0]
        console.log(file.name)
        ServiceMassive.validateData(file);
    }
}