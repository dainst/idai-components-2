import {Component, Input, OnChanges, ElementRef} from '@angular/core';
import {CORE_DIRECTIVES,COMMON_DIRECTIVES,FORM_DIRECTIVES} from "@angular/common";
import {Document} from "../core-services/document";
import {Resource} from "../core-services/resource";
import {DocumentEditChangeMonitor} from "./document-edit-change-monitor";
import {ReadDatastore} from "../datastore/read-datastore";


/**
 * @author Jan G. Wieners
 * @author Thomas Kleinke
 */
@Component({

    selector: 'relation-picker',
    templateUrl: 'src/templates/relation-picker.html',
    directives: [CORE_DIRECTIVES, COMMON_DIRECTIVES, FORM_DIRECTIVES]
})

export class RelationPickerComponent implements OnChanges {

    @Input() document: any;
    
    @Input() field: any;
    @Input() relationIndex: number;
    @Input() primary: string;

    public resource: Resource;
    public relations: any;

    private suggestions: Document[];
    private selectedSuggestionIndex: number = -1;
    private selectedTarget: Document;
    private idSearchString: string;
    private suggestionsVisible: boolean;

    // This is to compensate for an issue where it is possible
    // to call updateSuggestions repeatedly in short time.
    // It is intended to be only used as guard in updateSuggestions.
    private updateSuggestionsMode=false;

    constructor(private element: ElementRef,
        private datastore: ReadDatastore,
        private saveService: DocumentEditChangeMonitor 
    ) {}

    public ngOnChanges() {

        if (this.document) {
            this.resource=this.document['resource'];
            this.relations=this.resource['relations'];
        }


        this.suggestions = [];
        this.idSearchString = "";
        this.selectedTarget = undefined;

        var relationId: string = this.relations[this.field.name][this.relationIndex];

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

        if (this.updateSuggestionsMode) return;
        this.updateSuggestionsMode=true;

        if (this.idSearchString.length < 1) return;

        this.clearSuggestions();
        this.datastore.find(this.idSearchString)
            .then(documents => {

                this.makeSuggestionsFrom(documents);
                this.updateSuggestionsMode=false;

            }).catch(err => {
                console.debug(err);
                this.updateSuggestionsMode=false;
            }
        );
    }

    private clearSuggestions() {
        this.suggestions = [];
    }

    private makeSuggestionsFrom(documents) {
        for (var i in documents) {

            // Show only the first five suggestions
            if (this.suggestions.length == 5)
                break;

            if (this.checkSuggestion(documents[i]['resource']))
                this.suggestions.push(documents[i]);

            this.updateSuggestionsMode=false;
        }
    }

    /**
     * Checks if the given object should be shown as a suggestion
     * @param object
     */
    private checkSuggestion(resource: Resource) {

        // Don't suggest the object itself
        if (this.resource['id'] == resource['id'])
            return false;

        // TODO Why is this check not active anymore?
        // Don't suggest an object that is already included as a target in the relation list
        // if (this.resource[this.field.name].indexOf(resource['id']) > -1)
        //     return false;

        // Don't suggest an object that is already included as a target in the inverse relation list
        if (this.resource['relations'][this.field.inverse]
                && this.resource['relations'][this.field.inverse].indexOf(resource['id']) > -1)
            return false;

        return true;
    }

    /**
     * Creates a relation to the target object.
     * @param target
     */
    public createRelation(document: Document) {

        this.resource['relations'][this.field.name][this.relationIndex] = document['resource']['id'];
        this.selectedTarget = document;
        this.idSearchString = "";
        this.suggestions = [];

        this.saveService.setChanged();
    }

    public editTarget() {

        this.idSearchString = this.selectedTarget['resource'][this.primary];
        this.suggestions = [ this.selectedTarget ];
        this.selectedSuggestionIndex = 0;
        this.selectedTarget = undefined;

        setTimeout(this.focusInputField.bind(this), 100);
    }

    public enterSuggestionMode() {

        this.suggestionsVisible = true;
    }

    public leaveSuggestionMode() {

        if (!this.resource['relations'][this.field.name][this.relationIndex]
                || this.resource['relations'][this.field.name][this.relationIndex] == "") {
            return this.deleteRelation();
        }

        this.suggestionsVisible = false;

        if (!this.selectedTarget && this.resource['relations'][this.field.name][this.relationIndex]
                                 && this.resource['relations'][this.field.name][this.relationIndex] != "") {
            this.datastore.get(this.resource['relations'][this.field.name][this.relationIndex])
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

        var targetId = this.resource['relations'][this.field.name][this.relationIndex];

        return new Promise<any>((resolve) => {
            if (targetId.length == 0) {
                this.resource['relations'][this.field.name].splice(this.relationIndex, 1);
            } else {
                this.resource['relations'][this.field.name].splice(this.relationIndex, 1);
                // todo
                this.saveService.setChanged();
            }

            if (this.resource['relations'][this.field.name].length==0)
                delete this.resource['relations'][this.field.name]
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
                setTimeout(this.updateSuggestions.bind(this), 100); // This is to compensate for
                  // a slight delay where idSearchString takes some time to get updated. The behaviour
                  // was discovered on an ocasion where the search string got pasted into the input field.
                  // If one does the keyup quickly after pasting, it wasn't working. If One leaves the command
                  // key somewhat later, it worked.
                break;
        }
    }

}