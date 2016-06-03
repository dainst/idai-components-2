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
    var MD;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            /**
             * This map contains the message bodies
             * messages identified by their key.
             * It can be replaced later by another data source
             * like an external service.
             *
             * @author Daniel M. de Oliveira
             * @author Jan G. Wieners
             */
            MD = (function () {
                function MD() {
                    this.msgs = {};
                    this.msgs[MD.OBJLIST_IDEXISTS] = {
                        content: 'Objekt-Identifier existiert bereits.',
                        level: 'danger',
                    };
                    this.msgs[MD.OBJLIST_IDMISSING] = {
                        content: 'Objekt-Identifier fehlt.',
                        level: 'danger'
                    };
                    this.msgs[MD.OBJLIST_SAVE_SUCCESS] = {
                        content: 'Das Objekt wurde erfolgreich gespeichert.',
                        level: 'success'
                    };
                    this.msgs[MD.MESSAGES_NOBODY] = {
                        content: "Keine Message gefunden für Schlüssel 'id'.",
                        level: 'danger'
                    };
                    this.msgs[MD.PC_GENERIC_ERROR] = {
                        content: "Fehler beim Auswerten eines Konfigurationsobjektes.",
                        level: 'danger'
                    };
                    this.msgs[MD.PARSE_GENERIC_ERROR] = {
                        content: "Fehler beim Parsen einer Konfigurationsdatei.",
                        level: 'danger'
                    };
                }
                MD.OBJLIST_IDEXISTS = 'objectlist/idexists';
                MD.OBJLIST_IDMISSING = 'objectlist/idmissing';
                MD.OBJLIST_SAVE_SUCCESS = 'objectlist/savesuccess';
                MD.MESSAGES_NOBODY = 'messages/nobody';
                MD.PC_GENERIC_ERROR = 'pmc/generic';
                MD.PARSE_GENERIC_ERROR = 'parse/generic';
                MD = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], MD);
                return MD;
            }());
            exports_1("MD", MD);
        }
    }
});
