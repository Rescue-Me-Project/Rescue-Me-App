// when username is implemented the payload need to send in json format
//also probably the object will need to be created object(usernam,device_id)

(function(){
  'use strict';
  console.log("connectionSrvc executed");
  
  angular
      .module('connection', [])
      .factory('connectionSrvc', connectionSrvc)
  ;

  connectionSrvc.$inject = [
      'pushSrvc',
      '$q',
      '$timeout',
      'uuid'

  ];

  function connectionSrvc(
      pushSrvc,
      $q,
      $timeout,
      uuid
  ) {
    
    var service = {};


    service.MESSAGE_TYPE_ID = { ACK : 0,
              NACK : 1,
              CONNECTION_REQUEST: 2,
              CONNECTION_RESPONSE: 3,
              MESSAGE: 4 
            };

    service.MESSAGE_PAYLOAD_TYPE_ID = { "STRING": 0,
          "INTEGER": 1,
          "JSON": 2
        };

    service.ACTIVITY = { 
      SHOW: 1,
      SCAN: 2 
    };

    service.MESSAGE_TIMEOUT_SECONDS = 10;

    service.pushConnected = false;

    service.activity = 0;
    service.registrationId = "";

    service.uuid = false;

    service.inbound = { 
      data: { },
      rendered: "No messages yet." 
    };

    service.pendingAcks = [];

    service.subscriptionFeedback = "";

    service.pendingMessage = {};
    
    //Inside Connection Service
    service.getProperties = function(){
      var properties = {
        pushConnected : service.pushConnected,
        activity : service.activity,
        registrationId : service.registrationId,
        uuid : service.uuid,
        inbound : service.inbound,
        subscriptionFeedback : service.subscriptionFeedback

      }

      return properties
    }
    service.initialise = function initialise() {

          service.inbound.rendered = "No registrationId yet...";

          pushSrvc.initialisePush( function deviceNowConnected( data ){
            console.log("controller initialised push, got payload ",data );
            service.inbound.rendered = "Got connected payload";
            if (data.hasOwnProperty('registrationId')===true) {

              service.registrationId = data.registrationId;
              service.pushConnected = true;

              pushSrvc.setCallback( service.handleInbound );
              pushSrvc.setTimeout( service.MESSAGE_TIMEOUT_SECONDS * 1000 );
            }
          });
        };

    service.handleInbound = function handleInbound( data ) { //connectionSrvc 
      console.log("got inbound message", data);

      if(data.hasOwnProperty("payload")) {
        angular.merge( service.inbound.data, data.payload );
        service.inbound.rendered = "Got inbound message - type "+
          Object.keys(service.MESSAGE_TYPE_ID)[ data.payload.message_type ];

        if(data.payload.hasOwnProperty("sender_id")) {
          if(data.payload.sender_id===service.registrationId ) {
            // skip this; we sent it.
            console.log("ignoring message as we sent it!", data);
            return;
          }
        }

        // return payload to correct data format
        var payload = data.payload;
        if(payload.payload_format_type === service.MESSAGE_PAYLOAD_TYPE_ID.INTEGER) {
          payload.payload = parseInt( payload.payload );
        } else if (payload.payload_format_type === service.MESSAGE_PAYLOAD_TYPE_ID.JSON ) {
          payload.payload = JSON.parse( payload.payload );
        }

        // is this a connection request?
        if (payload.message_type === service.MESSAGE_TYPE_ID.CONNECTION_REQUEST) {
            // connection request! send back a confirmation - response to message in line 127
            var responsePayload = {
              connection_id: payload.connection_id,
              sender_id: service.registrationId,
              recipient_id: payload.sender_id,
              message_id: payload.message_id,
              message_type: service.MESSAGE_TYPE_ID.CONNECTION_RESPONSE,
              sender_role: service.role,
              payload: payload.payload,
              payload_format_type: service.MESSAGE_PAYLOAD_TYPE_ID.STRING //probably have to change to JSON format when communicating with the pushSrvc
            };
            pushSrvc.sendPayload( responsePayload ).then( function sendPayloadOkay(indata) {
              console.log('intial connection confirmation sent okay - got ',indata );
              service.uuid = payload.connection_id;
              // subscribe to this topic
              pushSrvc.subscribe( service.uuid );
            }, function failedSending(err) {
              console.log('error sending first message - ',err);
              alert("Problem sending confirmation payload - "+err);
            });
          }
          if (payload.message_type === service.MESSAGE_TYPE_ID.CONNECTION_RESPONSE) {
            // this is the confirmation of the other user - message from line 185
            service.uuid = payload.connection_id;
            // subscribe to this topic
            pushSrvc.subscribe( service.uuid );
          }

          if (payload.message_type === service.MESSAGE_TYPE_ID.MESSAGE) {
            // an inbound message
            alert(payload.payload.message);
            return;
            // don't ack, at least on this version!

            service.pendingMessage = payload.payload;
            // send a delivery ack before displaying
            var responsePayload = {
              connection_id: service.uuid,
              sender_id: service.registrationId,
              recipient_id: payload.sender_id,
              message_id: payload.message_id,
              message_type: service.MESSAGE_TYPE_ID.ACK,
              sender_role: service.role,
              payload: "0",
              payload_format_type: service.MESSAGE_PAYLOAD_TYPE_ID.INTEGER
            };
            pushSrvc.sendPayload( responsePayload ).then( function sendPayloadOkay(indata) {   // sends a payload if the response is back then it delivers it via alert
              console.log('message '+responsePayload.message_id+' HTTP acknowledgement delivered okay.');  // pendingAck should go through a list of message_id and connection_id then check if there is a message received
                                                                                                          // If a message is received then the list will remove that message_id and connection_id in that list and fulfil the promise which will stop the timeout
              service.pendingAcks.push({
                message_id : message_id,
                connection_id : service.uuid
              }) 
              service.timeout = function timeout(){
                $timeout(function(hook){
                  if(pushSrvc.initialisePush.message_id && pushSrvc.initialisePush.uuid == pendingAcks.message_id && pendingAcks.connection_id)
                  {
                    $timeout.cancel(promise);
                  }
                },10000,true,{message_id:message_id,connection_id:service.uuid})
                var topic_id;
                var topicList = {};

                topicList[topic_id] = { 
                  topic_id : topic_id,
                connection_id : VALUE
                
              };


                //for every sendPayload create a topic_id and attach connection_id to the topic_id
                  //  checks if the sendpayload is sent
                
                


                
                
              }
              /*
                for every sendPayload they will be a topic_id that stores the connection_id of each sendPayload
                timeout will check the topic_id and if there isnt't a response by then go to the next topic
                
                
                */
              /*
              If you want to access a function from the push service you just have to:

              pushSrvc.nameoffunction()

              */
              
              //if(payload.payload.hasOwnProperty("message")) {
              //alert(payload.payload.message);
              //}
            }, function failedSending(err) {
              console.log('error acknowledgeing '+responsePayload.message_id);
              alert("Problem acknowledgeing an inbound message.");
            });
          }
        }
      };

      service.pingOther = function pingOther() {
        var responsePayload = {
          connection_id: service.uuid,
          sender_id: service.registrationId,
          recipient_id: "/topics/" + service.uuid,
          message_id: uuid.v4(),
          message_type: service.MESSAGE_TYPE_ID.MESSAGE,
          sender_role: service.role,
          payload: JSON.stringify( { "message" : "hello"} ),
          payload_format_type: service.MESSAGE_PAYLOAD_TYPE_ID.JSON
        };
        pushSrvc.sendPayload( responsePayload ).then( function sendPayloadOkay(indata) {
          console.log('topic message '+responsePayload.message_id+' delivered okay.');

        }, function failedSending(err) {
          console.log('error sending '+responsePayload.message_id);
          alert("Problem sending message.");
        });

      };

      service.startCodeScan = function startCodeScan() {
        console.log("starting a QR code scan");
        cordova.plugins.barcodeScanner.scan(
          function(qrResult) { // .text .format .cancelled
            console.log("scanned",qrResult);
            if(qrResult.cancelled===true) {
              console.log("aborted scan!");
              return;
            } else {
              if(qrResult.format==="QR_CODE") {
                var temp_uuid = uuid.v4();
                // request a connection uuid
                var connection_payload = { //connectionSrvc job method
                  method: 'POST',
                  url: pushSrvc.SERVER_ROOT + "/connections",
                  headers: {
                    'Content-Type':'application/json'
                  },
                  data: {
                    'id': temp_uuid
                  }
                };
                console.log("requesting connection ID creation - sending ", connection_payload );
                $http( connection_payload )
                  .success(
                    function(data, status, headers, config) { //connectionSrvc job
                      // construct a outbound message
                      var payload = {
                        connection_id: data.id, // we have a connection uuid in data .id
                        sender_id: vm.registrationId,
                        message_id: temp_uuid,
                        message_type: vm.MESSAGE_TYPE_ID.CONNECTION_REQUEST,
                        sender_role: vm.role,
                        payload: qrResult.text,
                        payload_format_type: vm.MESSAGE_PAYLOAD_TYPE_ID.STRING
                      };
                      pushSrvc.sendPayload( payload ).then(function sentPayloadOkay(data){
                        console.log('initial connection - sent, got', payload, data);
                      }, function errorPayloadSend( error ) {
                        console.log('initial connection - failed send, error', payload, error);
                      });
                    }).error( function(error) {
                      // failed to get connection uuid from the server
                      alert("Failed requesting a connection UUID.");
                    });
              }
            }
          },
          function(error) {
            console.log("error scanning",error);
          },
          {
            showTorchButton: false,
            saveHistory: false,
            prompt: "Scan the Rescuer's Code"
          }
        );
      };

        
      return service;
  }



})();