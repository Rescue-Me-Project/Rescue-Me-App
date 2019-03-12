(function () {
  'use strict';

  angular
    .module('main' )
    .controller('mainCtrl', mainCtrl);

  mainCtrl.$inject = [
    '$ionicPlatform',
    '$scope',
    '$state',
    '$sce',
    '$http',
    'pushSrvc',
    'loginSrvc',
    'userSrvc',
    'connectionSrvc',
    'uuid'
  ];
2
  function mainCtrl(
    $ionicPlatform,
    $scope,
    $state,
    $sce,
    $http,
    pushSrvc,
    loginSrvc,
    userSrvc,
    connectionSrvc,
    uuid
  ) {

    var vm=angular.extend(this, {

    });

    vm.isRescuer = false;
    vm.isRescuee = false;

    vm.user = loginSrvc.getUser(); //d

    //USER ROLES
    vm.role = undefined; //d
    vm.otherRole = undefined; //d

    vm.ROLE_STRINGS = [ "Rescuer",
						            "Rescuee" ];


    //d
    vm.setRescuer = function setRescuer( ) {
      console.log("setting as rescuer");

      var tempUserState = userSrvc.setRescuer();

      vm.role = tempUserState.role;
      vm.otherRole = tempUserState.otherRole;
      vm.activity = connectionSrvc.ACTIVITY.SHOW; //d
    };

    //d
    vm.setRescuee = function setRescuee( ) {
      console.log("setting as rescue*e*");
      
      var tempUserState = userSrvc.setRescuee();

      vm.role = tempUserState.role;
      vm.otherRole = tempUserState.otherRole;
      vm.activity = connectionSrvc.ACTIVITY.SHOW; //d
    };

    vm.pushConnected = service.pushConnected; //d
    vm.activity = service.activity;
    vm.registrationId = service.registrationId;

    vm.uuid = service.uuid;
    vm.inbound = service.inbound;
    vm.subscriptionFeedback = service.subscriptionFeedback;

    vm.startCodeScan = function startCodeScan(){
      connectionSrv.startCodeScan();
    }
  
    vm.pingOther = function pingOther(){
      connectionSrvc.pingOther();
    }
  
    //d
    vm.initialise = function(){
        connectionSrvc.initialise();
    }
  }
})();
