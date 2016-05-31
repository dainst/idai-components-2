System.register(['@angular/core', "@angular/common", "../core-services/persistence-manager", "../datastore/datastore"], function(exports_1, context_1) {
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
    var core_1, common_1, persistence_manager_1, datastore_1;
    var RelationPickerComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (persistence_manager_1_1) {
                persistence_manager_1 = persistence_manager_1_1;
            },
            function (datastore_1_1) {
                datastore_1 = datastore_1_1;
            }],
        execute: function() {
            /**
             * @author Jan G. Wieners
             * @author Thomas Kleinke
             */
            RelationPickerComponent = (function () {
                function RelationPickerComponent(element, 
                    /**
                     * In this component the datastore should be used only for read access.
                     */
                    datastore, persistenceManager // TODO instead of this the parent object edit component should get addressed for marking an object as changed
                    ) {
                    this.element = element;
                    this.datastore = datastore;
                    this.persistenceManager = persistenceManager;
                    this.selectedSuggestionIndex = -1;
                }
                RelationPickerComponent.prototype.ngOnChanges = function () {
                    var _this = this;
                    this.suggestions = [];
                    this.idSearchString = "";
                    this.selectedTarget = undefined;
                    var relationId = this.object[this.field.field][this.relationIndex];
                    if (relationId && relationId != "") {
                        this.datastore.get(relationId).then(function (object) { _this.selectedTarget = object; }, function (err) { console.error(err); });
                    }
                    else {
                        setTimeout(this.focusInputField.bind(this), 100);
                    }
                };
                RelationPickerComponent.prototype.updateSuggestions = function () {
                    var _this = this;
                    if (this.idSearchString.length > 0) {
                        this.datastore.find(this.idSearchString, {})
                            .then(function (objects) {
                            _this.suggestions = [];
                            for (var i in objects) {
                                // Show only the first five suggestions
                                if (_this.suggestions.length == 5)
                                    break;
                                if (_this.checkSuggestion(objects[i]))
                                    _this.suggestions.push(objects[i]);
                            }
                        }).catch(function (err) {
                            return console.error(err);
                        });
                    }
                    else
                        this.suggestions = [];
                };
                /**
                 * Checks if the given object should be shown as a suggestion
                 * @param object
                 */
                RelationPickerComponent.prototype.checkSuggestion = function (object) {
                    // Don't suggest the object itself
                    if (this.object.id == object.id)
                        return false;
                    // Don't suggest an object that is already included as a target in the relation list
                    if (this.object[this.field.field].indexOf(object.id) > -1)
                        return false;
                    // Don't suggest an object that is already included as a target in the inverse relation list
                    if (this.object[this.field.inverse]
                        && this.object[this.field.inverse].indexOf(object.id) > -1)
                        return false;
                    return true;
                };
                /**
                 * Creates a relation to the target object.
                 * @param target
                 */
                RelationPickerComponent.prototype.createRelation = function (target) {
                    // this.createInverseRelation(target);
                    this.object[this.field.field][this.relationIndex] = target.id;
                    this.selectedTarget = target;
                    this.idSearchString = "";
                    this.suggestions = [];
                    this.persistenceManager.load(this.object);
                };
                RelationPickerComponent.prototype.editTarget = function () {
                    this.idSearchString = this.selectedTarget.identifier;
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
                    if (!this.object[this.field.field][this.relationIndex]
                        || this.object[this.field.field][this.relationIndex] == "") {
                        this.deleteRelation();
                    }
                    this.suggestionsVisible = false;
                    if (!this.selectedTarget && this.object[this.field.field][this.relationIndex]
                        && this.object[this.field.field][this.relationIndex] != "") {
                        this.datastore.get(this.object[this.field.field][this.relationIndex])
                            .then(function (object) { _this.selectedTarget = object; }, function (err) { console.error(err); });
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
                    console.log("delete relation");
                    var targetId = this.object[this.field.field][this.relationIndex];
                    console.log("target id ", targetId);
                    return new Promise(function (resolve) {
                        if (targetId.length == 0) {
                            _this.object[_this.field.field].splice(_this.relationIndex, 1);
                        }
                        else {
                            _this.object[_this.field.field].splice(_this.relationIndex, 1);
                            // todo
                            _this.persistenceManager.load(_this.object);
                        }
                        if (_this.object[_this.field.field].length == 0)
                            delete _this.object[_this.field.field];
                        console.log("deleted relation within: ", _this.object);
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
                            this.updateSuggestions();
                            break;
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], RelationPickerComponent.prototype, "object", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], RelationPickerComponent.prototype, "field", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], RelationPickerComponent.prototype, "relationIndex", void 0);
                RelationPickerComponent = __decorate([
                    core_1.Component({
                        selector: 'relation-picker',
                        templateUrl: 'lib/templates/relation-picker.html',
                        directives: [common_1.CORE_DIRECTIVES, common_1.COMMON_DIRECTIVES, common_1.FORM_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, datastore_1.Datastore, persistence_manager_1.PersistenceManager])
                ], RelationPickerComponent);
                return RelationPickerComponent;
            }());
            exports_1("RelationPickerComponent", RelationPickerComponent);
        }
    }
});
//# sourceMappingURL=relation-picker.component.js.map