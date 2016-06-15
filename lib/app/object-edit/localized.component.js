System.register(['@angular/core', "@angular/common", "./persistence-manager", "./fieldlist.component"], function(exports_1, context_1) {
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
    var core_1, common_1, persistence_manager_1, fieldlist_component_1;
    var LocalizedComponent;
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
            function (fieldlist_component_1_1) {
                fieldlist_component_1 = fieldlist_component_1_1;
            }],
        execute: function() {
            /**
             * @author Daniel de Oliveira
             */
            LocalizedComponent = (function () {
                function LocalizedComponent(persistenceManager) {
                    this.persistenceManager = persistenceManager;
                }
                LocalizedComponent.prototype.setLang = function (innerFieldDefinition, lang) {
                    innerFieldDefinition['field'] = lang;
                    return innerFieldDefinition;
                };
                LocalizedComponent.prototype.languages = function () {
                    if (!this.document['resource'][this.fieldDefinition.field])
                        return [];
                    return Object.keys(this.document['resource'][this.fieldDefinition.field]);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], LocalizedComponent.prototype, "document", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], LocalizedComponent.prototype, "fieldDefinition", void 0);
                LocalizedComponent = __decorate([
                    core_1.Component({
                        selector: 'localized',
                        template: "<div>\n\n        <ul>\n            <li *ngFor=\"let language of languages()\">\n                {{language}}\n                \n                <fieldlist *ngIf=\"fieldDefinition.inner.array\" [(document)]=\"document['resource'][fieldDefinition.field]\" \n                    [fieldDefinition]=\"setLang(fieldDefinition.inner,language)\"></fieldlist>\n                <div *ngIf=\"!fieldDefinition.inner.array\">not implemented</div>\n        \n            </li>\n        </ul>\n\n    </div>",
                        directives: [
                            common_1.CORE_DIRECTIVES,
                            common_1.COMMON_DIRECTIVES,
                            common_1.FORM_DIRECTIVES,
                            fieldlist_component_1.FieldlistComponent
                        ]
                    }), 
                    __metadata('design:paramtypes', [persistence_manager_1.PersistenceManager])
                ], LocalizedComponent);
                return LocalizedComponent;
            }());
            exports_1("LocalizedComponent", LocalizedComponent);
        }
    }
});
