import {fdescribe, describe, xdescribe,expect, it, fit, xit,inject, async, beforeEachProviders,
        } from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {provide, Component} from "@angular/core";
import {PersistenceManager} from "../app/object-edit/persistence-manager";
import {Datastore} from "../app/datastore/datastore";
import {DocumentEditComponent} from "../app/object-edit/document-edit.component";
import {Messages} from "../app/core-services/messages";
import {RelationsConfiguration} from "../app/object-edit/relations-configuration";


/**
 * @author Daniel de Oliveira
 * @author Jan G. Wieners
 * @author Sebastian Cuy
 * @author Thomas Kleinke
 */
export function main() {

    xdescribe('ObjectEditComponent', () => {

        class MockDatastore {}
        class MockMessages  {}
        class MockRelationsConfiguration {}

        var projectConfiguration = {
            getTypes : function() {
                return ["Section", "Feature", "Lot", "Context", "Object" ];
            },
            getFields : function() {
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

        var getElementContent = function(fixture, selector: string): string[] {

            var compiled = fixture.debugElement.nativeElement;

            var labels = [];
            var nodeList = compiled.querySelectorAll(selector);

            for(var i = nodeList.length; i--;) {
                labels.push(nodeList[i].innerHTML);
            }

            return labels;
        };


        beforeEachProviders(() => [
            provide(Datastore, { useClass: MockDatastore }),
            provide(PersistenceManager, { useClass: PersistenceManager }),
            provide(Messages, { useClass: MockMessages }),
            provide(DocumentEditComponent, {useClass: DocumentEditComponent}),
        ]);


        it('should build without a problem',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                tcb.createAsync(TestComponent)
                    .then((fixture) => {

                        console.log("f0",fixture.debugElement.children[0].componentInstance)

                        // fixture.detectChanges();

                        console.log("f1",fixture.debugElement.children[0].componentInstance)

                        fixture.debugElement.children[0].componentInstance.object = selectedObject;
                        fixture.debugElement.children[0].componentInstance.projectConfiguration = projectConfiguration;

                        fixture.detectChanges();

                        console.log("f2",fixture.debugElement.children[0].componentInstance)


                        // expect(getElementContent(fixture, 'label')).toContain('Material');
                        //
                        // var labels = getElementContent(fixture, 'option');
                        //
                        // expect(labels).toContain('Alabaster');
                        // expect(labels).toContain('Amber');
                        // expect(labels).toContain('Antler');
                    });
            }))
        );
    });
}

@Component({
    selector: 'oec',
    template: '<document-edit [(object)]="selectedObject" [(projectConfiguration)]="projectConfiguration"></document-edit>',
    directives: [DocumentEditComponent]
})
class TestComponent {}