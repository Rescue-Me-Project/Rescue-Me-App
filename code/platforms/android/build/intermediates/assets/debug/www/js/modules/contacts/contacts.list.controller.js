(function () {
    'use strict';

    angular
        .module('contactsjs')
        .controller('contactsListCtrl', control);

    control.$inject = [
        '$state',
        'contactsSrvc',
        'userSrvc'
    ];

    function control(
        $state,
        contactsSrvc,
        userSrvc
    ) {
        var vm = angular.extend(this, {
            contacts : []
        });

        var tempRole = userSrvc.getRole();

        vm.role = tempRole.role;
        vm.otherRole = tempRole.otherRole;
        vm.hasRole = tempRole.hasRole;

        vm.ROLE_STRINGS = [ "Rescuer",
						    "Rescuee" ];

        vm.onItemSelected = function(index){
            console.log("Contact : " + index);

            var item = vm.contacts[index];
            var UUID = item.UUID;

            console.log(UUID);
            
            $state.go('contacts_detail', {selected : UUID});
        }

        vm.noContacts = function(){
            return vm.contacts.length == 0;
        }

        vm.addContact = function(){
            $state.go('contacts_add');
        }
        
        vm.switch = function(){
            $state.go('main');
        }

        vm.contacts = contactsSrvc.getContactsArray(vm.role);
    }
})();