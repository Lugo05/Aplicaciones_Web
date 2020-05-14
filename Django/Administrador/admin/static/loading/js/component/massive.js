export var tableValidation = {
    bindinds: {
        type : '='
    },
    controller : ['$attrs','ServiceMassive', function($attrs,ServiceMassive) {
        this.classes = {"invalid":"table-danger", "correct":"table-success"}
        this.type = $attrs.type
        this.data = ServiceMassive.getData(this.type)
        this.class = this.classes[this.type]
    }],
    templateUrl : '/static/loading/js/component/tableValidation.html'
};