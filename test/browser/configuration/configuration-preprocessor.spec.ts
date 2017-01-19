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

            var t : TypeDefinition =  { type: 'T1',
                fields: [
                    {
                        name: 'aField'
                    }]
            };

            configuration = {
                types : [
                    t
                ],
                relations : []
            };
        });

        function addType(configuration: ConfigurationDefinition, parent?:string) {
            var newT : TypeDefinition = {
                type: 'T'+(configuration.types.length+1),
                    fields: []
            };
            if (parent!=undefined) newT.parent = parent;
            configuration.types.push(newT);
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

            var et : TypeDefinition = { type: 'T2',
                fields: [
                    {
                        name: 'bField'
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


            var et : TypeDefinition = { type: 'T2',
                fields: [
                    {
                        name: 'bField'
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

            var et : TypeDefinition = { type: 'T1',
                fields: [
                    {
                        name: 'bField'
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

            var et : TypeDefinition = { type: 'T1',
                fields: [
                    {
                        name: 'bField'
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

            var t : TypeDefinition =  { type: 'T1',
                parent : 'SuperT',
                fields: [
                    {
                        name: 'aField'
                    }]
            };

            configuration = {
                types: [
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
            var r : RelationDefinition =  { name: 'R',
                domain: [ 'domainA' ],
                range : [ 'rangeA' ]
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

            var r : RelationDefinition =  { name: 'R',
                domain: [ 'T2', 'T3' ]
            };

            new ConfigurationPreprocessor()
                .go(
                    addType(addType(configuration)),
                    [],
                    [],
                    [r]
                );

            expect(configuration.relations[0].range[0]).toBe('T1');
            expect(configuration.relations[0].range[1]).toBe(undefined);
        });

        it('should replace domain ALL with all types execpt the range types', function() {

            var r : RelationDefinition =  { name: 'R',
                range: [ 'T2', 'T3' ]
            };

            new ConfigurationPreprocessor()
                .go(
                    addType(addType(configuration)),
                    [],
                    [],
                    [r]
                );

            expect(configuration.relations[0].domain[0]).toBe('T1');
            expect(configuration.relations[0].domain[1]).toBe(undefined);
        });

        it('should replace range :inherit with all subtypes', function() {

            var r : RelationDefinition =  { name: 'R',
                domain: [ 'T3' ],
                range: [ 'T1:inherit' ]
            };

            new ConfigurationPreprocessor()
                .go(
                    addType(addType(configuration,'T1')),
                    [],
                    [],
                    [r]
                );

            expect(configuration.relations[0].range.indexOf('T1')).not.toBe(-1);
            expect(configuration.relations[0].range.indexOf('T2')).not.toBe(-1);
            expect(configuration.relations[0].range.indexOf('T1:inherit')).toBe(-1);
            expect(configuration.relations[0].domain[0]).toBe('T3');
        });

        it('should replace domain :inherit with all subtypes', function() {

            var r : RelationDefinition =  { name: 'R',
                domain: [ 'T1:inherit' ],
                range: [ 'T3' ]
            };

            new ConfigurationPreprocessor()
                .go(
                    addType(addType(configuration,'T1')),
                    [],
                    [],
                    [r]
                );

            expect(configuration.relations[0].domain.indexOf('T1')).not.toBe(-1);
            expect(configuration.relations[0].domain.indexOf('T2')).not.toBe(-1);
            expect(configuration.relations[0].domain.indexOf('T1:inherit')).toBe(-1);
            expect(configuration.relations[0].range[0]).toBe('T3');
        });
    });
}