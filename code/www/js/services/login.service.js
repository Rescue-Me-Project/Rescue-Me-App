(function () {
    'use strict';
    console.log("loginSrvc executed");
    angular
        .module('login', [])
        .factory('loginSrvc', loginSrvc);

    function loginSrvc(
    ) {
        var service = {

        };
        
        var userStorage = [];

        service.AddUser = function(user){
            
            user = user;
            userStorage.push(user);

            console.log(user);
        }

        service.getUser = function(){
            console.log(userStorage[0]);
            return angular.copy(userStorage[0]);
        }
        
        return service;
    }
})();
