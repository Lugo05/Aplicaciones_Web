export var tableValidation = {

    controller : ['$attrs','ServiceMassive', function($attrs,ServiceMassive) 
    {
        var vm = this

        vm.classes = {"invalid":"table-danger", "correct":"table-success"}
        vm.titles = {"correct":"Registros válidos", "invalid":"Registros erroneos"}

        vm.type = $attrs.type;
        vm.class = vm.classes[vm.type]
        vm.title = vm.titles[vm.type]

        //data from service
        vm.data = function() 
        {
            return ServiceMassive.getData(vm.type)
        } 

        vm.visible = function()
        {
            var formatError = ServiceMassive.isFormatError();
            var length_data = ServiceMassive.getData(vm.type).length;
            return (!formatError && length_data > 0)
        }

        vm.isArray = function(value)
        {
            return Array.isArray(value)
        }

        vm.download = function()
        {
            ServiceMassive.download(vm.type);
        }

        //funcitons
        vm.$onInit = init 

        function init(){}

    }],
    templateUrl : '/static/loading/js/component/tableValidation.html'
};