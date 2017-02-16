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
            getProjectConfiguration: function() {
                return new Promise<any>((resolve)=>{
                    resolve(projectConfiguration);
                });
            }

        };

        beforeEach(
            function(){
            }
        );

        it('should report nothing',
            function(done){
                var doc = {
                    "resource" : {
                        "id" : "1",
                        "type" : "T",
                        "mandatory" : "m",
                        "relations" : undefined,
                    }
                };
                new Validator(<ConfigLoader>configLoader)
                    .validate(doc).then(()=>done(),msgWithParams=>fail(msgWithParams));
            }
        );

        it('should report nothing when ommiting optional property',
            function(done){
                var doc = {
                    "resource" : {
                        "id" : "1",
                        "type" : "T",
                        "mandatory" : "m",
                        "relations" : undefined,
                    }
                };
                new Validator(<ConfigLoader>configLoader)
                    .validate(doc).then(()=>done(),msgWithParams=>fail(msgWithParams));
            }
        );

        it('should report error when ommiting mandatory property',
            function(done){
                var doc = {
                    "resource" : {
                        "id" : "1",
                        "type" : "T",
                        "relations" : undefined,
                    }
                };
                new Validator(<ConfigLoader>configLoader)
                    .validate(doc).then(()=>fail(),msgWithParams => {
                    expect(msgWithParams).toEqual([MDInternal.VALIDATION_ERROR_MISSINGPROPERTY,'T','mandatory'])
                    done();
                });
            }
        );

        it('should report error when leaving mandatory property empty',
            function(done){
                var doc = {
                    "resource" : {
                        "id" : "1",
                        "type" : "T",
                        "mandatory" : "",
                        "relations" : undefined,
                    }
                };
                new Validator(<ConfigLoader>configLoader)
                    .validate(doc).then(()=>fail(),msgWithParams => {
                        expect(msgWithParams).toEqual([MDInternal.VALIDATION_ERROR_MISSINGPROPERTY,'T','mandatory'])
                        done();
                    });
            }
        );

        it('should report a missing field definition',
            function(done){
                var doc = {
                    "resource" : {
                        "id" : "1",
                        "type" : "T",
                        "a" : "b",
                        "mandatory" : "m",
                        "relations" : undefined,
                    }
                };
                new Validator(<ConfigLoader>configLoader)
                    .validate(doc).then(()=>fail(),msgWithParams => {
                    expect(msgWithParams).toEqual([MDInternal.VALIDATION_ERROR_INVALIDFIELD,'T','a']);
                    done();
                });
            }
        );

        it('should report missing field definitions',
            function(done){
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
                new Validator(<ConfigLoader>configLoader)
                    .validate(doc).then(()=>fail(),msgWithParams => {
                    expect(msgWithParams).toEqual([MDInternal.VALIDATION_ERROR_INVALIDFIELDS,'T','a, b']);
                    done();
                });
            }
        );
    })
}