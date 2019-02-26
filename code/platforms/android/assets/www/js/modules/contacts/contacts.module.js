(function() {
    'use strict';

    angular
        .module('contactsjs',['angular-uuid'])
        .config(function($stateProvider){
            $stateProvider
                .state('contacts_list', {
                    cache: false,
                    url: '/contacts_list',
                    templateUrl: 'js/app_specific/contacts/contacts.list.html',
                    controler: 'contactsListCtrl as vm'
                })
                .state('contacts_detail', {
                    cache: false,
                    url: '/contacts_detail',
                    templateUrl: 'js/app_specific/contacts/contacts.detail.html',
                    controller: 'contactsDetailCtrl as vm'
                })
                .state('contacts_add', {
                    cache: false,
                    url: '/contacts_add',
                    templateUrl: 'js/app_specific/contacts/contacts.add.html',
                    controller: 'contactsAddCtrl as vm'
                })
                .state('events_module', {
					cache: false,
					url: '/events_module',
					templateUrl: 'js/app_specific/events/events.list.html',
					controller: 'eventsListCtrl as vm'
				})
        });

})();