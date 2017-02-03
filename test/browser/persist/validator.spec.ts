import {MDInternal} from "../../../src/app/messages/md-internal";
import {Validator} from "../../../src/app/persist/validator";
import {ProjectConfiguration} from "../../../src/app/configuration/project-configuration";
import {ConfigLoader} from "../../../src/app/configuration/config-loader";


/**
 * @author Daniel de Oliveira
 */
export function main() {
    describe('Validator', () => {

        var projectConfiguration = new ProjectConfiguration(
            {
                "types" : [
                    {
                        "type" : "T",
                        "fields" : [
                            {
                                "name" : "id",
                            },
                            {
                                "name" : "type",
                            },
                            {
                                "name" : "optional",
                            },
                            {
                                "name" : "mandatory",
                                "mandatory" : true
                            }
                        ]
                    }
                ],
                "relations" : [

                ]
            }
        );

        var configLoader = {
            configuration: function() {
                return {
                    subscribe: function(callback) {
                        callback({ projectConfiguration: projectConfiguration })
                    }
                }
            }

        };

        beforeEach(
            function(){
            }
        );

        it('should report nothing',
            function(){
                var doc = {
                    "resource" : {
                        "id" : "1",
                        "type" : "T",
                        "mandatory" : "m",
                        "relations" : undefined,
                    }
                };
                expect(new Validator(<ConfigLoader>configLoader)
                    .validate(doc)).toEqual(undefined);
            }
        );

        it('should report nothing when ommiting optional property',
            function(){
                var doc = {
                    "resource" : {
                        "id" : "1",
                        "type" : "T",
                        "mandatory" : "m",
                        "relations" : undefined,
                    }
                };
                expect(new Validator(<ConfigLoader>configLoader)
                    .validate(doc)).toEqual(undefined);
            }
        );

        it('should report error when ommiting mandatory property',
            function(){
                var doc = {
                    "resource" : {
                        "id" : "1",
                        "type" : "T",
                        "relations" : undefined,
                    }
                };
                expect(new Validator(<ConfigLoader>configLoader)
                    .validate(doc)).toEqual([MDInternal.VALIDATION_ERROR_MISSINGPROPERTY,'T','mandatory']);
            }
        );

        it('should report error when leaving mandatory property empty',
            function(){
                var doc = {
                    "resource" : {
                        "id" : "1",
                        "type" : "T",
                        "mandatory" : "",
                        "relations" : undefined,
                    }
                };
                expect(new Validator(<ConfigLoader>configLoader)
                    .validate(doc)).toEqual([MDInternal.VALIDATION_ERROR_MISSINGPROPERTY,'T','mandatory']);
            }
        );

        it('should report a missing field definition',
            function(){
                var doc = {
                    "resource" : {
                        "id" : "1",
                        "type" : "T",
                        "a" : "b",
                        "mandatory" : "m",
                        "relations" : undefined,
                    }
                };
                expect(new Validator(<ConfigLoader>configLoader)
                    .validate(doc)).toEqual([MDInternal.VALIDATION_ERROR_INVALIDFIELD,'T','a']);
            }
        );

        it('should report missing field definitions',
            function(){
                var doc = {
                    "resource" : {
                        "id" : "1",
                        "type" : "T",
                        "a" : "b",
                        "b" : "a",
                        "mandatory" : "m",
                        "relations" : undefined,
                    }
                };
                expect(new Validator(<ConfigLoader>configLoader)
                    .validate(doc)).toEqual([MDInternal.VALIDATION_ERROR_INVALIDFIELDS,'T','a, b']);
            }
        );
    })
}