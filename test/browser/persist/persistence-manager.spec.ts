import {TestBed} from '@angular/core/testing';
import {PersistenceManager} from '../../../src/app/persist/persistence-manager';
import {ProjectConfiguration} from '../../../src/app/configuration/project-configuration';
import {ConfigLoader} from '../../../src/app/configuration/config-loader';
import {Messages} from '../../../src/app/messages/messages';
import {MD} from '../../../src/app/messages/md';
import {Document} from '../../../src/app/model/document';

/**
 * @author Daniel de Oliveira
 * @author Thomas Kleinke
 */
export function main() {

    describe('PersistenceManager', () => {

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [],
                imports: [],
                providers: [Messages, MD]
            });
        });

        const projectConfiguration = new ProjectConfiguration({
            'types': [
                {
                    'type': 'FirstLevelType',
                    'fields': [
                        {
                            'field': 'fieldA'
                        }
                    ]
                },
                {
                    'type': 'SecondLevelType',
                    'parent': 'FirstLevelType',
                    'fields': [
                        {
                            'field': 'fieldB'
                        }
                    ]
                }
            ],
            'relations': [
                {
                    'name': 'BelongsTo',
                    'inverse': 'Contains',
                    'label': 'Enthalten in'
                },
                {
                    'name': 'Contains',
                    'inverse': 'BelongsTo',
                    'label': 'Enthält'
                },
                {
                    'name': 'OneWay',
                    'inverse': 'NO-INVERSE',
                    'label': 'Einweg'
                }
            ]
        });

        let mockDatastore;
        let persistenceManager;
        const id = 'abc';

        let doc: Document;
        let relatedDoc: any;
        let anotherRelatedObject: any;

        let configLoader = {
            getProjectConfiguration: function() {
                return new Promise<any>(resolve => resolve(projectConfiguration));
            }
        };

        let getFunction = function(id) {
            return new Promise(resolve => {
                if (id == relatedDoc['resource']['id']) {
                    resolve(relatedDoc);
                }
                else {
                    resolve(anotherRelatedObject);
                }
            });
        };

        let findFunction = function() {
            return Promise.resolve([]);
        };

        let successFunction = function() {
            return Promise.resolve('ok');
        };

        beforeEach(() => {

            mockDatastore = jasmine.createSpyObj('mockDatastore',
                ['get', 'find', 'create', 'update', 'refresh', 'remove']);
            persistenceManager = new PersistenceManager(mockDatastore, <ConfigLoader> configLoader);
            persistenceManager.setOldVersions([{ resource: {} }]);
            mockDatastore.get.and.callFake(getFunction);
            mockDatastore.find.and.callFake(findFunction);
            mockDatastore.update.and.callFake(successFunction);
            mockDatastore.create.and.callFake(successFunction);
            mockDatastore.remove.and.callFake(successFunction);

            doc = { 'resource' : {
                'id' :'1', 'identifier': 'ob1',
                'type': 'object',
                'relations' : {}
            }};

            relatedDoc = { 'resource' : {
                'id': '2' , 'identifier': 'ob2', 
                'type': 'object',
                'relations' : {}
            }};

            anotherRelatedObject = { 'resource' : {
                'id': '3' , 'identifier': 'ob3',
                'type': 'object',
                'relations' : {}
            }};

        });

        it('should save the base object', done => {

            persistenceManager.persist(doc).then(() => {
                expect(mockDatastore.update).toHaveBeenCalledWith(doc);
                done();
            }, err => { fail(err); done(); });
        });

        it('should save the related document', done => {

            doc.resource.relations['BelongsTo'] = ['2'];

            persistenceManager.persist(doc).then(() => {

                expect(mockDatastore.update).toHaveBeenCalledWith(relatedDoc);
                expect(relatedDoc.resource.relations['Contains'][0]).toBe('1');
                done();

            }, err => { fail(err); done(); });
        });

        it ('should save an object with a one way relation', done => {

            doc.resource.relations['OneWay'] = ['2'];

            persistenceManager.persist(doc).then(() => {

                expect(mockDatastore.update).not.toHaveBeenCalledWith(relatedDoc);
                done();

            }, err => { fail(err); done(); });
        });

        it ('should remove a document', done => {

            doc.resource.relations['BelongsTo']=['2'];
            relatedDoc.resource.relations['Contains']=['1'];

            persistenceManager.remove(doc).then(() => {

                expect(mockDatastore.update).toHaveBeenCalledWith(relatedDoc);
                expect(relatedDoc.resource.relations['Contains']).toBe(undefined);
                done();

            }, err => { fail(err); done(); });
        });

        it ('should remove a document with a one way relation', done => {

            doc.resource.relations['OneWay'] = ['2'];

            persistenceManager.remove(doc).then(() => {

                expect(mockDatastore.update).not.toHaveBeenCalledWith(relatedDoc);
                done();

            }, err => { fail(err); done(); });
        });


        it('should add two relations of the same type', done => {

            doc.resource.relations['BelongsTo'] = ['2', '3'];

            persistenceManager.persist(doc).then(() => {

                // expect(mockDatastore.update).toHaveBeenCalledWith(relatedObject);
                // right now it is not possible to test both objects due to problems with the return val of promise.all
                expect(mockDatastore.update).toHaveBeenCalledWith(anotherRelatedObject);
                // expect(relatedObject['Contains'][0]).toBe('1');
                expect(anotherRelatedObject['resource']['relations']['Contains'][0]).toBe('1');
                done();

            }, err => { fail(err); done(); });
        });


        it('should delete a relation which is not present in the new version of the doc anymore', done => {

            const oldVersion = { 'resource' : {
                'id' :'1', 'identifier': 'ob1',
                'type': 'object',
                'relations' : { 'BelongsTo' : [ '2' ] }
            }};

            relatedDoc.resource.relations['Contains']=['1'];

            persistenceManager.setOldVersions([oldVersion]);
            persistenceManager.persist(doc).then(()=>{

                expect(mockDatastore.update).toHaveBeenCalledWith(doc);
                expect(mockDatastore.update).toHaveBeenCalledWith(relatedDoc);

                expect(doc.resource.relations['BelongsTo']).toBe(undefined);
                expect(relatedDoc.resource.relations['Contains']).toBe(undefined);
                done();

            }, err => { fail(err); done(); });
        });
    })
}