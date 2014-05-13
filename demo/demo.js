/* global angular */

angular.module('Demo', ['json-print']).controller('DemoCtrl', function($scope) {
    "use strict";

    $scope.indent = 4;

    $scope.jsonObj = {
        "firstName": "John",
        "lastName": "Smith",
        "age": 25,
        "money": -5000,
        "hope": 0,
        "married": false,
        "children": null,
        "lonely": true,
        "something": [
            "else",
            true,
            12345,
            {
                "prop": false
            }
        ],
        "address": {
            "streetAddress": "21 2nd Street",
            "city": "New York",
            "state": "NY",
            "postalCode": 10021
        },
        "phoneNumber": [
            {
                "type": "home",
                "number": "212 555-1239"
            },
            {
                "type": "fax",
                "number": "646 555-4567"
            }
        ],
        "gender":{
            "type":"male"
        }
    };

    $scope.jsonStr = JSON.stringify($scope.jsonObj, null, 4);

});