(function(){

    
    var listeners = {},
        file = {
            name:'',
            data:null
        }
    
    function change(){
        for(var l of Object.keys(listeners)){
            listeners[l]();
        }
    }
    
    angular.module('HomeCtrl', []).controller('HomeController', function($scope, $http) {

        $scope.fileName = '';
        
        $scope.uploadFile = function(files) {
            var fd = new FormData();
            fd.append("file", $scope.thefile);            
            
            $http.post('./csvUpload',fd, {
                headers: {
                  'Content-Type': 'undefined',
                  'Encryption-Type': "multipart/form-data"
                },
                transformRequest: angular.identity
            })
            .then(function(response){
                console.log(response);
            });
        };
        

    }).directive('dropTarget', function(){
        return function($scope, $element){
            $element.on('dragover', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
            $element.on('dragenter', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });        

            $element.bind('drop', function(e){
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer){
                    console.log(e.dataTransfer.files[0]);
                    file.data = e.dataTransfer.files[0];
                    file.name = e.dataTransfer.files[0].name;
                    change();
                }
            });
        };
      });
})();