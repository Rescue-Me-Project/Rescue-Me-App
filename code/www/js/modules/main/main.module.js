(function() {
  'use strict';

  angular
    .module('main', [
      'angular-uuid',
      'monospaced.qrcode',
      'push',
      'login',
      'connection',
      'user'
    ])
    .config(function($stateProvider){
      $stateProvider
        .state('main', {
          url: '/main',
          templateUrl: 'js/modules/main/main.html',
          controller: 'mainCtrl as vm'
        })
        .state('login', {
          url: '/login',
          templateUrl: 'js/modules/main/login.html',
          controller: 'loginCtrl as vm'
        })
        .state('contacts_module', {
					cache: false,
					url: '/contacts_module',
					templateUrl: 'js/modules/contacts/contacts.list.html',
					controller: 'contactsListCtrl as vm'
        });
      });
})();
