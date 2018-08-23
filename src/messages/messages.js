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
var md_1 = require("./md");
var md_internal_1 = require("./md-internal");
var Messages = (function () {
    function Messages(messagesDictionary, timeout) {
        this.messagesDictionary = messagesDictionary;
        this.timeout = timeout;
        this.internalMessagesDictionary = new md_internal_1.MDInternal();
        this.activeMessages = [];
    }
    Messages_1 = Messages;
    /**
     * @param msgWithParams an array of strings and numbers
     *   msgWithParams[0] -> key. Used to identify the message. Must be an existing key.
     *   msgWithParams[1..n] -> params. Contains strings which will be inserted into the message content.
     *   Every occurrence of "{0}", "{1}", "{2}" etc. will be replaced with the param string at the corresponding
     *   array position: {0} will be replaced with params[0] etc.
     */
    Messages.prototype.add = function (msgWithParams) {
        if (msgWithParams.length == 0) {
            return this.addUnknownErr('no msg found for key of M with id: "undefined"');
        }
        var key = msgWithParams[0];
        msgWithParams.splice(0, 1);
        var template = this.fetchTemplate(key);
        if (!template) {
            this.addUnknownErr('no msg found for key of M with id: "' + key + '"');
        }
        else {
            var message = Messages_1.buildFromTemplate(template, msgWithParams);
            this.startTimeout(message);
            this.activeMessages.push(message);
        }
    };
    Messages.prototype.removeMessage = function (message) {
        var index = this.activeMessages.indexOf(message, 0);
        if (index > -1) {
            this.activeMessages.splice(index, 1);
        }
    };
    Messages.prototype.removeAllMessages = function () {
        this.activeMessages.splice(0, this.activeMessages.length);
    };
    Messages.prototype.hideMessage = function (message) {
        message.hidden = true;
    };
    Messages.prototype.setHiddenForAll = function (hidden) {
        this.activeMessages.forEach(function (message) { return message.hidden = hidden; });
    };
    Messages.prototype.getActiveMessages = function () {
        return this.activeMessages;
    };
    Messages.prototype.addUnknownErr = function (consoleError) {
        console.error(consoleError);
        var message = Messages_1.buildFromTemplate(this.internalMessagesDictionary.msgs[md_internal_1.MDInternal.UNKOWN_ERROR], undefined);
        this.startTimeout(message);
        this.activeMessages.push(message);
    };
    Messages.prototype.fetchTemplate = function (key) {
        var message = this.internalMessagesDictionary.msgs[key];
        var providedMessage = this.messagesDictionary.msgs[key];
        if (providedMessage)
            message = providedMessage;
        return message;
    };
    Messages.prototype.startTimeout = function (message) {
        if (this.shouldSetTimeout(message)) {
            setTimeout(function () { return message.hidden = true; }, this.timeout);
        }
    };
    Messages.prototype.shouldSetTimeout = function (message) {
        return Messages_1.TIMEOUT_TYPES.includes(message.level) && this.timeout > 0;
    };
    Messages.buildFromTemplate = function (template, params) {
        return {
            content: template.content,
            level: template.level,
            params: params ? params.slice() : template.params,
            hidden: false
        };
    };
    // Messages of these types fade away after the given timeout.
    Messages.TIMEOUT_TYPES = ['success', 'info'];
    Messages = Messages_1 = __decorate([
        core_1.Injectable()
        /**
         * Maintains a collection of currently active messages the
         * user can see at a given moment. Message content is defined
         * by message dictionary keys.
         *
         * @author Jan G. Wieners
         * @author Daniel M. de Oliveira
         * @author Thomas Kleinke
         */
        ,
        __metadata("design:paramtypes", [md_1.MD, Number])
    ], Messages);
    return Messages;
    var Messages_1;
}());
exports.Messages = Messages;
//# sourceMappingURL=messages.js.map