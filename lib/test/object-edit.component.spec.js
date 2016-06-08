System.register(['@angular/core/testing', '@angular/compiler/testing', '../app/object-edit/object-edit.component', "@angular/core", "../app/object-edit/persistence-manager", "../app/datastore/datastore", "../app/core-services/messages"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var testing_1, testing_2, object_edit_component_1, core_1, persistence_manager_1, datastore_1, messages_1;
    var TestComponent;
    /**
     * @author Daniel de Oliveira
     * @author Jan G. Wieners
     * @author Sebastian Cuy
     * @author Thomas Kleinke
     */
    function main() {
        testing_1.xdescribe('ObjectEditComponent', function () {
            var MockDatastore = (function () {
                function MockDatastore() {
                }
                return MockDatastore;
            }());
            var MockMessages = (function () {
                function MockMessages() {
                }
                return MockMessages;
            }());
            var MockRelationsConfiguration = (function () {
                function MockRelationsConfiguration() {
                }
                return MockRelationsConfiguration;
            }());
            var projectConfiguration = {
                getTypes: function () {
                    return ["Section", "Feature", "Lot", "Context", "Object"];
                },
                getFields: function () {
                    return [{
                            "field": "Material",
                            "valuelist": [
                                "Alabaster",
                                "Amber",
                                "Antler"
                            ]
                        }];
                }
            };
            var selectedObject = {
                "identifier": "ob1",
                "synced": 0,
                "valid": true,
                "type": "Object"
            };
            var getElementContent = function (fixture, selector) {
                var compiled = fixture.debugElement.nativeElement;
                console.log(compiled);
                var labels = [];
                var nodeList = compiled.querySelectorAll(selector);
                for (var i = nodeList.length; i--;) {
                    labels.push(nodeList[i].innerHTML);
                }
                return labels;
            };
            testing_1.beforeEachProviders(function () { return [
                core_1.provide(datastore_1.Datastore, { useClass: MockDatastore }),
                core_1.provide(persistence_manager_1.PersistenceManager, { useClass: persistence_manager_1.PersistenceManager }),
                core_1.provide(messages_1.Messages, { useClass: MockMessages }),
                core_1.provide(object_edit_component_1.ObjectEditComponent, { useClass: object_edit_component_1.ObjectEditComponent }),
            ]; });
            testing_1.it('should build without a problem', testing_1.async(testing_1.inject([testing_2.TestComponentBuilder], function (tcb) {
                tcb.createAsync(TestComponent)
                    .then(function (fixture) {
                    console.log("f0", fixture.debugElement.children[0].componentInstance);
                    // fixture.detectChanges();
                    console.log("f1", fixture.debugElement.children[0].componentInstance);
                    fixture.debugElement.children[0].componentInstance.object = selectedObject;
                    fixture.debugElement.children[0].componentInstance.projectConfiguration = projectConfiguration;
                    fixture.detectChanges();
                    console.log("f2", fixture.debugElement.children[0].componentInstance);
                    // expect(getElementContent(fixture, 'label')).toContain('Material');
                    //
                    // var labels = getElementContent(fixture, 'option');
                    //
                    // expect(labels).toContain('Alabaster');
                    // expect(labels).toContain('Amber');
                    // expect(labels).toContain('Antler');
                });
            })));
        });
    }
    exports_1("main", main);
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (testing_2_1) {
                testing_2 = testing_2_1;
            },
            function (object_edit_component_1_1) {
                object_edit_component_1 = object_edit_component_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (persistence_manager_1_1) {
                persistence_manager_1 = persistence_manager_1_1;
            },
            function (datastore_1_1) {
                datastore_1 = datastore_1_1;
            },
            function (messages_1_1) {
                messages_1 = messages_1_1;
            }],
        execute: function() {
            TestComponent = (function () {
                function TestComponent() {
                }
                TestComponent = __decorate([
                    core_1.Component({
                        selector: 'oec',
                        template: '<object-edit [(object)]="selectedObject" [(projectConfiguration)]="projectConfiguration"></object-edit>',
                        directives: [object_edit_component_1.ObjectEditComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], TestComponent);
                return TestComponent;
            }());
        }
    }
});
//# sourceMappingURL=object-edit.component.spec.js.map