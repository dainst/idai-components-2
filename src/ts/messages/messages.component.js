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
var messages_1 = require("./messages");
/**
 * @author Jan G. Wieners
 * @author Thomas Kleinke
 */
var MessagesComponent = (function () {
    function MessagesComponent(messages) {
        this.messages = messages;
        this.alwaysShowClose = false;
    }
    MessagesComponent.prototype.getMessageContent = function (message) {
        var content = message.content;
        if (message.params) {
            for (var i in message.params) {
                content = content.replace('{' + i + '}', message.params[i]);
            }
        }
        return content;
    };
    MessagesComponent.prototype.closeAlert = function (message) {
        this.messages.hideMessage(message);
    };
    return MessagesComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], MessagesComponent.prototype, "alwaysShowClose", void 0);
MessagesComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'messages',
        templateUrl: './messages.html'
    }),
    __metadata("design:paramtypes", [messages_1.Messages])
], MessagesComponent);
exports.MessagesComponent = MessagesComponent;
//# sourceMappingURL=messages.component.js.map