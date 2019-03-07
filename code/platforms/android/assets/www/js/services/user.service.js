(function () {
    'use strict';
    console.log("userSrvc executed");

    angular
        .module('user', [])
        .factory('userSrvc', userSrvc);

    function userSrvc() {
        
        var service = {

        };

        var role = undefined;
        var otherRole = undefined;
        var hasRole = false;

	    var ROLES = { RESCUER : 0,
			  	       RESCUEE : 1 };
                            
        service.setRescuer = function setRescuer( ) {
            console.log("setting as rescuer");
            role = ROLES.RESCUER;
            otherRole = ROLES.RESCUEE;

            var result = {
                role : role,
                otherRole : otherRole
            }
            return result;
        };

        service.setRescuee = function setRescuee( ) {
            console.log("setting as rescue*e*");
            role = ROLES.RESCUEE;
            otherRole = ROLES.RESCUER;

            var result = {
                role : role,
                otherRole : otherRole
            }

            return result;
        };

        service.getRole = function getRole() {
            console.log("getting user state");
            
            if(role != undefined)
            {
                var result = {
                    role : role,
                    otherRole : otherRole,
                    hasRole : true
                } 

                
            }
            else
            {
                var result = {
                    role : undefined,
                    otherRole : undefined,
                    hasRole : false
                } 
            }
            return result;
        }

        return service;
    }
})();
