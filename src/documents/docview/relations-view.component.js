"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var resource_1 = require("../../model/core/resource");
var read_datastore_1 = require("../../datastore/read-datastore");
var project_configuration_1 = require("../../configuration/project-configuration");
var RelationsViewComponent = (function () {
    function RelationsViewComponent(datastore, projectConfiguration) {
        this.datastore = datastore;
        this.projectConfiguration = projectConfiguration;
        this.hideRelations = [];
        this.onRelationTargetClicked = new core_1.EventEmitter();
        this.collapsed = false;
    }
    RelationsViewComponent.prototype.ngOnChanges = function () {
        this.relations = [];
        if (this.resource)
            this.processRels(this.resource);
    };
    RelationsViewComponent.prototype.clickRelation = function (document) {
        this.onRelationTargetClicked.emit(document);
    };
    RelationsViewComponent.prototype.processRels = function (resource) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                Object.keys(resource.relations)
                    .filter(function (name) { return _this.projectConfiguration.isVisibleRelation(name, _this.resource.type); })
                    .filter(function (name) { return _this.hideRelations.indexOf(name) === -1; })
                    .forEach(function (name) {
                    return _this.addRel(resource, name, _this.projectConfiguration.getRelationDefinitionLabel(name));
                });
                return [2 /*return*/];
            });
        });
    };
    RelationsViewComponent.prototype.addRel = function (resource, relationName, relLabel) {
        return __awaiter(this, void 0, void 0, function () {
            var relationGroup, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {
                            name: relLabel
                        };
                        return [4 /*yield*/, this.getTargetDocuments(resource.relations[relationName])];
                    case 1:
                        relationGroup = (_a.targets = (_b.sent()),
                            _a);
                        if (relationGroup.targets.length > 0)
                            this.relations.push(relationGroup);
                        return [2 /*return*/];
                }
            });
        });
    };
    RelationsViewComponent.prototype.getTargetDocuments = function (targetIds) {
        var promises = [];
        var targetDocuments = [];
        for (var i in targetIds) {
            var targetId = targetIds[i];
            promises.push(this.datastore.get(targetId).then(function (targetDocument) {
                targetDocuments.push(targetDocument);
            }, function (err) { return console.error('Relation target not found', err); }));
        }
        return Promise.all(promises).then(function () { return Promise.resolve(targetDocuments); });
    };
    return RelationsViewComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], RelationsViewComponent.prototype, "resource", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], RelationsViewComponent.prototype, "hideRelations", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], RelationsViewComponent.prototype, "onRelationTargetClicked", void 0);
RelationsViewComponent = __decorate([
    core_1.Component({
        selector: 'relations-view',
        moduleId: module.id,
        templateUrl: './relations-view.html'
    })
    /**
     * Shows relations and fields of a document.
     *
     * @author Thomas Kleinke
     * @author Sebastian Cuy
     * @author Daniel de Oliveira
     */
    ,
    __metadata("design:paramtypes", [read_datastore_1.ReadDatastore, project_configuration_1.ProjectConfiguration])
], RelationsViewComponent);
exports.RelationsViewComponent = RelationsViewComponent;
//# sourceMappingURL=relations-view.component.js.map