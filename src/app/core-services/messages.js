System.register(["@angular/core", "./md"], function(exports_1, context_1) {
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
    var core_1, md_1;
    var Messages;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (md_1_1) {
                md_1 = md_1_1;
            }],
        execute: function() {
            /**
             * Maintains a collection of currently active messages the
             * user can see at a given moment. Messages can be added
             * based on identifiers.
             *
             * @author Jan G. Wieners
             * @author Daniel M. de Oliveira
             * @author Thomas Kleinke
             */
            Messages = (function () {
                function Messages(messagesDictionary) {
                    this.messagesDictionary = messagesDictionary;
                    this.messageList = [];
                }
                /**
                 * @param id used to identify the message. Must be an existing key.
                 *   If it is not, the id param gets interpreted as a message content of an unknown
                 *   error condition with level 'danger'.
                 * @param params (optional) contains strings which will be inserted into the message content.
                 *   Every occurrence of "{0}", "{1}", "{2}" etc. will be replaced with the param string at the corresponding
                 *   array position: {0} will be replaced with params[0] etc.
                 */
                Messages.prototype.add = function (id, params) {
                    var msg = this.messagesDictionary.msgs[id];
                    if (!msg)
                        msg = { content: id, level: 'danger', params: [] };
                    this.messageList.push({
                        content: msg.content,
                        level: msg.level,
                        params: params ? params.slice() : msg.params
                    });
                };
                /**
                 * Removes all messages.
                 */
                Messages.prototype.clear = function () {
                    this.messageList.splice(0, this.messageList.length);
                };
                /**
                 * @returns {Array} reference to the list of current messages.
                 */
                Messages.prototype.getMessages = function () {
                    return this.messageList;
                };
                Messages = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [md_1.MD])
                ], Messages);
                return Messages;
            }());
            exports_1("Messages", Messages);
        }
    }
});
//# sourceMappingURL=messages.js.map