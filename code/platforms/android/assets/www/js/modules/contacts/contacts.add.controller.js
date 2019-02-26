console.log("I LIVE!");
(function (){
    'use strict';

    angular
        .module('contactsjs')
        .controller('contactsAddCtrl', control);

    control.$inject = [
        '$state',
        'contactsSrvc',
        '$scope'
    ];

    function control(
        $state,
        contactsSrvc,
    ) {
        var vm = angular.extend(this, {
            
        });
        
        vm.name="";
        vm.age=null;
        
        vm.change = function(){
            console.log("nameChange",vm.name);
            console.log("ageChange", vm.age);
        };

        vm.addContact = function addContact(){

            var person = {
                name : vm.name,
                age : vm.age
            }
            console.log(person);

            contactsSrvc.createContacts(person);

            $state.go('contacts_module');
        };

        vm.back = function(){
            $state.go('contacts_module');
        }

        vm.switch = function(){
            $state.go('events_module');
        }
    }
})();