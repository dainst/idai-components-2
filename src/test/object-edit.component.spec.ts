/// <reference path="../../typings/globals/jasmine/index.d.ts" />
import {Component} from "@angular/core";
import {PersistenceManager} from "../app/documents/persistence-manager";
import {Datastore} from "../app/datastore/datastore";
import {ConfigLoader} from "../app/configuration/config-loader";
import {DocumentEditComponent} from '../../src/app/documents/document-edit.component';
import {EditFormComponent} from '../../src/app/documents/edit-form.component';
import {RelationsFormComponent} from '../../src/app/documents/relations-form.component';
import {RelationPickerComponent} from '../../src/app/documents/relation-picker.component';
import {RelationPickerGroupComponent} from '../../src/app/documents/relation-picker-group.component';
import {CheckboxesComponent} from '../../src/app/documents/forms/checkboxes.component';
import {DropdownComponent} from '../../src/app/documents/forms/dropdown.component';
import {InputComponent} from '../../src/app/documents/forms/input.component';
import {InputsComponent} from '../../src/app/documents/forms/inputs.component';
import {InputsLocalizedComponent} from '../../src/app/documents/forms/inputs-localized.component';
import {MultiselectComponent} from '../../src/app/documents/forms/multiselect.component';
import {RadioComponent} from '../../src/app/documents/forms/radio.component';
import {TextComponent} from '../../src/app/documents/forms/text.component';
import {Messages} from "../app/messages/messages";
import {TestBed, ComponentFixture} from "@angular/core/testing";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {MessagesComponent} from "../app/messages/messages.component";


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
                    InputsLocalizedComponent,
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
                
                const fixture: ComponentFixture<TestComponent> = TestBed.createComponent(TestComponent);

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