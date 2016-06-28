System.register(['@angular/core', "@angular/common", "./document-edit-change-monitor", "../datastore/read-datastore"], function(exports_1, context_1) {
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
    var core_1, common_1, document_edit_change_monitor_1, read_datastore_1;
    var RelationPickerComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (document_edit_change_monitor_1_1) {
                document_edit_change_monitor_1 = document_edit_change_monitor_1_1;
            },
            function (read_datastore_1_1) {
                read_datastore_1 = read_datastore_1_1;
            }],
        execute: function() {
            /**
             * @author Jan G. Wieners
             * @author Thomas Kleinke
             */
            RelationPickerComponent = (function () {
                function RelationPickerComponent(element, datastore, saveService) {
                    this.element = element;
                    this.datastore = datastore;
                    this.saveService = saveService;
                    this.selectedSuggestionIndex = -1;
                    // This is to compensate for an issue where it is possible
                    // to call updateSuggestions repeatedly in short time.
                    // It is intended to be only used as guard in updateSuggestions.
                    this.updateSuggestionsMode = false;
                }
                RelationPickerComponent.prototype.ngOnChanges = function () {
                    var _this = this;
                    if (this.document)
                        this.resource = this.document['resource'];
                    this.suggestions = [];
                    this.idSearchString = "";
                    this.selectedTarget = undefined;
                    var relationId = this.resource[this.field.field][this.relationIndex];
                    if (relationId && relationId != "") {
                        this.datastore.get(relationId).then(function (document) { _this.selectedTarget = document; }, function (err) { console.error(err); });
                    }
                    else {
                        setTimeout(this.focusInputField.bind(this), 100);
                    }
                };
                RelationPickerComponent.prototype.updateSuggestions = function () {
                    var _this = this;
                    if (this.updateSuggestionsMode)
                        return;
                    this.updateSuggestionsMode = true;
                    if (this.idSearchString.length < 1)
                        return;
                    this.clearSuggestions();
                    this.datastore.find(this.idSearchString)
                        .then(function (documents) {
                        _this.makeSuggestionsFrom(documents);
                        _this.updateSuggestionsMode = false;
                    }).catch(function (err) {
                        console.debug(err);
                        _this.updateSuggestionsMode = false;
                    });
                };
                RelationPickerComponent.prototype.clearSuggestions = function () {
                    this.suggestions = [];
                };
                RelationPickerComponent.prototype.makeSuggestionsFrom = function (documents) {
                    for (var i in documents) {
                        // Show only the first five suggestions
                        if (this.suggestions.length == 5)
                            break;
                        if (this.checkSuggestion(documents[i]['resource']))
                            this.suggestions.push(documents[i]);
                        this.updateSuggestionsMode = false;
                    }
                };
                /**
                 * Checks if the given object should be shown as a suggestion
                 * @param object
                 */
                RelationPickerComponent.prototype.checkSuggestion = function (resource) {
                    // Don't suggest the object itself
                    if (this.resource['@id'] == resource['@id'])
                        return false;
                    // Don't suggest an object that is already included as a target in the relation list
                    if (this.resource[this.field.field].indexOf(resource['@id']) > -1)
                        return false;
                    // Don't suggest an object that is already included as a target in the inverse relation list
                    if (this.resource[this.field.inverse]
                        && this.resource[this.field.inverse].indexOf(resource['@id']) > -1)
                        return false;
                    return true;
                };
                /**
                 * Creates a relation to the target object.
                 * @param target
                 */
                RelationPickerComponent.prototype.createRelation = function (document) {
                    // this.createInverseRelation(target);
                    this.resource[this.field.field][this.relationIndex] = document['resource']['@id'];
                    this.selectedTarget = document;
                    this.idSearchString = "";
                    this.suggestions = [];
                    this.saveService.setChanged();
                };
                RelationPickerComponent.prototype.editTarget = function () {
                    this.idSearchString = this.selectedTarget['resource'].identifier;
                    this.suggestions = [this.selectedTarget];
                    this.selectedSuggestionIndex = 0;
                    this.selectedTarget = undefined;
                    setTimeout(this.focusInputField.bind(this), 100);
                };
                RelationPickerComponent.prototype.enterSuggestionMode = function () {
                    this.suggestionsVisible = true;
                };
                RelationPickerComponent.prototype.leaveSuggestionMode = function () {
                    var _this = this;
                    if (!this.resource[this.field.field][this.relationIndex]
                        || this.resource[this.field.field][this.relationIndex] == "") {
                        this.deleteRelation();
                    }
                    this.suggestionsVisible = false;
                    if (!this.selectedTarget && this.resource[this.field.field][this.relationIndex]
                        && this.resource[this.field.field][this.relationIndex] != "") {
                        this.datastore.get(this.resource[this.field.field][this.relationIndex])
                            .then(function (document) { _this.selectedTarget = document; }, function (err) { console.error(err); });
                    }
                };
                RelationPickerComponent.prototype.focusInputField = function () {
                    var elements = this.element.nativeElement.getElementsByTagName("input");
                    if (elements.length == 1) {
                        elements.item(0).focus();
                    }
                };
                RelationPickerComponent.prototype.deleteRelation = function () {
                    var _this = this;
                    var targetId = this.resource[this.field.field][this.relationIndex];
                    return new Promise(function (resolve) {
                        if (targetId.length == 0) {
                            _this.resource[_this.field.field].splice(_this.relationIndex, 1);
                        }
                        else {
                            _this.resource[_this.field.field].splice(_this.relationIndex, 1);
                            // todo
                            _this.saveService.setChanged();
                        }
                        if (_this.resource[_this.field.field].length == 0)
                            delete _this.resource[_this.field.field];
                        resolve();
                    });
                };
                RelationPickerComponent.prototype.keyDown = function (event) {
                    switch (event.keyIdentifier) {
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
                };
                RelationPickerComponent.prototype.keyUp = function (event) {
                    switch (event.keyIdentifier) {
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
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], RelationPickerComponent.prototype, "document", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], RelationPickerComponent.prototype, "field", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], RelationPickerComponent.prototype, "relationIndex", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], RelationPickerComponent.prototype, "primary", void 0);
                RelationPickerComponent = __decorate([
                    core_1.Component({
                        selector: 'relation-picker',
                        templateUrl: 'src/templates/relation-picker.html',
                        directives: [common_1.CORE_DIRECTIVES, common_1.COMMON_DIRECTIVES, common_1.FORM_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, read_datastore_1.ReadDatastore, document_edit_change_monitor_1.DocumentEditChangeMonitor])
                ], RelationPickerComponent);
                return RelationPickerComponent;
            }());
            exports_1("RelationPickerComponent", RelationPickerComponent);
        }
    }
});
//# sourceMappingURL=relation-picker.component.js.map