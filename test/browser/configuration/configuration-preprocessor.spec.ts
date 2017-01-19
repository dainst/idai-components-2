/// <reference path="../../../typings/globals/jasmine/index.d.ts" />
import {ConfigurationPreprocessor} from "../../../src/app/configuration/configuration-preprocessor";
import {TypeDefinition} from '../../../src/app/configuration/type-definition'
import {RelationDefinition} from '../../../src/app/configuration/relation-definition'
import {ConfigurationDefinition} from "../../../src/app/configuration/configuration-definition";

/**
 * @author Daniel de Oliveira
 */
export function main() {
    fdescribe('ConfigurationPreprocessor', () => {



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



        it('should add extra fields', function(){

            new ConfigurationPreprocessor()
                .go(
                    configuration,
                    [],
                    [{name:'identifier'}],
                    []
                );

            expect(configuration['types'][0].fields[0].name).toBe('identifier');
            expect(configuration['types'][0].fields[1].name).toBe('aField');
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

            expect(configuration['types'][1].fields[0].name).toBe('bField');
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

            expect(configuration['types'][1].fields[0].name).toBe('identifier');
            expect(configuration['types'][1].fields[1].name).toBe('bField');
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

            expect(configuration['types'][0].fields[0].name).toBe('aField');
            expect(configuration['types'][0].fields[1].name).toBe('bField');
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

            expect(configuration['types'][0].fields[0].name).toBe('identifier');
            expect(configuration['types'][0].fields[1].name).toBe('aField');
            expect(configuration['types'][0].fields[2].name).toBe('bField');
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

            expect(configuration['types'][0].fields[0].name).toBe('aField');
            expect(configuration['types'][0].fields[1]).toBe(undefined);
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

        it('should replace range ALL with all types execpt the range type', function() {
            configuration.types.push({
                type: "T2",
                fields: []
            });

            var r : RelationDefinition =  { "name": "R",
                domain: [ "T" ],
                range: [ "ALL" ]
            };

            new ConfigurationPreprocessor()
                .go(
                    configuration,
                    [],
                    [],
                    [r]
                );

            expect(configuration.relations[0].range[0]).toBe('T2');
            expect(configuration.relations[0].range[1]).toBe(undefined); // it should exclude the domain type
        });

        it('should replace domain ALL with all types execpt the range type', function() {
            configuration.types.push({
                type: "T2",
                fields: []
            });

            var r : RelationDefinition =  { "name": "R",
                domain: [ "ALL" ],
                range: [ "T" ]
            };

            new ConfigurationPreprocessor()
                .go(
                    configuration,
                    [],
                    [],
                    [r]
                );

            expect(configuration.relations[0].domain[0]).toBe('T2');
            expect(configuration.relations[0].domain[1]).toBe(undefined); // it should exclude the range type
        })
    });
}