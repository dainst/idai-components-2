import {fdescribe,describe,xdescribe,expect,fit,it,xit, inject,beforeEach, beforeEachProviders} from '@angular/core/testing';
import {Messages} from "../app/core-services/messages";
import {MDInternal} from "../app/core-services/md-internal";

/**
 * @author Daniel M. de Oliveira
 * @author Jan G. Wieners
 * @author Thomas Kleinke
 */
export function main() {
    describe('Messages', () => {

        var messagesDictionary = {
            msgs: {
                "key1" : {
                    content: 'content1',
                    level: 'danger',
                    params: new Array()
                },
                "key2" : {
                    content: 'content2',
                    level: 'danger',
                    params: new Array()
                }
            }
        };

        var messages;

        beforeEach(
            function(){
                messages = new Messages(messagesDictionary);
                messages.add("key1");
            }
        );

        it('should store, retrieve and delete a message',
            function(){
                expect(messages.getMessages()[0]).toEqual(messagesDictionary.msgs["key1"]);
                messages.clear();
                expect(messages.getMessages()[0]).toBe(undefined);
            }
        );

        it('should add two messages with the same identifier',
            function(){
                messages.add("key1");
                expect(messages.getMessages()[0]).toEqual(messagesDictionary.msgs["key1"]);
                expect(messages.getMessages().length).toBe(2);
            }
        );

        it('should add two messages with different identifiers',
            function(){
                messages.add("key2");
                expect(messages.getMessages()[0]).toEqual(messagesDictionary.msgs["key1"]);
                expect(messages.getMessages()[1]).toEqual(messagesDictionary.msgs["key2"]);
                expect(messages.getMessages().length).toBe(2);
            }
        );

        it('should add a message with parameters',
            function(){
                var params = ["param1", "param2"];
                messages.add("key2", params);
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

        it('should show a msg from the internal message dictionary',
            function(){
                messages.add(MDInternal.MESSAGES_NOBODY);
                expect(messages.getMessages()[1]).toEqual((new MDInternal()).msgs[MDInternal.MESSAGES_NOBODY]);
            }
        );

        it('should override a msg from the internal message dictionary with the provided one',
            function(){
                messagesDictionary.msgs[MDInternal.MESSAGES_NOBODY]={
                    content: 'test',
                    level: 'danger',
                    params: new Array()
                };
                messages.add(MDInternal.MESSAGES_NOBODY);
                expect(messages.getMessages()[1]).toEqual(messagesDictionary.msgs[MDInternal.MESSAGES_NOBODY]);
            }
        );
    })
}