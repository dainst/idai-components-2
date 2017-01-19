/// <reference path="../../../typings/globals/jasmine/index.d.ts" />
import {ConfigurationPreprocessor} from "../../../src/app/configuration/configuration-preprocessor";
import {TypeDefinition} from '../../../src/app/configuration/type-definition'
import {RelationDefinition} from '../../../src/app/configuration/relation-definition'
import {ConfigurationDefinition} from "../../../src/app/configuration/configuration-definition";

/**
 * @author Daniel de Oliveira
 */
export function main() {
    describe('ConfigurationPreprocessor', () => {



        var configuration : ConfigurationDefinition;



        beforeEach(function() {

            var t : TypeDefinition =  { "type": "T",
                "fields": [
                    {
                        "name": "aField"
                    }]
            };

            configuration = {
                "types" : [
                    t
                ],
                "relations" : []
            };
        });

        function withAdditionalTypes(configuration: ConfigurationDefinition) {
            configuration.types.push({
                type: "T2",
                fields: []
            },{
                type: "T3",
                fields: []
            });
            return configuration;
        }




        it('should add extra fields', function(){

            new ConfigurationPreprocessor()
                .go(
                    configuration,
                    [],
                    [{name:'identifier'}],
                    []
                );

            expect(configuration.types[0].fields[0].name).toBe('identifier');
            expect(configuration.types[0].fields[1].name).toBe('aField');
        });
        
        
        
        it('should add extra type', function(){

            var et : TypeDefinition = { "type": "T2",
                "fields": [
                    {
                        "name": "bField"
                    }]
            };

            new ConfigurationPreprocessor()
                .go(
                    configuration,
                    [et],
                    [],
                    []
                );

            expect(configuration.types[1].fields[0].name).toBe('bField');
        });


        it('should add and extra field to an extra type', function(){


            var et : TypeDefinition = { "type": "T2",
                "fields": [
                    {
                        "name": "bField"
                    }]
            };

            new ConfigurationPreprocessor()
                .go(
                    configuration,
                    [et],
                    [{name:'identifier'}],
                    []
                );

            expect(configuration.types[1].fields[0].name).toBe('identifier');
            expect(configuration.types[1].fields[1].name).toBe('bField');
        });



        it('merge fields of extra type with existing type', function(){

            var et : TypeDefinition = { "type": "T",
                "fields": [
                    {
                        "name": "bField"
                    }]
            };

            new ConfigurationPreprocessor()
                .go(
                    configuration,
                    [et],
                    [],
                    []
                );

            expect(configuration.types[0].fields[0].name).toBe('aField');
            expect(configuration.types[0].fields[1].name).toBe('bField');
        });



        it('merge fields of extra type with existing type and add extra field', function(){

            var et : TypeDefinition = { "type": "T",
                "fields": [
                    {
                        "name": "bField"
                    }]
            };

            new ConfigurationPreprocessor()
                .go(
                    configuration,
                    [et],
                    [{name:'identifier'}],
                    []
                );

            expect(configuration.types[0].fields[0].name).toBe('identifier');
            expect(configuration.types[0].fields[1].name).toBe('aField');
            expect(configuration.types[0].fields[2].name).toBe('bField');
        });



        it('should not add extra fields to subtypes', function(){

            var t : TypeDefinition =  { "type": "T",
                "parent" : "SuperT",
                "fields": [
                    {
                        "name": "aField"
                    }]
            };

            configuration = {
                "types" : [
                    t
                ],
                "relations" : []
            };

            new ConfigurationPreprocessor()
                .go(
                    configuration,
                    [],
                    [{name:'identifier'}],
                    []
                );

            expect(configuration.types[0].fields[0].name).toBe('aField');
            expect(configuration.types[0].fields[1]).toBe(undefined);
        });


        it('should add an extra relation', function() {
            var r : RelationDefinition =  { "name": "R",
                "domain": [ "domainA" ],
                "range" : [ "rangeA" ]
            };

            new ConfigurationPreprocessor()
                .go(
                    configuration,
                    [],
                    [],
                    [r]
                );

            expect(configuration.relations[0].name).toBe('R');
        });

        it('should replace range ALL with all types execpt the range types', function() {

            var r : RelationDefinition =  { "name": "R",
                domain: [ "T2", "T3" ],
                range: [ "ALL" ]
            };

            new ConfigurationPreprocessor()
                .go(
                    withAdditionalTypes(configuration),
                    [],
                    [],
                    [r]
                );

            expect(configuration.relations[0].range[0]).toBe('T');
            expect(configuration.relations[0].range[1]).toBe(undefined);
        });

        fit('should replace domain ALL with all types execpt the range types', function() {

            var r : RelationDefinition =  { "name": "R",
                domain: [ "ALL" ],
                range: [ "T2", "T3" ]
            };

            new ConfigurationPreprocessor()
                .go(
                    withAdditionalTypes(configuration),
                    [],
                    [],
                    [r]
                );

            expect(configuration.relations[0].domain[0]).toBe('T');
            expect(configuration.relations[0].domain[1]).toBe(undefined);
        })
    });
}