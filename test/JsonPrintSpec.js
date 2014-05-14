/* global describe, beforeEach, module, inject, it, expect */

describe("JsonPrint", function() {
    "use strict";

    var $rootScope, $compile, JsonParser, json;
    beforeEach(module('json-print'));

    beforeEach(inject(function(_$rootScope_, _$compile_, _JsonParser_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        JsonParser = _JsonParser_;
        json = {
            "firstName": "John",
            "lastName": "Smith",
            "age": 25,
            "money": -5000,
            "hope": 0,
            "married": false,
            "children": null,
            "lonely": true,
            "html": "<p>This <br> is a paragraph <br> with <br> line breaks</p>",
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
    }));

    describe('Service', function() {

        describe('Weaknesses', function() {

            /**
             * This is a weakness in the regex-patterns, which I've been unable to solve.
             * See test case for 'print'.
             */
            it('breaks on un-indented JSON-strings', function() {
                expect(JSON.stringify(json).match(JsonParser.patterns.string)).toEqual(null);
            });
        });

        describe("Patterns", function() {

            it('should find strings', function() {
                var result = JSON.stringify(json, null, 1).match(JsonParser.patterns.string);
                expect(result).toEqual(['"John"', '"Smith"', '"<p>This <br> is a paragraph <br> with <br> line breaks</p>"',
                    '"else"', '"21 2nd Street"', '"New York"', '"NY"', '"home"', '"212 555-1239"', '"fax"', '"646 555-4567"', '"male"']);
            });

            it('should find properties', function() {
                var result = JSON.stringify(json, null, 1).match(JsonParser.patterns.prop);
                expect(result).toEqual([ '"firstName"', '"lastName"', '"age"', '"money"', '"hope"', '"married"', '"children"',
                    '"lonely"', '"html"', '"something"', '"prop"', '"address"', '"streetAddress"', '"city"', '"state"',
                    '"postalCode"', '"phoneNumber"', '"type"', '"number"', '"type"', '"number"', '"gender"', '"type"' ]);
            });

            it("should find booleans", function() {
                var result = JSON.stringify(json, null, 1).match(JsonParser.patterns.bool);
                expect(result).toEqual(['false', 'true', 'true', 'false']);
            });

            it('should find nulls', function() {
                var result = JSON.stringify(json, null, 1).match(JsonParser.patterns.null);
                expect(result).toEqual(['null']);
            });

            it('should find numbers', function() {
                var result = JSON.stringify(json, null, 1).match(JsonParser.patterns.number);
                expect(result).toEqual(['25', '-5000', '0', '12345', '10021']);
            });

            it('should find objects', function() {
                var result = JSON.stringify(json, null, 1).match(JsonParser.patterns.object);
                expect(result).toEqual(['{', '{', '}', '{', '}', '{', '}', '{', '}', '{', '}', '}']);
            });

            it('should find arrays', function() {
                var result = JSON.stringify(json, null, 1).match(JsonParser.patterns.array);
                expect(result).toEqual(['[', ']', '[', ']']);
            });
        });

        describe('Replacers', function() {

            describe('number', function() {

                it('should recognize zero', function() {
                    expect(JsonParser.replacers.number(0)).toContain('zero');
                });

                it('should recognize positive numbers', function() {
                    expect(JsonParser.replacers.number(1)).toContain('plus');
                });

                it('should recognize negative numbers', function() {
                    expect(JsonParser.replacers.number(-1)).toContain('minus');
                });
            });

            describe('string', function() {

                it('should escape any HTML-brackets', function() {
                    expect(JsonParser.replacers.string('<p>Some HTML</p>')).toContain('&lt;p&gt;Some HTML&lt;/p&gt;');
                });
            });
        });

        describe('print', function() {

            it('should always return indented JSON, see Weaknesses', function() {
                expect(JSON.stringify(json)).not.toContain("\n");
                expect(JsonParser.print(json)).toContain("\n");
                expect(JsonParser.print(json, 0)).toContain("\n");
                expect(JsonParser.print(json, -1)).toContain("\n");
                expect(JsonParser.print(json, 1)).toContain("\n");
            });

            it('should do nothing on missing input, to avoid clearing the view', function() {
                expect(JsonParser.print()).toEqual(undefined);
            });
        });

        describe('objectify', function() {

            it('should return JSON-objects unharmed', function() {
                expect(JsonParser.objectify(json)).toEqual(json);
            });

            it('should objectify valid JSON-strings', function() {
                expect(JsonParser.objectify(JSON.stringify(json))).toEqual(json);
            });

            it('should return null on an invalid JSON-string', function() {
                expect(JsonParser.objectify(JSON.stringify(json).slice(0, -1))).toEqual(null);
            });
        });
    });

    describe('Directive', function() {

        var $scope;
        beforeEach(function() {
            $scope = $rootScope.$new();
            $scope.json = json;
            $scope.jsonStr = JSON.stringify(json);
        });

        it('should treat string and object sources equally', function() {
            var element = $compile('<pre data-json-print="json"></pre>')($scope);
            var strElement = $compile('<pre data-json-print="jsonStr"></pre>')($scope);
            $scope.$digest();

            expect(element.html()).toEqual(strElement.html());
        });

        it('should print a load of json if given an valid input', function() {
            var element = $compile('<pre data-json-print="json"></pre>')($scope);
            $scope.$digest();

            expect(element.html()).toContain('<span class="json-print-string">"Smith"</span>');
            expect(element.html()).toContain('<span class="json-print-prop">"lastName"</span>: ');
            expect(element.html()).toContain('<span class="json-print-number json-print-plus">12345</span>,');
            expect(element.html()).toContain('<span class="json-print-bool json-print-true">true</span>,');
            expect(element.html()).toContain('<span class="json-print-object">}</span>,');
            expect(element.html()).toContain('<span class="json-print-array">]</span>,');
            expect(element.html()).toContain('<span class="json-print-string">"21 2nd Street"</span>,');
        });

        it('should not clear the current content if given invalid JSON', function() {
            var strElement = $compile('<pre data-json-print="jsonStr"></pre>')($scope);
            $scope.$digest();

            expect(strElement.html()).toContain('<span class="json-print-string">"Smith"</span>');

            $scope.jsonStr = null;
            $scope.$digest();

            expect(strElement.html()).toContain('<span class="json-print-string">"Smith"</span>');
        });
    });
});