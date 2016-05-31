System.register(['@angular/core/testing', "../ts/core-services/messages", "../ts/md"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, messages_1, md_1;
    /**
     * @author Daniel M. de Oliveira
     * @author Jan G. Wieners
     */
    function main() {
        testing_1.describe('Messages', function () {
            var messagesDictionary;
            var messages;
            testing_1.beforeEach(function () {
                messagesDictionary = new md_1.MD();
                messages = new messages_1.Messages(messagesDictionary);
                messages.add(md_1.MD.OBJLIST_IDEXISTS);
            });
            testing_1.it('should store, retrieve and delete a message', function () {
                testing_1.expect(messages.getMessages()[0]).toBe(messagesDictionary.msgs[md_1.MD.OBJLIST_IDEXISTS]);
                messages.clear();
                testing_1.expect(messages.getMessages()[0]).toBe(undefined);
            });
            testing_1.it('add two messages with the same identifier', function () {
                messages.add(md_1.MD.OBJLIST_IDEXISTS);
                testing_1.expect(messages.getMessages()[0]).toBe(messagesDictionary.msgs[md_1.MD.OBJLIST_IDEXISTS]);
                testing_1.expect(messages.getMessages().length).toBe(1);
            });
            testing_1.it('add two messages with different identifiers', function () {
                messages.add(md_1.MD.MESSAGES_NOBODY);
                testing_1.expect(messages.getMessages()[0]).toBe(messagesDictionary.msgs[md_1.MD.OBJLIST_IDEXISTS]);
                testing_1.expect(messages.getMessages()[1]).toBe(messagesDictionary.msgs[md_1.MD.MESSAGES_NOBODY]);
                testing_1.expect(messages.getMessages().length).toBe(2);
            });
            testing_1.it('will add a non existing message', function () {
                messages.add("notexisting");
                testing_1.expect(messages.getMessages()[1].content).toBe('notexisting');
                testing_1.expect(messages.getMessages()[1].level).toBe('danger');
            });
            testing_1.it('will return always the same instance', function () {
                testing_1.expect(messages.getMessages() == messages.getMessages()).toBeTruthy();
            });
            testing_1.it('will clear all messages', function () {
                messages.clear();
                testing_1.expect(messages.getMessages().length).toBe(0);
            });
        });
    }
    exports_1("main", main);
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (messages_1_1) {
                messages_1 = messages_1_1;
            },
            function (md_1_1) {
                md_1 = md_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=messages.spec.js.map