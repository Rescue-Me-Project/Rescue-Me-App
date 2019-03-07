(function () {
    'use strict';
    console.log("userSrvc executed");

    angular
        .module('userService', [])
        .factory('userSrvc', userSrvc);

    function userSrvc() {
        
        var service = {

        };

        var role = undefined;
        var otherRole = undefined;

	    var ROLES = { RESCUER : 0,
			  	       RESCUEE : 1 };
	    var ROLE_STRINGS = [ "Rescuer",
                            "Rescuee" ];
                            
        service.setRescuer = function setRescuer( ) {
            console.log("setting as rescuer");
            role = ROLES.RESCUER;
            otherRole = ROLES.RESCUEE;

            return
        };

        service.setRescuee = function setRescuee( ) {
            console.log("setting as rescue*e*");
            vm.role = vm.ROLES.RESCUEE;
            vm.otherRole = vm.ROLES.RESCUER;
        };

        return service;
    }
})();
