import {Component, Input, OnInit} from '@angular/core';
import {Entity} from "../core-services/entity";
import {PersistenceManager} from "../core-services/persistence-manager";
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {ProjectConfiguration} from "../core-services/project-configuration";
import {RelationPickerGroupComponent} from "./relation-picker-group.component";
import {ValuelistComponent} from "./valuelist.component";
import {OnChanges} from "@angular/core";
import {Messages} from "../core-services/messages";
import {RelationsProvider} from "./relations-provider";
import {MD} from "../md";

/**
 * @author Jan G. Wieners
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
@Component({
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, COMMON_DIRECTIVES, RelationPickerGroupComponent, ValuelistComponent],
    selector: 'object-edit',
    template: `<div *ngIf="object">
    
    <div *ngIf="!object.type" id="object-create">
        <section>
            <header >
                <h1 id="create-object-heading">
                    <span class="mdi mdi-blur"></span>
                    New Object
                </h1>
            </header>
            <main>
                <div class="panel panel-default">
                    <div class="panel-heading">
                        Please choose the object type.
                    </div>
                    <button *ngFor="let type of types; let index = index" (mousedown)="setType(type)"
                            type="button" id="create-object-option-{{index}}" class="list-group-item">{{type}}</button>
                </div>
            </main>
        </section>
    </div>

    <div *ngIf="object.type"
         id="object-edit">

        <section>
            <header>
                <h1 id="object-type-heading">
                    <span class="mdi mdi-blur"></span>
                    {{object.type}}
                    <button class="btn btn-default pull-right" id="object-edit-button-save-object"
                            style="margin-right: 5px; margin-top: 5px;" (click)="save()">Speichern</button>
                </h1>
            </header>
            <main>
                <form>

                    <!-- Basic Object Information -->
                    <div class="form-group">
                        <label id="identifier">{{object.type}} Identifier</label>
                        <input id="object-edit-input-identifier" [(ngModel)]="object.identifier" (keyup)="markAsChanged()"
                               class="form-control"
                               aria-describedby="identifier">
                    </div>
                    <div class="form-group">
                        <label id="title">{{object.type}} Title</label>
                        <input id="object-edit-input-title" [(ngModel)]="object.title" (keyup)="markAsChanged()"
                               class="form-control"
                               aria-describedby="title">
                    </div>

                    <!-- Diverse Object Informations -->
                    <div *ngFor="let field of fieldsForObjectType">
                        <div *ngIf="field" class="form-group">
                            <label *ngIf="field.label">{{field.label}}</label>
                            <label *ngIf="!field.label">{{field.field}}</label>
                            <div *ngIf="!field.valuelist && !field.multiline">
                                <input [(ngModel)]="object[field.field]" (keyup)="markAsChanged()" class="form-control">
                            </div>
                            <div *ngIf="field.multiline">
                                <textarea [(ngModel)]="object[field.field]" (keyup)="markAsChanged()"
                                          class="form-control" rows="5"></textarea>
                            </div>
                            <div *ngIf="field.valuelist && !field.multivalue">
                                <select [(ngModel)]="object[field.field]" (change)="markAsChanged()" class="form-control">
                                    <option *ngFor="let item of field.valuelist" value="{{item}}">{{item}}</option>
                                </select>
                            </div>
                            <valuelist *ngIf="field.valuelist && field.multivalue" [(object)]="object"
                                       [field]="field"></valuelist>
                        </div>
                    </div>

                    <!-- Relations -->
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3 class="panel-title">Relationen</h3>
                        </div>
                        <ul class="list-group">
                            <li *ngFor="let relationField of relationsProvider.getRelationFields()" class="list-group-item">
                                <label *ngIf="relationField.label">{{relationField.label}}</label>
                                <label *ngIf="!relationField.label">{{relationField.field}}</label>
                                <relation-picker-group [(object)]="object" [field]="relationField"></relation-picker-group>
                            </li>
                        </ul>
                    </div>
                </form>

            </main>

        </section>

    </div>

</div>`
})

export class ObjectEditComponent implements OnChanges,OnInit {

    @Input() object: Entity;
    @Input() projectConfiguration: ProjectConfiguration;

    public types : string[];
    public fieldsForObjectType : any;

    constructor(
        private persistenceManager: PersistenceManager,
        private messages: Messages,
        private relationsProvider: RelationsProvider // used from within template
    ) {}

    ngOnInit():any {
        this.setFieldsForObjectType(); // bad, this is necessary for testing
    }

    public setType(type: string) {

        this.object.type = type;
        this.setFieldsForObjectType();
    }

    private setFieldsForObjectType() {
        if (this.object==undefined) return;
        if (!this.projectConfiguration) return;
        this.fieldsForObjectType=this.projectConfiguration.getFields(this.object.type);
    }

    public ngOnChanges() {

        if (this.object && this.projectConfiguration) {
            this.persistenceManager.setOldVersion(this.object);
            this.setFieldsForObjectType();
            this.types=this.projectConfiguration.getTypes();
        }
    }

    /**
     * Saves the object to the local datastore.
     */
    public save() {
        this.messages.clear();

        this.persistenceManager.load(this.object);
        this.persistenceManager.persist().then(
            () => {
                this.persistenceManager.setOldVersion(this.object);
                this.messages.add(MD.OBJLIST_SAVE_SUCCESS);
            },
            errors => {
                if (errors) {
                    for (var i in errors) {
                        this.messages.add(errors[i]);
                    }
                }
            }
        );
    }

    public markAsChanged() {
        this.persistenceManager.load(this.object);
    }
}