import {Component, Input, OnChanges, ElementRef} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Document} from "../core-services/document";
import {Resource} from "../core-services/resource";
import {PersistenceManager} from "./persistence-manager";
import {ReadDatastore} from "../datastore/read-datastore";


/**
 * @author Jan G. Wieners
 * @author Thomas Kleinke
 */
@Component({

    selector: 'relation-picker',
    templateUrl: 'lib/templates/relation-picker.html',
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES]
})

export class RelationPickerComponent implements OnChanges {

    @Input() document: any;
    
    @Input() field: any;
    @Input() relationIndex: number;
    @Input() primary: string;

    public resource: Resource;

    private suggestions: Document[];
    private selectedSuggestionIndex: number = -1;
    private selectedTarget: Document;
    private idSearchString: string;
    private suggestionsVisible: boolean;

    constructor(private element: ElementRef,
        private datastore: ReadDatastore,
        private persistenceManager: PersistenceManager // TODO instead of this the parent object edit component should get addressed for marking an object as changed
    ) {}

    public ngOnChanges() {

        if (this.document)
            this.resource=this.document['resource'];

        this.suggestions = [];
        this.idSearchString = "";
        this.selectedTarget = undefined;

        var relationId: string = this.resource[this.field.field][this.relationIndex];

        if (relationId && relationId != "") {
            this.datastore.get(relationId).then(
                document => { this.selectedTarget = document; },
                err => { console.error(err); }
            );
        } else {
            setTimeout(this.focusInputField.bind(this), 100);
        }
    }

    private updateSuggestions() {

        if (this.idSearchString.length > 0) {
            this.datastore.find(this.idSearchString, {})
                .then(documents => {
                    this.suggestions = [];
                    for (var i in documents) {

                        // Show only the first five suggestions
                        if (this.suggestions.length == 5)
                            break;

                        if (this.checkSuggestion(documents[i]['resource']))
                            this.suggestions.push(documents[i]);
                    }
                }).catch(err =>
                console.error(err));
        } else
            this.suggestions = [];
    }

    /**
     * Checks if the given object should be shown as a suggestion
     * @param object
     */
    private checkSuggestion(resource: Resource) {

        // Don't suggest the object itself
        if (this.resource.id == resource.id)
            return false;

        // Don't suggest an object that is already included as a target in the relation list
        if (this.resource[this.field.field].indexOf(resource.id) > -1)
            return false;

        // Don't suggest an object that is already included as a target in the inverse relation list
        if (this.resource[this.field.inverse]
                && this.resource[this.field.inverse].indexOf(resource.id) > -1)
            return false;

        return true;
    }

    /**
     * Creates a relation to the target object.
     * @param target
     */
    public createRelation(document: Document) {

        // this.createInverseRelation(target);
        this.resource[this.field.field][this.relationIndex] = document['resource'].id;
        this.selectedTarget = document;
        this.idSearchString = "";
        this.suggestions = [];

        this.persistenceManager.load(this.document);
    }

    public editTarget() {

        this.idSearchString = this.selectedTarget['resource'].identifier;
        this.suggestions = [ this.selectedTarget ];
        this.selectedSuggestionIndex = 0;
        this.selectedTarget = undefined;

        setTimeout(this.focusInputField.bind(this), 100);
    }

    public enterSuggestionMode() {

        this.suggestionsVisible = true;
    }

    public leaveSuggestionMode() {

        if (!this.resource[this.field.field][this.relationIndex]
                || this.resource[this.field.field][this.relationIndex] == "") {
            this.deleteRelation();
        }

        this.suggestionsVisible = false;

        if (!this.selectedTarget && this.resource[this.field.field][this.relationIndex]
                                 && this.resource[this.field.field][this.relationIndex] != "") {
            this.datastore.get(this.resource[this.field.field][this.relationIndex])
                .then(
                    document => { this.selectedTarget = document; },
                    err => { console.error(err); }
                );
        }
    }

    public focusInputField() {

        var elements = this.element.nativeElement.getElementsByTagName("input");

        if (elements.length == 1) {
            elements.item(0).focus();
        }
    }

    public deleteRelation(): Promise<any> {

        var targetId = this.resource[this.field.field][this.relationIndex];

        return new Promise<any>((resolve) => {
            if (targetId.length == 0) {
                this.resource[this.field.field].splice(this.relationIndex, 1);
            } else {
                this.resource[this.field.field].splice(this.relationIndex, 1);
                // todo
                this.persistenceManager.load(this.document);
            }

            if (this.resource[this.field.field].length==0) delete this.resource[this.field.field]
            resolve();
        });
    }

    public keyDown(event: any) {

        switch(event.keyIdentifier) {
            case "Up":
                if (this.selectedSuggestionIndex > 0)
                    this.selectedSuggestionIndex--;
                else
                    this.selectedSuggestionIndex = this.suggestions.length - 1;
                event.preventDefault();
                break;
            case "Down":
                if (this.selectedSuggestionIndex < this.suggestions.length - 1)
                    this.selectedSuggestionIndex++;
                else
                    this.selectedSuggestionIndex = 0;
                event.preventDefault();
                break;
            case "Left":
            case "Right":
                break;
            case "Enter":
                if (this.selectedSuggestionIndex > -1 && this.suggestions.length > 0)
                    this.createRelation(this.suggestions[this.selectedSuggestionIndex]);
                break;
        }
    }

    public keyUp(event: any) {

        switch(event.keyIdentifier) {
            case "Up":
            case "Down":
            case "Left":
            case "Right":
            case "Enter":
                break;
            default:
                this.selectedSuggestionIndex = 0;
                this.updateSuggestions();
                break;
        }
    }

}