(function() {
    'use strict';

    angular
        .module('contactsjs',[
            'angular-uuid',
            'contactsService'
        ])
        .config(function($stateProvider){
           $stateProvider
                .state('contacts_list', {
                    cache: false,
                    url: '/contacts_list',
                    templateUrl: 'js/modules/contacts/contacts.list.html',
                    controler: 'contactsListCtrl as vm'
                })
                .state('contacts_detail', {
                    cache: false,
                    url: '/contacts_detail',
                    templateUrl: 'js/modules/contacts/contacts.detail.html',
                    controller: 'contactsDetailCtrl as vm'
                })
                .state('contacts_add', {
                    cache: false,
                    url: '/contacts_add',
                    templateUrl: 'js/modules/contacts/contacts.add.html',
                    controller: 'contactsAddCtrl as vm'
                })
        });

})();