var markdownApp = angular.module('markdownApp', ['angularFileUpload', 'ngSanitize']);

markdownApp.filter('trustAsHtml', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
});

markdownApp.controller('appCtrl',function($scope, $upload, $http){
    var converter = new Showdown.converter();
    $scope.showUpload = false;
    $scope.preview = '';
    $scope.convertToHTML = function () {
        $scope.preview = converter.makeHtml($scope.markdown);
    }
    $scope.saveMarkdown = false;
    $scope.saveHTML = false;
    $scope.showSyntaxCheatSheet = false;
    $scope.save = function () {
        if($scope.filename === "") {
            alert('input a filename');
        }
        if($scope.saveHTML&&$scope.saveMarkdown){
            if($scope.markdown === "" || $scope.preview === "") {
                alert('content of markdown or preview is empty, try parsing mardown to html first');
            }else{
                var data = {};
                data.html = encodeURIComponent($scope.preview);
                data.markdown = $scope.markdown;
                data.filename = $scope.filename;
                $http({
                    method: 'POST',
                    url: 'save.php',
                    data: data
                }).success(function(data){
                    if(data.status){
                        alert('success');
                        $scope.saveHTML = false;
                        $scope.saveMarkdown = false;
                    }
                }).error(function(data,status){
                    alert('Can\'t connect to PHP Server');
                    $scope.saveMarkdown = false;
                    $scope.saveHTML = false;
                });
            }
        }else if($scope.saveHTML){
            if($scope.preview === "") {
                alert('content of preview is empty, try cprsing mardown to html first');
            }else{
                var data = {};
                data.html = encodeURIComponent($scope.preview);
                data.filename = $scope.filename;
                $http({
                    method: 'POST',
                    url: 'save.php',
                    data: data
                }).success(function(data){
                    if(data.status){
                        alert('success');
                        $scope.saveHTML = false;
                    }
                }).error(function(data,status){
                    alert('Can\'t connect to PHP Server');
                    $scope.saveHTML = false;
                });
            }
        }else{
            if($scope.markdown === "") {
                alert('content of markdown is empty');
            }else{
                var data = {};
                data.markdown = $scope.markdown;
                data.filename = $scope.filename;
                $http({
                    method: 'POST',
                    url: 'save.php',
                    data: data
                }).success(function(data){
                    if(data.status){
                        alert('success');
                        $scope.saveMarkdown = false;
                    }
                }).error(function(data,status){
                    alert('Can\'t connect to PHP Server');
                    $scope.saveMarkdown = false;
                });
            }
        }
    };
    $scope.fileChange = function($files){
        $upload.upload({
            url: 'readMd.php',
            file: $files[0]
        }).success(function(data,status,headers,config){
            $scope.markdown = data;
            $scope.showUpload = !$scope.showUpload;
            $scope.filename = $files[0].name.substr(0, $files[0].name.indexOf('\.'));
        }).error(function(data,status){
            alert("Can't connect to PHP Server");
            $scope.showUpload = false;
        });
    }
});
