/*$scope.leftOptionsTerritories = [];
$scope.rightOptionsTerritories = [];
$scope.leftOptionsSites = [];
$scope.rightOptionsSites = [];
$scope.leftOptionsObjects = [];
$scope.rightOptionsObjects = [];
$scope.leftOptionsUsers = [];
$scope.rightOptionsUsers = [];
$scope.leftOptionsModules = [];
$scope.rightOptionsModules = [];
$scope.leftOptionsSections = [];
$scope.rightOptionsSections = [];//
$scope.leftOptionsForms = [];
$scope.rightOptionsForms = [];
$scope.leftOptionsRoles= [];//
$scope.rightOptionsRoles = [];
$scope.leftOptionsInOptions= [];
$scope.rightOptionsInOptions = [];
$scope.leftOptionsDevices = [];
$scope.rightOptionsDevices = [];
$scope.leftOptionsAnswers = [];
$scope.rightOptionsAnswers = [];
$scope.leftOptionsGroups= [];
$scope.rightOptionsGroups = [];*/


var STATE_ACTIVE = 0;
var STATE_NOT_OWN = 1;
var STATE_NOT_ACTIVE = 2;

function getDate(milliseconds)
{
    var hh,yyyy,mm,dd,ii;
    var date = new Date(milliseconds);
    yyyy = date.getFullYear();
    mm =  date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    hh =  date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    ii = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + ii;
}

function complement(set,subset)
{
    if(subset == null)
        return set;
    if(set == null)
        return [];
    var notFound = true;
    var setComplemet = [];
    for(var i=0;i<set.length;++i)
    {
        for(var j=0;j< subset.length;++j)
        {
            if(set[i].id==subset[j].id)
            {
                notFound = false;
                break;
            }
        }
        if(notFound)
            setComplemet.push(set[i]);
        notFound = true;
    }
    return setComplemet;
}

function addStateNotActive(set,setInactive=[])
{
    if(set == null)
        return [];
    for(var i=0;i<set.length;++i)
    {
        idIn = false;
        for(var j = 0; j < setInactive.length; ++j)
        {
            if(set[i]["id"] == setInactive[j]["id"])
            {
                set[i]["state_admin"] = STATE_NOT_ACTIVE;
                idIn = true;
                break;
            }
        }
        if(!idIn)
            set[i]["state_admin"] = STATE_NOT_OWN;
    }
    return set;
}

function addStateActive(set)
{
    if(set == null)
        return [];
    if(set == null)
        return [];
    for(var i=0;i<set.length;++i)
        set[i]["state_admin"] = STATE_ACTIVE;

    return set;
}

function getRemoved(set)
{
    if(set == null)
        return [];
    var setRemoved = [];
    for(var i=0;i<set.length;++i)
    {
        if(set[i]["state_admin"] == STATE_ACTIVE)
            setRemoved.push(set[i]);
    }
    return setRemoved;
}

function getAdded(set)
{
    if(set == null)
        return [];
    var setAdded = [];
    for(var i=0;i<set.length;++i)
    {
        if(set[i]["state_admin"] == STATE_NOT_OWN)
            setAdded.push(set[i]);
    }
    return setAdded;
}

function getReAdded(set)
{
    if(set == null)
        return [];
    var setReAdded = [];
    for(var i=0;i<set.length;++i)
    {
        if(set[i]["state_admin"] == STATE_NOT_ACTIVE)
            setReAdded.push(set[i]);
    }
    return setReAdded;
}

function getSubsetByIds(set,ids)
{
    if(set == null)
        return [];
    var subset = [];
    for(var j = 0;j<ids.length;++j)
    {
        for(var i=0;i<set.length;++i)
        {
            if(set[i]["id"] == ids[j])
            {
                subset.push(set[i]);
                break;
            }
        }
    }
    return subset;
}
