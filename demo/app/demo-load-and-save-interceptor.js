System.register(["@angular/core", "../../lib/app/object-edit/load-and-save-interceptor"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, load_and_save_interceptor_1;
    var DemoLoadAndSaveInterceptor;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (load_and_save_interceptor_1_1) {
                load_and_save_interceptor_1 = load_and_save_interceptor_1_1;
            }],
        execute: function() {
            /**
             * @author Daniel de Oliveira
             */
            DemoLoadAndSaveInterceptor = (function (_super) {
                __extends(DemoLoadAndSaveInterceptor, _super);
                function DemoLoadAndSaveInterceptor() {
                    _super.apply(this, arguments);
                }
                DemoLoadAndSaveInterceptor.prototype.interceptLoad = function (object) {
                    return undefined;
                };
                DemoLoadAndSaveInterceptor.prototype.interceptSave = function (object) {
                    return undefined;
                };
                DemoLoadAndSaveInterceptor = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], DemoLoadAndSaveInterceptor);
                return DemoLoadAndSaveInterceptor;
            }(load_and_save_interceptor_1.LoadAndSaveInterceptor));
            exports_1("DemoLoadAndSaveInterceptor", DemoLoadAndSaveInterceptor);
        }
    }
});
