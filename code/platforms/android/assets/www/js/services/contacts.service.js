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
                role: person.role
            };

            console.log(contactsLookUp);
            var tempContacts = angular.toJson(contactsLookUp);
            console.log(tempContacts);

            window.localStorage.setItem('Contacts', tempContacts);
        }

        service.getContactsArray = function(){
            var result = [];
            var tempContacts = window.localStorage.getItem('Contacts');
            contactsLookUp = angular.fromJson(tempContacts);
            if(contactsLookUp != null)
            {
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
            else
            {
                contactsLookUp = {};
                return 0;
            }
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
