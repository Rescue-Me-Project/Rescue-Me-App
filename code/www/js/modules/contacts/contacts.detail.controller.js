(function (){
    'use strict';

    angular
        .module('contactsjs')
        .controller('contactsDetailCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'contactsSrvc'
    ];

    function control(
        $state,
        $stateParams,
        contactsSrvc
    ) {
        var vm = angular.extend(this, {
            contact: {}
        });

        vm.done = function(){
            $state.go('contacts_module');
        }

        console.log($stateParams);
        var params = $stateParams;
        console.log(params);
        vm.contact = contactsSrvc.getContact(params.selected);
    }
})();