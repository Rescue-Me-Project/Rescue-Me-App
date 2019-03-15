(function (){
    'use strict';

    angular
        .module('contactsjs')
        .controller('contactsDetailCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'contactsSrvc',
        'connectionSrvc'
    ];

    function control(
        $state,
        $stateParams,
        contactsSrvc,
        connectionSrvc
    ) {
        var vm = angular.extend(this, {
            contact: {}
        });

        vm.startCodeScan = function startCodeScan(){
            connectionSrvc.startCodeScan(vm.contact);
        }

        vm.pingOther = function pingOther()
        {
            connectionSrvc.pingOther(vm.contact);
        }

        vm.done = function(){
            $state.go('contacts_module');
        }

        console.log($stateParams);
        var params = $stateParams;
        console.log(params);
        vm.contact = contactsSrvc.getContact(params.selected);
    }
})();