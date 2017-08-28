angular.module('HomeCtrl', ['ngFileUpload'])
.controller('HomeController',['Upload','$window',function(Upload,$window){
    var vm = this;
    vm.submit = function(){ //function to call on form submit
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            vm.upload(vm.file); //call upload function
        }
    }
    vm.upload = function (file) {
        Upload.upload({
            url: './csvupload', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                console.log("worked");
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
        }, function (evt) { 
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };
}]);


/*
.directive('dropTarget', function(){
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
            }
        });
    };
  });

*/