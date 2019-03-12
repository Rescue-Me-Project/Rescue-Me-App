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
    'uuid',
    'connectionSrvc'
  ];
2
  function mainCtrl(
    $ionicPlatform,
    $scope,
    $state,
    $sce,
    uuid,
    connectionSrvc
  ) {

    var vm=angular.extend(this, {

    });

    vm.isRescuer = false;
    vm.isRescuee = false;

    vm.role = undefined; //d
    vm.otherRole = undefined;

	  vm.ROLES = { RESCUER : 0,
			  	       RESCUEE : 1 };
	  vm.ROLE_STRINGS = [ "Rescuer",
						            "Rescuee" ];


    vm.pushConnected = service.pushConnected; //d
    vm.activity = service.activity;
    vm.registrationId = service.registrationId;

    vm.uuid = service.uuid;
    vm.inbound = service.inbound;
    vm.subscriptionFeedback = service.subscriptionFeedback;
    vm.pendingMessage = 
    vm.setRescuer = function setRescuer( ) { //main controller
      console.log("setting as rescuer");
      vm.role = vm.ROLES.RESCUER;
      vm.otherRole = vm.ROLES.RESCUEE;
      vm.activity = vm.ACTIVITY.SHOW;
    };

    vm.setRescuee = function setRescuee( ) { //main controller
      console.log("setting as rescue*e*");
      vm.role = vm.ROLES.RESCUEE;
      vm.otherRole = vm.ROLES.RESCUER;
      vm.activity = vm.ACTIVITY.SCAN;
    };
  }

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

})();
