(function () {
    'use strict';

    angular
        .module('contactsjs')
        .factory('contactsSrvc', ['uuid',contactsSrvc]);
    
        contactsSrvc.$inject = [
            'uuid',
            '$q',
            '$timeout'
        ];

    function contactsSrvc(
        uuid,
        $q,
        $timeout
    ) {
        var contactsLookUp = {};
        var service = {

        };
        var contact = {};
        
        //var PAUSE_FOR_A_WHILE_MS = 3000;

        service.createContacts = function(person){
            console.log(person);

            var UUID = uuid.v4();

            console.log(UUID);

            contactsLookUp[UUID] = {
                UUID : UUID,
                name: person.name,
                age: person.age
            };

            console.log(contactsLookUp);
        }

        service.getContactsArray = function(){
            //var result = contactsArray;
            var result = [];
            var keys = Object.getOwnPropertyNames(contactsLookUp);

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
        return service;
    }
})();
