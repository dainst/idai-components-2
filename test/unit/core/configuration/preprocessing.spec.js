"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var preprocessing_1 = require("../../../../src/core/configuration/preprocessing");
/**
 * @author Daniel de Oliveira
 */
describe('ConfigurationPreprocessor', function () {
    var configuration;
    var t1;
    beforeEach(function () {
        t1 = { type: 'T1',
            fields: [
                {
                    name: 'aField'
                }
            ]
        };
        configuration = {
            identifier: 'test',
            types: [
                t1
            ]
        };
    });
    function addType(configuration, parent) {
        var newT = {
            type: 'T' + (configuration.types.length + 1),
            fields: []
        };
        if (parent != undefined)
            newT.parent = parent;
        configuration.types.push(newT);
        return configuration;
    }
    /*
    it('should add missing relations', function() {

        delete configuration.relations; // in case someone defined it in before
        // new ConfigurationPreprocessor([])
        //     .addExtraFields(configuration);
        expect(configuration.relations.length as any).toBe(0);
    });


    it('should add missing type fields', function() {

        delete configuration.types[0].fields;
        new ConfigurationPreprocessor([])
            .addExtraFields(configuration);
        expect(configuration.types[0].fields.length).toBe(0);
    });
    */
    it('should add extra fields', function () {
        preprocessing_1.Preprocessing.addExtraFields(configuration, [{ name: 'identifier' }]);
        expect(configuration.types[0].fields[0].name).toBe('identifier');
        expect(configuration.types[0].fields[1].name).toBe('aField');
    });
    it('should add extra type', function () {
        var et = { type: 'T2',
            fields: [
                {
                    name: 'bField'
                }
            ]
        };
        preprocessing_1.Preprocessing.addExtraTypes(configuration, [et]);
        expect(configuration.types[1].fields[0].name).toBe('bField');
    });
    it('should add and extra field to an extra type', function () {
        var et = { type: 'T2',
            fields: [
                {
                    name: 'bField'
                }
            ]
        };
        preprocessing_1.Preprocessing.addExtraTypes(configuration, [et]);
        preprocessing_1.Preprocessing.addExtraFields(configuration, [{ name: 'identifier' }]);
        expect(configuration.types[1].fields[0].name).toBe('identifier');
        expect(configuration.types[1].fields[1].name).toBe('bField');
    });
    it('merge fields of extra type with existing type', function () {
        var et = { type: 'T1',
            fields: [
                {
                    name: 'bField'
                }
            ]
        };
        preprocessing_1.Preprocessing.addExtraTypes(configuration, [et]);
        expect(configuration.types[0].fields[0].name).toBe('aField');
        expect(configuration.types[0].fields[1].name).toBe('bField');
    });
    it('merge fields of extra type with existing type and add extra field', function () {
        var et = { type: 'T1',
            fields: [
                {
                    name: 'bField'
                }
            ]
        };
        preprocessing_1.Preprocessing.addExtraTypes(configuration, [et]);
        preprocessing_1.Preprocessing.addExtraFields(configuration, [{ name: 'identifier' }]);
        expect(configuration.types[0].fields[0].name).toBe('identifier');
        expect(configuration.types[0].fields[1].name).toBe('aField');
        expect(configuration.types[0].fields[2].name).toBe('bField');
    });
    it('should not add extra fields to subtypes', function () {
        var t = { type: 'T1',
            parent: 'SuperT',
            fields: [
                {
                    name: 'aField'
                }
            ]
        };
        configuration = {
            identifier: 'test',
            types: [
                t
            ],
            relations: []
        };
        preprocessing_1.Preprocessing.addExtraTypes(configuration, []);
        preprocessing_1.Preprocessing.addExtraFields(configuration, [{ name: 'identifier' }]);
        expect(configuration.types[0].fields[0].name).toBe('aField');
        expect(configuration.types[0].fields[1]).toBe(undefined);
    });
    it('should add an extra relation', function () {
        var r = { name: 'R',
            domain: ['domainA'],
            range: ['rangeA']
        };
        configuration.relations = [];
        preprocessing_1.Preprocessing.addExtraFields(configuration, []);
        preprocessing_1.Preprocessing.addExtraRelations(configuration, [r]);
        expect(configuration.relations[0].name).toBe('R');
        expect(configuration.relations[1]).toBe(undefined); // to prevent reintroducing bug
    });
    // there was a bug where relation was not added if one of the same name but with a different domain was configured
    it('should add an extra relation to an existing relation', function () {
        var r1 = { name: 'R',
            domain: ['domainA'],
            range: ['rangeA']
        };
        var r2 = { name: 'R',
            domain: ['domainB'],
            range: ['rangeA']
        };
        configuration = {
            identifier: 'test',
            types: [
                t1
            ],
            relations: [
                r1
            ]
        };
        preprocessing_1.Preprocessing.addExtraTypes(configuration, []);
        preprocessing_1.Preprocessing.addExtraFields(configuration, []);
        preprocessing_1.Preprocessing.addExtraRelations(configuration, [r2]);
        expect(configuration.relations.length).toBe(2);
    });
    it('should replace range ALL with all types except the domain types', function () {
        var r = { name: 'R',
            domain: ['T2', 'T3']
        };
        configuration.relations = [];
        preprocessing_1.Preprocessing.addExtraFields(addType(addType(configuration)), []);
        preprocessing_1.Preprocessing.addExtraRelations(configuration, [r]);
        expect(configuration.relations[0].range[0]).toBe('T1');
        expect(configuration.relations[0].range[1]).toBe(undefined);
    });
    it('should replace domain ALL with all types except the range types', function () {
        var r = { name: 'R',
            range: ['T2', 'T3']
        };
        configuration.relations = [];
        preprocessing_1.Preprocessing.addExtraFields(addType(addType(configuration)), []);
        preprocessing_1.Preprocessing.addExtraRelations(configuration, [r]);
        expect(configuration.relations[0].domain[0]).toBe('T1');
        expect(configuration.relations[0].domain[1]).toBe(undefined);
    });
    it('should replace range :inherit with all subtypes', function () {
        var r = { name: 'R',
            domain: ['T3'],
            range: ['T1:inherit']
        };
        configuration.relations = [];
        preprocessing_1.Preprocessing.addExtraFields(addType(addType(configuration, 'T1')), []);
        preprocessing_1.Preprocessing.addExtraRelations(configuration, [r]);
        expect(configuration.relations[0].range.indexOf('T1')).not.toBe(-1);
        expect(configuration.relations[0].range.indexOf('T2')).not.toBe(-1);
        expect(configuration.relations[0].range.indexOf('T1:inherit')).toBe(-1);
        expect(configuration.relations[0].domain[0]).toBe('T3');
    });
    it('should replace domain :inherit with all subtypes', function () {
        var r = { name: 'R',
            domain: ['T1:inherit'],
            range: ['T3']
        };
        configuration.relations = [];
        preprocessing_1.Preprocessing.addExtraFields(addType(addType(configuration, 'T1')), []);
        preprocessing_1.Preprocessing.addExtraRelations(configuration, [r]);
        expect(configuration.relations[0].domain.indexOf('T1')).not.toBe(-1);
        expect(configuration.relations[0].domain.indexOf('T2')).not.toBe(-1);
        expect(configuration.relations[0].domain.indexOf('T1:inherit')).toBe(-1);
        expect(configuration.relations[0].range[0]).toBe('T3');
    });
    // This test can detect problems coming from a wrong order of expandInherits and expandAllMarker calls
    it('should exclude the type and subtypes when using :inherit and total range', function () {
        var r = { name: 'R',
            domain: ['T1:inherit']
        };
        configuration.relations = [];
        preprocessing_1.Preprocessing.addExtraFields(addType(addType(configuration, 'T1')), []);
        preprocessing_1.Preprocessing.addExtraRelations(configuration, [r]);
        expect(configuration.relations[0].range[0]).toBe('T3');
        expect(configuration.relations[0].range.indexOf('T1')).toBe(-1);
        expect(configuration.relations[0].range.indexOf('T2')).toBe(-1);
    });
    it('apply language', function () {
        configuration = {
            identifier: 'test',
            types: [
                { type: 'A', fields: [{ name: 'a' }, { name: 'a1' }] },
                { type: 'B', fields: [{ name: 'b' }] }
            ],
            relations: [{ name: 'isRecordedIn' }, { name: 'isContemporaryWith' }]
        };
        var languageConfiguration = {
            types: {
                A: {
                    label: 'A_',
                    fields: {
                        a: {
                            label: 'a_'
                        },
                        a1: {
                            description: 'a1_desc'
                        }
                    }
                }
            },
            relations: {
                isRecordedIn: {
                    label: 'isRecordedIn_'
                }
            }
        };
        preprocessing_1.Preprocessing.applyLanguage(configuration, languageConfiguration);
        expect(configuration.types[0].label).toEqual('A_');
        expect(configuration.types[1].label).toBeUndefined();
        expect(configuration.types[0].fields[0].label).toEqual('a_');
        expect(configuration.types[0].fields[1].label).toBeUndefined();
        expect(configuration.types[0].fields[0].description).toBeUndefined();
        expect(configuration.types[0].fields[1].description).toEqual('a1_desc');
        expect(configuration.relations[0].label).toEqual('isRecordedIn_');
        expect(configuration.relations[1].label).toBeUndefined();
    });
});
//# sourceMappingURL=preprocessing.spec.js.map