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
        vm.role=null;
        
        //QRCode Connection is a url
        //Maybe have the push service send the user object data and receive connection's user data

        vm.change = function(){
            console.log("nameChange",vm.name);
            console.log("roleChange",vm.role);
        };

        vm.addContact = function addContact(){

            var person = {
                name : vm.name,
                role: role
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