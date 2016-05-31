System.register(['@angular/core', "./messages"], function(exports_1, context_1) {
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
    var core_1, messages_1;
    var MessagesComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (messages_1_1) {
                messages_1 = messages_1_1;
            }],
        execute: function() {
            /**
             * @author Jan G. Wieners
             */
            MessagesComponent = (function () {
                function MessagesComponent(messages) {
                    this.messages = messages;
                }
                MessagesComponent = __decorate([
                    core_1.Component({
                        selector: 'message',
                        template: "<div *ngFor=\"let message of messages.getMessages(); let index=index\"\n     class=\"alert alert-{{message.level}}\"\n     role=\"alert\"\n     id=\"message-{{index}}\">\n    {{message.content}}\n</div>"
                    }), 
                    __metadata('design:paramtypes', [messages_1.Messages])
                ], MessagesComponent);
                return MessagesComponent;
            }());
            exports_1("MessagesComponent", MessagesComponent);
        }
    }
});
//# sourceMappingURL=messages.component.js.map