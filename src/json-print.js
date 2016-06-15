/* global angular */

angular.module('json-print', [])

    .factory('JsonParser', function() {
        "use strict";

        return (function() {

            function value(matcher) {
                var start = /(?!".*":)/;
                var end = /(?=,?$)/;
                return new RegExp(start.source + matcher.source + end.source, 'gmi');
            }

            var patterns = {

                prop: /("[\$_a-zA-Z][\$\w]+")(?=:)/gim,

                bool: value(/(true|false)/),

                null: value(/(null)/),

                number: value(/(-?\d*\.?\d+)/),

                string: value(/(?:^\s*".*":\s*)?(".*")(?=,?$)/gmi),

                object: /}|{/gm,

                array: /]|\[/gm

            };

            var replacers = {

                prop: '<span class="json-print-prop">$&</span>',

                bool: '<span class="json-print-bool json-print-$&">$&</span>',

                null: '<span class="json-print-null">$&</span>',

                number: function(match) {
                    var numberClass = +match === 0 ? 'zero' : +match > 0 ? "plus" : "minus";
                    return '<span class="json-print-number json-print-' + numberClass + '">' + match + '</span>';
                },

                string: function(match, p1) {
                    var escapedStr = p1.replace(/</gm, '&lt;').replace(/>/gm, '&gt;');
                    return match.replace(p1, '<span class="json-print-string">' + escapedStr + '</span>');
                },

                object: '<span class="json-print-object">$&</span>',

                array: '<span class="json-print-array">$&</span>'

            };

            function print(json, indent) {
                indent = indent && indent > 0 ? indent : 4;
                if (json) {
                    return JSON.stringify(json, null, +indent)
                        .replace(patterns.string, replacers.string)
                        .replace(patterns.bool, replacers.bool)
                        .replace(patterns.null, replacers.null)
                        .replace(patterns.number, replacers.number)
                        .replace(patterns.prop, replacers.prop)
                        .replace(patterns.object, replacers.object)
                        .replace(patterns.array, replacers.array);
                }
            }

            function objectify(value) {
                if (typeof value === 'object') {
                    return value;
                } else {
                    try {
                        return JSON.parse(value);
                    } catch (e) {
                        return null;
                    }
                }
            }

            return {
                objectify: objectify,
                print: print,
                patterns: patterns,
                replacers: replacers
            };
        })();
    })

    .directive('jsonPrint', ['JsonParser', function(JsonParser) {
        "use strict";
        return {
            restrict: 'AEC',
            link: function(scope, element, attrs) {
                scope.$watch(attrs.jsonPrint, function(value) {
                    if (value) {
                        element.html(JsonParser.print(JsonParser.objectify(value), attrs.jsonIndent));
                    }
                },
		true);
            }
        };
    }]
);
