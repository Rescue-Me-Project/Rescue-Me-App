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

        service.AddUser = function(user){
            
            user = user;
            if(!service.userExist())
            {
                console.log(user);
                var tempLocal = JSON.stringify(user);
                console.log(tempLocal);
                window.localStorage.setItem('localUser', tempLocal);
            }
        }

        service.getUser = function(){
            var tempLocal = window.localStorage.getItem('localUser');
            var localUser = JSON.parse(tempLocal);
            console.log(localUser);
            console.log("Name: " + localUser.name);
            return angular.copy(localUser);
        }

        service.userExist = function(){
            var tempLocal = window.localStorage.getItem('localUser');

            if(tempLocal != null)
                return true;
            else
                return false;
        }
        
        return service;
    }
})();
