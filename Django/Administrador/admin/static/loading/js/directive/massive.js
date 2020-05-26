export function directiveFile(ServiceMassive)
{
    return  {
        restrict: 'A',
        link: linkDirective
    }

    function linkDirective($scope,element, attrs)
    {
        element.bind('change', function(event) 
        {
            var files = event.target.files;
            var file = files[0];
            ServiceMassive.reset();
            ServiceMassive.setFileName(file.name);
            $scope.$apply()
        });

    }
}