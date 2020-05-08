
$(document).ready(function($) {
    reloadMultiple();
});

function reloadMultiple()
{
    $('#multiselectTerritory').multiselect({
        search:{
            left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
            right: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
        },
        fireSearch: function(value)
        {
            return value.length > 1;
        }
    });

    $('#multiselectPermissions').multiselect({
        search:{
            left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
            right: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
        },
        fireSearch: function(value)
        {
            return value.length > 1;
        }
    });

    $('#multiselectSite').multiselect({
        search:{
            left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
            right: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
        },
        fireSearch: function(value)
        {
            return value.length > 1;
        }
    });

    $('#multiselectObject').multiselect({
        search:{
            left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
            right: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
        },
        fireSearch: function(value)
        {
            return value.length > 1;
        }
    });

    $('#multiselectModules').multiselect({
        search:{
            left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
            right: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
        },
        fireSearch: function(value)
        {
            return value.length > 1;
        }
    });

    $('#multiselectUsers').multiselect({
        search:{
            left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
            right: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
        },
        fireSearch: function(value)
        {
            return value.length > 1;
        }
    });

    $('#multiselectSection').multiselect({
        search:{
            left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
            right: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
        },
        fireSearch: function(value)
        {
            return value.length > 1;
        }
    });

    $('#multiselectForms').multiselect({
        search:{
            left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
            right: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
        },
        fireSearch: function(value)
        {
            return value.length > 1;
        }
    });

    $('#multiselectRoles').multiselect({
        search:{
            left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
            right: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
        },
        fireSearch: function(value)
        {
            return value.length > 1;
        }
    });

    $('#multiselectInputOptions').multiselect({
        search:{
            left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
            right: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
        },
        fireSearch: function(value)
        {
            return value.length > 1;
        }
    });

    $('#multiselectAnswers').multiselect({
        search:{
            left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
            right: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
        },
        fireSearch: function(value)
        {
            return value.length > 1;
        }
    });
    $('#multiselectDevices').multiselect({
        search:{
            left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
            right: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
        },
        fireSearch: function(value)
        {
            return value.length > 3;
        }
    });
    $('#multiselectGroups').multiselect({
        search:{
            left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
            right: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
        },
        fireSearch: function(value)
        {
            return value.length > 3;
        }
    });

    $('#multiselectRules').multiselect({
        search:{
            left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
            right: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
        },
        fireSearch: function(value)
        {
            return value.length > 3;
        }
    });
}


function getOptionsLeft(idElement)
{
    var option = [];
    $.each($("#" + idElement + " option"), function(){
        option.push($(this).val());
    });
    return option;
}

function getOptionsRight(idElement)
{
    var option = [];
    $.each($("#" + idElement + "_to option"), function(){
        option.push($(this).val());
    });
    return option;
}

function setOptions(idElement,values,key)
{
    $("#" + idElement).empty();
    for(i = 0; i < values.length;++i)
    {
        $("#" + idElement).append($("<option></option>").attr("value", values[i]["id"]).text(values[i][key]));
    }
}
