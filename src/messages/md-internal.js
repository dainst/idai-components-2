"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var md_1 = require("./md");
/**
 * A message dictionary with messages for
 * native library functionality.
 *
 * @author Daniel de Oliveira
 */
var MDInternal = /** @class */ (function (_super) {
    __extends(MDInternal, _super);
    function MDInternal() {
        var _this = _super.call(this) || this;
        _this.msgs = {};
        _this.msgs[MDInternal_1.UNKOWN_ERROR] = {
            content: 'Ein unbekannter Fehler ist aufgetreten. Details können in der Developer Console eingesehen werden.',
            level: 'danger',
            params: [],
            hidden: false
        };
        _this.msgs[MDInternal_1.MESSAGES_NOBODY] = {
            content: 'Keine Message gefunden für Schlüssel \'id\'.',
            level: 'danger',
            params: [],
            hidden: false
        };
        _this.msgs[MDInternal_1.PC_GENERIC_ERROR] = {
            content: 'Fehler beim Auswerten eines Konfigurationsobjektes.',
            level: 'danger',
            params: [],
            hidden: false
        };
        _this.msgs[MDInternal_1.PARSE_ERROR_INVALID_JSON] = {
            content: 'Fehler beim Parsen der Konfigurationsdatei \'{0}\': Das JSON ist nicht valide.',
            level: 'danger',
            params: [],
            hidden: false
        };
        _this.msgs[MDInternal_1.PERSISTENCE_ERROR_TARGETNOTFOUND] = {
            content: 'Die Ressource wurde erfolgreich gespeichert. Relationen wurden aufgrund fehlender Zielressourcen '
                + 'nicht aktualisiert.',
            level: 'warning',
            params: [],
            hidden: false
        };
        return _this;
    }
    MDInternal_1 = MDInternal;
    var MDInternal_1;
    MDInternal.UNKOWN_ERROR = 'unknown-error';
    MDInternal.MESSAGES_NOBODY = 'messages/nobody';
    MDInternal.PC_GENERIC_ERROR = 'pmc/generic';
    MDInternal.PARSE_ERROR_INVALID_JSON = 'parse/error/invalidjson';
    MDInternal.PERSISTENCE_ERROR_TARGETNOTFOUND = 'persistence/error/targetnotfound';
    MDInternal = MDInternal_1 = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], MDInternal);
    return MDInternal;
}(md_1.MD));
exports.MDInternal = MDInternal;
//# sourceMappingURL=md-internal.js.map