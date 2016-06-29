System.register(['@angular/core', '@angular/router-deprecated', '../../src/app/core-services/messages.component', '../../src/app/core-services/md', '../../src/app/core-services/messages'], function(exports_1, context_1) {
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
    var core_1, router_deprecated_1, messages_component_1, md_1, messages_1;
    var MessagesDemoComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_deprecated_1_1) {
                router_deprecated_1 = router_deprecated_1_1;
            },
            function (messages_component_1_1) {
                messages_component_1 = messages_component_1_1;
            },
            function (md_1_1) {
                md_1 = md_1_1;
            },
            function (messages_1_1) {
                messages_1 = messages_1_1;
            }],
        execute: function() {
            MessagesDemoComponent = (function () {
                function MessagesDemoComponent(md, messages) {
                    this.md = md;
                    this.messages = messages;
                    this.messageKeys = [];
                    this.messageKeys = Object.keys(md.msgs);
                }
                MessagesDemoComponent.prototype.showMessage = function (msgKey) {
                    this.messages.add(msgKey);
                };
                MessagesDemoComponent.prototype.clearMessages = function () {
                    this.messages.clear();
                };
                MessagesDemoComponent = __decorate([
                    core_1.Component({
                        selector: 'messages-demo',
                        templateUrl: 'demo/templates/messages-demo.html',
                        directives: [router_deprecated_1.ROUTER_DIRECTIVES, messages_component_1.MessagesComponent]
                    }), 
                    __metadata('design:paramtypes', [md_1.MD, messages_1.Messages])
                ], MessagesDemoComponent);
                return MessagesDemoComponent;
            }());
            exports_1("MessagesDemoComponent", MessagesDemoComponent);
        }
    }
});
//# sourceMappingURL=messages-demo.component.js.map