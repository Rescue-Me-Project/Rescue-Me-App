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

    vm.user = loginSrvc.getUser(); //d

    //USER ROLES
    vm.role = undefined; //d
    vm.otherRole = undefined; //d
    var temp = {};
    vm.ROLE_STRINGS = [ "Rescuer",
						            "Rescuee" ];


    //d
    vm.setRescuer = function setRescuer( ) {
      console.log("setting as rescuer");

      var tempUserState = userSrvc.setRescuer();

      vm.role = tempUserState.role;
      vm.otherRole = tempUserState.otherRole;
      vm.activity = 1; //d
    };

    //d
    vm.setRescuee = function setRescuee( ) {
      console.log("setting as rescue*e*");
      
      var tempUserState = userSrvc.setRescuee();

      vm.role = tempUserState.role;
      vm.otherRole = tempUserState.otherRole;
      vm.activity = 2; //d
    };

    //Should Main Controller
    vm.getProperties = function(){
      
      temp = connectionSrvc.getProperties();
      vm.pushConnected = temp.pushConnected;
      vm.registrationId = temp.registrationId;
      vm.uuid = temp.uuid;
      vm.inbound = temp.inbound;
      vm.subscriptionFeedback = temp.subscriptionFeedback;
    } //Don't know how to update this, code is not running when we run main for the first time

    vm.startCodeScan = function startCodeScan(){
      connectionSrv.startCodeScan();
    };
  
    vm.pingOther = function pingOther(){
      connectionSrvc.pingOther();
    };
  
    //d
    vm.initialise = function(){
        connectionSrvc.initialise();
        vm.getProperties();
    };
  }
})();
