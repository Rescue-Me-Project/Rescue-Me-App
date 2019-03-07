// when username is implemented the payload need to send in json format
//also probably the object will need to be created object(usernam,device_id)

(function(){
    'use strict';

    angular
        .module('connections')
        .factory('connectionSrvc', connectionSrvc)
    ;

    connectionSrvc.$inject = [
        'pushSrvc',
        '$q',
        '$timeout'

    ];

    function connectionSrvc(
        pushSrvc,
        $q,
        $timeout
    ) {
      
        vm.MESSAGE_TYPE_ID = { ACK : 0,
            NACK : 1,
            CONNECTION_REQUEST: 2,
            CONNECTION_RESPONSE: 3,
            MESSAGE: 4 };
vm.MESSAGE_PAYLOAD_TYPE_ID = { "STRING": 0,
        "INTEGER": 1,
        "JSON": 2
      };
vm.ACTIVITY = { SHOW: 1,
   SCAN: 2 };
vm.MESSAGE_TIMEOUT_SECONDS = 10;

vm.pushConnected = false;
vm.activity = 0;
vm.registrationId = "";

vm.uuid = false;

vm.inbound = { data: { },
rendered: "No messages yet." };

vm.subscriptionFeedback = "";

vm.pendingMessage = {};

    }

    vm.initialise = function initialise() {

        vm.inbound.rendered = "No registrationId yet...";
  
        pushSrvc.initialisePush( function deviceNowConnected( data ){
          console.log("controller initialised push, got payload ",data );
          vm.inbound.rendered = "Got connected payload";
          if (data.hasOwnProperty('registrationId')===true) {
  
            vm.registrationId = data.registrationId;
            vm.pushConnected = true;
  
            pushSrvc.setCallback( vm.handleInbound );
            pushSrvc.setTimeout( vm.MESSAGE_TIMEOUT_SECONDS * 1000 );
          }
        });
      };
  



})