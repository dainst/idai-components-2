import {Component, Input, OnChanges, ElementRef} from '@angular/core';
import {Document} from "../model/document";
import {Resource} from "../model/resource";
import {Query} from "../datastore/query";
import {DocumentEditChangeMonitor} from "./document-edit-change-monitor";
import {ReadDatastore} from "../datastore/read-datastore";
import {RelationDefinition} from "../configuration/relation-definition";


@Component({
    moduleId: module.id,
    selector: 'relation-picker',
    templateUrl: './relation-picker.html'
})
/**
 * @author Jan G. Wieners
 * @author Thomas Kleinke
 * @author Daniel de Oliveira
 */
export class RelationPickerComponent implements OnChanges {

    @Input() document: any;
    
    @Input() relationDefinition: any;
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
    private updateSuggestionsMode = false;

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

        let relationId: string = this.relations[this.relationDefinition.name][this.relationIndex];

        if (relationId && relationId != "") {
            this.datastore.get(relationId).then(
                document => { this.selectedTarget = document as Document; },
                err => { console.error(err); }
            );
        } else {
            setTimeout(this.focusInputField.bind(this), 100);
        }
    }

    private updateSuggestions() {

        if (this.updateSuggestionsMode) return;

        this.clearSuggestions();

        if (this.idSearchString.length < 1) return;

        this.updateSuggestionsMode = true;

        this.datastore.find(this.idSearchString, [''], true)
            .then(documents => {
                this.makeSuggestionsFrom(documents);
                this.updateSuggestionsMode = false;

            }).catch(err => {
                console.debug(err);
                this.updateSuggestionsMode = false;
            }
        );
    }

    private clearSuggestions() {
        this.suggestions = [];
    }

    private makeSuggestionsFrom(documents) {
        for (let i in documents) {

            // Show only the first five suggestions
            if (this.suggestions.length == 5)
                break;

            if (RelationPickerComponent.checkResourceSuggestion(this.resource,documents[i].resource,this.relationDefinition))
                this.suggestions.push(documents[i]);
        }
    }

    /**
     * Checks if the given suggestion should be shown as a suggestion
     * @param resource
     * @param suggestion
     * @param relDef
     * @return true if the suggestion should be suggested, false otherwise
     */
    private static checkResourceSuggestion(resource:Resource, suggestion: Resource, relDef:RelationDefinition) {

        // Don't suggest the object itself
        if (resource.id == suggestion.id)
            return false;

        // Don't suggest an object that is already included as a target in the relation list
        if (resource.relations[relDef.name].indexOf(suggestion.id) > -1) return false;

        // Don't suggest an object that is already included as a target in the inverse relation list
        if (resource.relations[relDef.inverse]
                && resource.relations[relDef.inverse].indexOf(suggestion.id) > -1)
            return false;

        // Don't suggest an object whose type is not a part of the relation's range
        return relDef.range.indexOf(suggestion.type) != -1;
    }

    /**
     * Creates a relation to the target object.
     * @param document
     */
    public createRelation(document: Document) {

        this.resource['relations'][this.relationDefinition.name][this.relationIndex] = document['resource']['id'];
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

        if (!this.resource['relations'][this.relationDefinition.name][this.relationIndex]
                || this.resource['relations'][this.relationDefinition.name][this.relationIndex] == "") {
            return this.deleteRelation();
        }

        this.suggestionsVisible = false;

        if (!this.selectedTarget && this.resource['relations'][this.relationDefinition.name][this.relationIndex]
                                 && this.resource['relations'][this.relationDefinition.name][this.relationIndex] != "") {
            this.datastore.get(this.resource['relations'][this.relationDefinition.name][this.relationIndex])
                .then(
                    document => { this.selectedTarget = document as Document; },
                    err => { console.error(err); }
                );
        }
    }

    public focusInputField() {

        let elements = this.element.nativeElement.getElementsByTagName("input");

        if (elements.length == 1) {
            elements.item(0).focus();
        }
    }

    public deleteRelation(): Promise<any> {

        let targetId = this.resource['relations'][this.relationDefinition.name][this.relationIndex];

        return new Promise<any>((resolve) => {
            if (targetId.length == 0) {
                this.resource['relations'][this.relationDefinition.name].splice(this.relationIndex, 1);
            } else {
                this.resource['relations'][this.relationDefinition.name].splice(this.relationIndex, 1);
                // todo
                this.saveService.setChanged();
            }

            if (this.resource['relations'][this.relationDefinition.name].length==0)
                delete this.resource['relations'][this.relationDefinition.name]
            resolve();
        });
    }

    public keyDown(event: any) {

        switch(event.key) {
            case "ArrowUp":
                if (this.selectedSuggestionIndex > 0)
                    this.selectedSuggestionIndex--;
                else
                    this.selectedSuggestionIndex = this.suggestions.length - 1;
                event.preventDefault();
                break;
            case "ArrowDown":
                if (this.selectedSuggestionIndex < this.suggestions.length - 1)
                    this.selectedSuggestionIndex++;
                else
                    this.selectedSuggestionIndex = 0;
                event.preventDefault();
                break;
            case "ArrowLeft":
            case "ArrowRight":
                break;
            case "Enter":
                if (this.selectedSuggestionIndex > -1 && this.suggestions.length > 0)
                    this.createRelation(this.suggestions[this.selectedSuggestionIndex]);
                break;
        }
    }

    public keyUp(event: any) {

        switch(event.key) {
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowLeft":
            case "ArrowRight":
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