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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var md_internal_1 = require("../messages/md-internal");
var ConfigReader = (function () {
    function ConfigReader(http) {
        this.http = http;
    }
    ConfigReader.prototype.read = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(path).subscribe(function (data_) {
                var data;
                try {
                    // data = JSON.parse(data_['_body']);
                    console.log("data", data);
                    data = _data;
                }
                catch (e) {
                    reject([md_internal_1.MDInternal.PARSE_ERROR_INVALID_JSON, path]);
                }
                try {
                    resolve(data);
                }
                catch (e) {
                    console.log(e);
                }
            });
        });
    };
    return ConfigReader;
}());
ConfigReader = __decorate([
    core_1.Injectable()
    /**
     * @author Daniel de Oliveira
     * @author Thomas Kleinke
     */
    ,
    __metadata("design:paramtypes", [http_1.HttpClient])
], ConfigReader);
exports.ConfigReader = ConfigReader;
//# sourceMappingURL=config-reader.js.map