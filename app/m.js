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
    var M;
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
            M = (function () {
                function M() {
                    this.msgs = {};
                    this.msgs[M.OBJLIST_IDEXISTS] = {
                        content: 'Objekt-Identifier existiert bereits.',
                        level: 'danger',
                    };
                    this.msgs[M.OBJLIST_IDMISSING] = {
                        content: 'Objekt-Identifier fehlt.',
                        level: 'danger'
                    };
                    this.msgs[M.OBJLIST_SAVE_SUCCESS] = {
                        content: 'Das Objekt wurde erfolgreich gespeichert.',
                        level: 'success'
                    };
                    this.msgs[M.MESSAGES_NOBODY] = {
                        content: "Keine Message gefunden für Schlüssel 'id'.",
                        level: 'danger'
                    };
                    this.msgs[M.PC_GENERIC_ERROR] = {
                        content: "Fehler beim Auswerten eines Konfigurationsobjektes.",
                        level: 'danger'
                    };
                    this.msgs[M.PARSE_GENERIC_ERROR] = {
                        content: "Fehler beim Parsen einer Konfigurationsdatei.",
                        level: 'danger'
                    };
                }
                M.OBJLIST_IDEXISTS = 'objectlist/idexists';
                M.OBJLIST_IDMISSING = 'objectlist/idmissing';
                M.OBJLIST_SAVE_SUCCESS = 'objectlist/savesuccess';
                M.MESSAGES_NOBODY = 'messages/nobody';
                M.PC_GENERIC_ERROR = 'pmc/generic';
                M.PARSE_GENERIC_ERROR = 'parse/generic';
                M = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], M);
                return M;
            }());
            exports_1("M", M);
        }
    }
});
//# sourceMappingURL=m.js.map