/// <reference path="../../typings/globals/jasmine/index.d.ts" />
import {Component} from "@angular/core";
import {PersistenceManager} from "../app/object-edit/persistence-manager";
import {Datastore} from "../app/datastore/datastore";
import {ConfigLoader} from "../app/object-edit/config-loader";
import {DocumentEditComponent} from '../../src/app/object-edit/document-edit.component';
import {EditFormComponent} from '../../src/app/object-edit/edit-form.component';
import {RelationsFormComponent} from '../../src/app/object-edit/relations-form.component';
import {RelationPickerComponent} from '../../src/app/object-edit/relation-picker.component';
import {RelationPickerGroupComponent} from '../../src/app/object-edit/relation-picker-group.component';
import {CheckboxesComponent} from '../../src/app/object-edit/forms/checkboxes.component';
import {DropdownComponent} from '../../src/app/object-edit/forms/dropdown.component';
import {InputComponent} from '../../src/app/object-edit/forms/input.component';
import {InputsComponent} from '../../src/app/object-edit/forms/inputs.component';
import {LocalizedComponent} from '../../src/app/object-edit/forms/localized.component';
import {MultiselectComponent} from '../../src/app/object-edit/forms/multiselect.component';
import {RadioComponent} from '../../src/app/object-edit/forms/radio.component';
import {TextComponent} from '../../src/app/object-edit/forms/text.component';
import {Messages} from "../app/core-services/messages";
import {TestBed, ComponentFixture} from "@angular/core/testing";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {MessagesComponent} from "../app/core-services/messages.component";


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

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    TestComponent,
                    DocumentEditComponent,
                    EditFormComponent,
                    RelationsFormComponent,
                    RelationPickerComponent,
                    RelationPickerGroupComponent,
                    CheckboxesComponent,
                    DropdownComponent,
                    InputComponent,
                    InputsComponent,
                    LocalizedComponent,
                    MultiselectComponent,
                    RadioComponent,
                    TextComponent,
                    MessagesComponent
                ],
                imports: [
                    HttpModule,
                    FormsModule
                ],
                providers: [
                    PersistenceManager,
                    { provide: Datastore, useClass: MockDatastore },
                    { provide: Messages, useClass: MockMessages },
                    ConfigLoader
                ]
            });
        });

        it('should build without a problem', function(done) {

            TestBed.compileComponents().then(() => {
                console.log("LOG1");

                const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);

                console.log("LOG2");

                console.log("f0", fixture.debugElement.children[0].componentInstance)

                // fixture.detectChanges();

                console.log("f1", fixture.debugElement.children[0].componentInstance)

                fixture.debugElement.children[0].componentInstance.object = selectedObject;
                fixture.debugElement.children[0].componentInstance.projectConfiguration = projectConfiguration;

                fixture.detectChanges();

                console.log("f2", fixture.debugElement.children[0].componentInstance)

                // expect(getElementContent(fixture, 'label')).toContain('Material');
                //
                // var labels = getElementContent(fixture, 'option');
                //
                // expect(labels).toContain('Alabaster');
                // expect(labels).toContain('Amber');
                // expect(labels).toContain('Antler');

                done();
            }, err => {
                fail(err);
                done();
            });
        });
    });
}

@Component({
    selector: 'oec',
    template: '<document-edit [(document)]="selectedObject" [primary]="\'id\'"></document-edit>'
})
class TestComponent {}