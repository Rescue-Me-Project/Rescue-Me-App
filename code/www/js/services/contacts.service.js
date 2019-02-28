(function () {
    'use strict';
    console.log("contactsSrvc executed");

    angular
        .module('contactsService', [])
        .factory('contactsSrvc', ['uuid',contactsSrvc]);
    
        contactsSrvc.$inject = [
            'uuid',
        ];

    function contactsSrvc(
        uuid,
    ) {
        
        var service = {

        };

        var contactsLookUp = {};
        var rescuer = {};
        var rescuee = {};

        //Add the ability to distinguish between Rescuer and Rescuee
        //RescueeArray && RescuerArray

        service.createContacts = function(person){
            console.log(person);

            var UUID = uuid.v4();

            console.log(UUID);
            console.log(person.role);

            contactsLookUp[UUID] = {
                UUID : UUID,
                name: person.name,
                role: role
            };

            console.log(contactsLookUp);
        }

        service.getContactsArray = function(){
            var result = [];
            var keys = Object.getOwnPropertyNames(contactsLookUp);

            //if role Rescuer
            //push to RescuerArray
            //if role Rescuee
            //push to RescueeArray

            for(var index = 0;index < keys.length;index++)
            {
                var key = keys[index];
                var obj = contactsLookUp[key];
                result.push(obj);
            }
            return result;
        }
        
        service.getContact = function(UUID){
            return angular.copy(contactsLookUp[UUID]);
        }

        /* Remove Contact Function - Incomplete
        service.removeContact = function(UUID){
            return null;
        }
        */
        return service;
    }
})();
