import {fdescribe,describe,xdescribe,expect,fit,it,xit, inject,beforeEach, beforeEachProviders} from '@angular/core/testing';
import {Messages} from "../app/core-services/messages";
import {MD} from "../app/core-services/md";

/**
 * @author Daniel M. de Oliveira
 * @author Jan G. Wieners
 * @author Thomas Kleinke
 */
export function main() {
    describe('Messages', () => {

        var messagesDictionary : MD;
        var messages : Messages;

        beforeEach(
            function(){
                messagesDictionary = new MD();
                messages = new Messages(messagesDictionary);
                messages.add(MD.OBJLIST_IDEXISTS);
            });

        it('should store, retrieve and delete a message',
            function(){
                expect(messages.getMessages()[0]).toEqual(messagesDictionary.msgs[MD.OBJLIST_IDEXISTS]);
                messages.clear();
                expect(messages.getMessages()[0]).toBe(undefined);
            }
        );

        it('should add two messages with the same identifier',
            function(){
                messages.add(MD.OBJLIST_IDEXISTS);
                expect(messages.getMessages()[0]).toEqual(messagesDictionary.msgs[MD.OBJLIST_IDEXISTS]);
                expect(messages.getMessages().length).toBe(2);
            }
        );

        it('should add two messages with different identifiers',
            function(){
                messages.add(MD.MESSAGES_NOBODY);
                expect(messages.getMessages()[0]).toEqual(messagesDictionary.msgs[MD.OBJLIST_IDEXISTS]);
                expect(messages.getMessages()[1]).toEqual(messagesDictionary.msgs[MD.MESSAGES_NOBODY]);
                expect(messages.getMessages().length).toBe(2);
            }
        );

        it('should add a message with parameters',
            function(){
                var params = ["param1", "param2"];
                messages.add(MD.MESSAGES_NOBODY, params);
                expect(messages.getMessages()[1].params).toEqual(params);
            }
        );

        it('should add a non existing message',
            function(){
                messages.add("notexisting");
                expect(messages.getMessages()[1].content).toBe('notexisting');
                expect(messages.getMessages()[1].level).toBe('danger');
            }
        );

        it('should return always the same instance',
            function(){
                expect(messages.getMessages()==messages.getMessages()).toBeTruthy();
            }
        );

        it('should clear all messages',
            function(){
                messages.clear();
                expect(messages.getMessages().length).toBe(0);
            }
        );
    })
}