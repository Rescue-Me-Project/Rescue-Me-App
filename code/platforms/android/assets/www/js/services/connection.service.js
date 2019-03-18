(function () {
    'use strict';
    console.log("connectionSrvc executed");

    angular
        .module('connectionService', [])
        .factory('connectionSrvc', ['pushSrvc', 'userSrvc', 'uuid', '$http', connectionSrvc]);


    connectionSrvc.$inject = [
        'pushSrvc',
        'userSrvc',
        'uuid',
        '$http'
    ];

    function connectionSrvc(
        pushSrvc,
        userSrvc,
        uuid,
        $http
    ) {
        
        var service = {

        };

        var regID;

        service.setRegistrationID = function setRegistrationID(registrationID){
            regID = registrationID;
        }

        service.getRegistrationID = function getRegistrationID(){
            return regID;
        }

        var user = {};
        var role;
        
        //MESSAGES

        service.MESSAGE_TYPE_ID = { 
            ACK : 0,
            NACK : 1,
            CONNECTION_REQUEST: 2,
            CONNECTION_RESPONSE: 3,
            MESSAGE: 4,
            REPLY: 5 };

        service.MESSAGE_PAYLOAD_TYPE_ID = { 
            "STRING": 0,
            "INTEGER": 1,
            "JSON": 2
        };

        service.startCodeScan = function startCodeScan(contact) {
            console.log("starting a QR code scan");
            user = userSrvc.getRole();
            role = user.role;
            if(contact == false)
              temp_uuid = uuid.v4();
            else
              var temp_uuid = contact.UUID;
            cordova.plugins.barcodeScanner.scan(
              function(qrResult) { // .text .format .cancelled
                console.log("scanned",qrResult);
                if(qrResult.cancelled===true) {
                  console.log("aborted scan!");
                  return;
                } else {
                  if(qrResult.format==="QR_CODE") {
                          // request a connection uuid
                    var connection_payload = {
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
                                  function(data, status, headers, config) {
                                    // construct a outbound message
                                    var payload = {
                                        connection_id: temp_uuid, // we have a connection uuid in data .id
                                        sender_id: regID,
                                        message_id: uuid.v4(),
                                        message_type: service.MESSAGE_TYPE_ID.CONNECTION_REQUEST,
                                        sender_role: role,
                                        payload: qrResult.text,
                                        payload_format_type: service.MESSAGE_PAYLOAD_TYPE_ID.STRING
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
                  else if(qrResult.format != "QR_CODE")
                    console.log("Not a QR Code");
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

        service.pingOther = function pingOther(UUID) {

            if(role == undefined)
            {
              var temp = userSrvc.getRole();
              role = temp.role;
            }
            
            var responsePayload = {
              connection_id: UUID,
              sender_id: regID,
              recipient_id: "/topics/" + UUID,
              message_id: uuid.v4(),
              message_type: service.MESSAGE_TYPE_ID.MESSAGE,
              sender_role: role,
              payload: JSON.stringify( { "message" : "Service Test"} ),
              payload_format_type: service.MESSAGE_PAYLOAD_TYPE_ID.JSON
            };
            pushSrvc.sendPayload( responsePayload ).then( function sendPayloadOkay(indata) {
              console.log('topic message '+responsePayload.message_id+' delivered okay.');
      
            }, function failedSending(err) {
              console.log('error sending '+responsePayload.message_id);
              alert("Problem sending message.");
            });
      
          };

          service.pingReply = function pingReply(UUID) 
          {
            var responsePayload = {
              connection_id: UUID,
              sender_id: regID,
              recipient_id: "/topics/" + UUID,
              message_id: uuid.v4(),
              message_type: service.MESSAGE_TYPE_ID.REPLY,
              sender_role: role,
              payload: JSON.stringify( { "message" : "I've read it!"} ),
              payload_format_type: service.MESSAGE_PAYLOAD_TYPE_ID.JSON
            };
            pushSrvc.sendPayload( responsePayload ).then( function sendPayloadOkay(indata) {
              console.log('topic message '+responsePayload.message_id+' delivered okay.');
      
            }, function failedSending(err) {
              console.log('error sending '+responsePayload.message_id);
              alert("Problem sending message.");
            });
          }

        return service;
    }
})();
