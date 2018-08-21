"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var datastore_1 = require("../datastore/datastore");
var read_datastore_1 = require("../datastore/read-datastore");
var config_loader_1 = require("../configuration/config-loader");
var fields_view_component_1 = require("./docview/fields-view.component");
var relations_view_component_1 = require("./docview/relations-view.component");
var document_teaser_component_1 = require("./document-teaser.component");
var idai_widgets_module_1 = require("../widgets/idai-widgets.module");
var IdaiDocumentsModule = (function () {
    function IdaiDocumentsModule() {
    }
    return IdaiDocumentsModule;
}());
IdaiDocumentsModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            router_1.RouterModule,
            idai_widgets_module_1.IdaiWidgetsModule,
            ng_bootstrap_1.NgbModule.forRoot()
        ],
        declarations: [
            fields_view_component_1.FieldsViewComponent,
            relations_view_component_1.RelationsViewComponent,
            document_teaser_component_1.DocumentTeaserComponent,
        ],
        providers: [
            config_loader_1.ConfigLoader,
            common_1.DecimalPipe,
            { provide: core_1.LOCALE_ID, useValue: 'de-DE' },
            { provide: read_datastore_1.ReadDatastore, useExisting: datastore_1.Datastore },
        ],
        exports: [
            fields_view_component_1.FieldsViewComponent,
            relations_view_component_1.RelationsViewComponent,
            document_teaser_component_1.DocumentTeaserComponent
        ]
    })
], IdaiDocumentsModule);
exports.IdaiDocumentsModule = IdaiDocumentsModule;
//# sourceMappingURL=idai-documents.module.js.map