System.register(["@angular/core", "../m"], function(exports_1, context_1) {
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
    var core_1, m_1;
    var Messages;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (m_1_1) {
                m_1 = m_1_1;
            }],
        execute: function() {
            /**
             * Maintains a collection of currently active messages the
             * user can see at a given moment. Messages can be added
             * or removed based on identifiers.
             *
             * @author Jan G. Wieners
             * @author Daniel M. de Oliveira
             */
            Messages = (function () {
                function Messages(messagesDictionary) {
                    this.messagesDictionary = messagesDictionary;
                    this.messageMap = {};
                    /**
                     * Holds the collection to be delivered when calling {@link Messages#getMessages()}.
                     *
                     * Angular2 expects a non-changing
                     * object / array to generate the view.
                     * If getMessages() would convert the map "messages" every time to an array when it gets executed,
                     * Angular2 would fail with "Expression has changed after it was checked" exception.
                     */
                    this.messageList = [];
                }
                /**
                 * @param id used to identify the message. Must be an existing key.
                 *   If it is not, the the id param gets interpreted as a message content of an unkown
                 *   error condition with level 'danger'.
                 */
                Messages.prototype.add = function (id) {
                    var msg = this.messagesDictionary.msgs[id];
                    if (msg)
                        this.messageMap[id] = msg;
                    else {
                        this.messageMap[id] = {
                            content: id,
                            level: 'danger'
                        };
                    }
                };
                /**
                 * Removes all messages.
                 */
                Messages.prototype.clear = function () {
                    for (var p in this.messageMap)
                        delete this.messageMap[p];
                };
                /**
                 * Provides access to the messages data structure
                 * which can be used as an angular model since
                 * it is guaranteed that getMessages() returns always the
                 * same object.
                 *
                 * @returns {Array} reference to the list of current messages.
                 */
                Messages.prototype.getMessages = function () {
                    this.refreshMessageList();
                    return this.messageList;
                };
                /**
                 * Updates messageList on the basis of the current state of messages.
                 */
                Messages.prototype.refreshMessageList = function () {
                    this.messageList.length = 0;
                    for (var p in this.messageMap) {
                        this.messageList.push(this.messageMap[p]);
                    }
                };
                Messages = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [m_1.M])
                ], Messages);
                return Messages;
            }());
            exports_1("Messages", Messages);
        }
    }
});
//# sourceMappingURL=messages.js.map