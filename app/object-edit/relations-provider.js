System.register(["@angular/core"], function(exports_1, context_1) {
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
    var core_1;
    var RelationsProvider;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            /**
             *
             */
            RelationsProvider = (function () {
                function RelationsProvider() {
                    this.relationFields = [
                        { "field": "Belongs to", "inverse": "Includes", "label": "Enthalten in" },
                        { "field": "Includes", "inverse": "Belongs to", "label": "Enthält" },
                        { "field": "Above", "inverse": "Below", "label": "Oberhalb von" },
                        { "field": "Below", "inverse": "Above", "label": "Unterhalb von" },
                        { "field": "Next to", "inverse": "Next to", "label": "Benachbart zu" },
                        { "field": "Is before", "inverse": "Is after", "label": "Zeitlich vor" },
                        { "field": "Is after", "inverse": "Is before", "label": "Zeitlich nach" },
                        { "field": "Is coeval with", "inverse": "Is coeval with", "label": "Zeitgleich mit" },
                        { "field": "Cuts", "inverse": "Is cut by", "label": "Schneidet" },
                        { "field": "Is cut by", "inverse": "Cuts", "label": "Wird geschnitten von" }
                    ];
                }
                RelationsProvider.prototype.getRelationFields = function () {
                    return this.relationFields;
                };
                RelationsProvider.prototype.getInverse = function (prop) {
                    for (var _i = 0, _a = this.relationFields; _i < _a.length; _i++) {
                        var p = _a[_i];
                        if (p["field"] == prop)
                            return p["inverse"];
                    }
                    return undefined;
                };
                RelationsProvider.prototype.isRelationProperty = function (propertyName) {
                    for (var _i = 0, _a = this.relationFields; _i < _a.length; _i++) {
                        var p = _a[_i];
                        if (p["field"] == propertyName)
                            return true;
                    }
                    return false;
                };
                RelationsProvider = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], RelationsProvider);
                return RelationsProvider;
            }());
            exports_1("RelationsProvider", RelationsProvider);
        }
    }
});
