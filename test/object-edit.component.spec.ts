import {fdescribe, describe, xdescribe,expect, it, fit, xit,inject, async, beforeEachProviders,
        } from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {ObjectEditComponent} from '../app/object-edit/object-edit.component'
import {provide, Component} from "@angular/core";
import {PersistenceManager} from "../app/core-services/persistence-manager";
import {Datastore} from "../app/datastore/datastore";
import {Messages} from "../app/core-services/messages";
import {RelationsProvider} from "../app/object-edit/relations-provider";


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
        class MockRelationsProvider {}

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
            "title": "Title",
            "synced": 0,
            "valid": true,
            "type": "Object"
        };

        var getElementContent = function(fixture, selector: string): string[] {

            var compiled = fixture.debugElement.nativeElement;

            console.log(compiled)

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
            provide(ObjectEditComponent, {useClass: ObjectEditComponent}),
            provide(RelationsProvider, {useClass: MockRelationsProvider})
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
    template: '<object-edit [(object)]="selectedObject" [(projectConfiguration)]="projectConfiguration"></object-edit>',
    directives: [ObjectEditComponent]
})
class TestComponent {}