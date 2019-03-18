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

    vm.user = loginSrvc.getUser();

    //USER ROLES
    vm.role = undefined;
    vm.otherRole = undefined;

    vm.ROLE_STRINGS = [ "Rescuer",
						            "Rescuee" ];
                 
    vm.setRescuer = function setRescuer( ) {
      var tempUserState = userSrvc.setRescuer();

      vm.role = tempUserState.role;
      vm.otherRole = tempUserState.otherRole;
      vm.activity = vm.ACTIVITY.SHOW;
    };

    vm.setRescuee = function setRescuee( ) {
      var tempUserState = userSrvc.setRescuee();

      vm.role = tempUserState.role;
      vm.otherRole = tempUserState.otherRole;
      vm.activity = vm.ACTIVITY.SCAN;
    };
                        
    //MESSAGES
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
    
    //FUNCTIONS
    vm.initialise = function initialise() {

      vm.inbound.rendered = "No registrationId yet...";

      pushSrvc.initialisePush( function deviceNowConnected( data ){
        console.log("controller initialised push, got payload ",data );
        vm.inbound.rendered = "Got connected payload";
        if (data.hasOwnProperty('registrationId')===true) {

          vm.registrationId = data.registrationId;
          console.log("Registration ID from main: ", vm.registrationId);
          connectionSrvc.setRegistrationID(vm.registrationId);
          console.log("registration ID from service: ", connectionSrvc.getRegistrationID());
          vm.pushConnected = true;

          pushSrvc.setCallback( vm.handleInbound );
          pushSrvc.setTimeout( vm.MESSAGE_TIMEOUT_SECONDS * 1000 );
        }
      });
    };

    vm.startCodeScan = function startCodeScan() {
      connectionSrvc.startCodeScan(vm.uuid);
    };

    vm.handleInbound = function handleInbound( data ) {
      console.log("got inbound message", data);

      if(data.hasOwnProperty("payload")) {
        angular.merge( vm.inbound.data, data.payload );
        vm.inbound.rendered = "Got inbound message - type "+
          Object.keys(vm.MESSAGE_TYPE_ID)[ data.payload.message_type ];

        if(data.payload.hasOwnProperty("sender_id")) {
          if(data.payload.sender_id===vm.registrationId ) {
            // skip this; we sent it.
            console.log("ignoring message as we sent it!", data);
            return;
          }
        }

        // return payload to correct data format
        var payload = data.payload;
        if(payload.payload_format_type === vm.MESSAGE_PAYLOAD_TYPE_ID.INTEGER) {
          payload.payload = parseInt( payload.payload );
        } else if (payload.payload_format_type === vm.MESSAGE_PAYLOAD_TYPE_ID.JSON ) {
          payload.payload = JSON.parse( payload.payload );
        }

        // is this a connection request?
        if (payload.message_type === vm.MESSAGE_TYPE_ID.CONNECTION_REQUEST) {
          // connection request! send back a confirmation - response to message in line 127
          var responsePayload = {
            connection_id: payload.connection_id,
            sender_id: vm.registrationId,
            recipient_id: payload.sender_id,
            message_id: payload.message_id,
            message_type: vm.MESSAGE_TYPE_ID.CONNECTION_RESPONSE,
            sender_role: vm.role,
            payload: payload.payload,
            payload_format_type: vm.MESSAGE_PAYLOAD_TYPE_ID.STRING
          };
          
          //Initial Connection?
          pushSrvc.sendPayload( responsePayload ).then( function sendPayloadOkay(indata) {
            console.log('intial connection confirmation sent okay - got ',indata );
            vm.uuid = payload.connection_id;
            // subscribe to this topic
            pushSrvc.subscribe( vm.uuid );
          }, function failedSending(err) {
            console.log('error sending first message - ',err);
            alert("Problem sending confirmation payload - "+err);
          });
        }
        if (payload.message_type === vm.MESSAGE_TYPE_ID.CONNECTION_RESPONSE) {
          // this is the confirmation of the other user - message from line 185
          vm.uuid = payload.connection_id;
          // subscribe to this topic
          pushSrvc.subscribe(vm.uuid);
        }

        //LOOK HERE
        //CREATE A NEW MESSAGE TYPE 5
        //TRIGGERS A FUNCTION SIMILAR TO PINGOTHER CALL REPLYPING WHICH SENDS A PAYLOAD SAYING READ
        if (payload.message_type === vm.MESSAGE_TYPE_ID.MESSAGE) {
          // an inbound message
          alert(payload.payload.message);
          
          //Experimental Automated Message Response, issue with this is that it'll trigger an infinite loop of messages
          //Make Response function in connection service where it would send a message saying "X has read this!" when it receives a ping from another user
          //Ignore this for now
          connectionSrvc.pingReply(payload.connection_id);
          
          return;
          // don't ack, at least on this version!
          vm.pendingMessage = payload.payload;
          // send a delivery ack before displaying
          var responsePayload = {
            connection_id: vm.uuid,
            sender_id: vm.registrationId,
            recipient_id: payload.sender_id,
            message_id: payload.message_id,
            message_type: vm.MESSAGE_TYPE_ID.ACK,
            sender_role: vm.role,
            payload: "0",
            payload_format_type: vm.MESSAGE_PAYLOAD_TYPE_ID.INTEGER
          };
          pushSrvc.sendPayload( responsePayload ).then( function sendPayloadOkay(indata) {
            console.log('message '+responsePayload.messageId+' acknowledgement delivered okay.');
            //if(payload.payload.hasOwnProperty("message")) {
            //alert(payload.payload.message);
            //}
          }, function failedSending(err) {
            console.log('error acknowledgeing '+responsePayload.message_id);
            alert("Problem acknowledgeing an inbound message.");
          });
        }

        if (payload.message_type === vm.MESSAGE_TYPE_ID.REPLY) {
          // a reply message
          alert(payload.payload.message);
        }
      }
    };

    vm.pingOther = function pingOther() {
      connectionSrvc.pingOther();
    };

    vm.switch = function()
    {
      $state.go("contacts_module");
    }

    vm.initialise();

  }
})();
