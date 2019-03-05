(function (){
    'use strict';

    angular
        .module('main')
        .controller('loginCtrl', control);

    control.$inject = [
        'loginSrvc',
        '$state',
    ];

    function control(
        loginSrvc,
        $state,
    ) {
        var vm = angular.extend(this, {
            
        });
        
        vm.name="";
        
        vm.Change = function(){
            console.log("nameChange",vm.name);
        };

        vm.LogIn = function LogIn(){

            var user = {
                name : vm.name,
            };
            
            console.log(user);

            loginSrvc.AddUser(user);

            //Store User Somewhere
            //Will go into main.html if login is success 

            $state.go('main');
        };

        vm.Check = function Check(){
            var user = loginSrvc.userExist();

            if(user)
                $state.go('main');
        }
    }
})();