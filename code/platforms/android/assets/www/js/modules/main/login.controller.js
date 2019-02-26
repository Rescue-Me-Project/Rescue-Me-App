(function (){
    'use strict';

    angular
        .module('main')
        .controller('loginCtrl', ['uuid', control]);

    control.$inject = [
        '$state'
    ];

    function control(
        $state
    ) {
        var vm = angular.extend(this, {
            
        });
        
        vm.name="";
        
        vm.Change = function(){
            console.log("nameChange",vm.name);
        };

        vm.LogIn = function LogIn(){

            var UUID = uuid.v4()
            
            var user = {
                name : vm.name,
                UUID : UUID
            }
            
            console.log(user);

            //Store User Somewhere
            //App will check if they can find user
            //Will go into main.html if login is success 
        };

        vm.Check() = function Check(){

            //Check if there are user details stored locally
            //if success
            //$state.go('main');
            //else
            //goes to login page
        }
    }
})();