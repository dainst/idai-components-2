import {Messages} from "../../../src/app/messages/messages";
import {MDInternal} from "../../../src/app/messages/md-internal";

/**
 * @author Daniel de Oliveira
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
                    params: new Array(),
                    hidden: false
                },
                "key2" : {
                    content: 'content2',
                    level: 'danger',
                    params: new Array(),
                    hidden: false
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

        it('should add message with same identifier twice',
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
                    params: new Array(),
                    hidden: false
                };
                messages.add(MDInternal.MESSAGES_NOBODY);
                expect(messages.getMessages()[1]).toEqual(messagesDictionary.msgs[MDInternal.MESSAGES_NOBODY]);
            }
        );

        it('should add a message with parameters',
            function(){
                var params = ['param1','param2'];
                messages.addWithParams(['key2'].concat(params));
                expect(messages.getMessages()[1].params).toEqual(params);
            }
        );

        it('should throw an error if adding a message with parameters but id not found',
            function(){
                expect(function(){
                    messages.addWithParams(['nonexisting']);
                }).toThrow();
            }
        );

        it('should throw an error if adding anything else than an array',
            function(){
                expect(function(){
                    messages.addWithParams(undefined);
                }).toThrow("msgWithParams must be an array, but is undefined");
            }
        );

        it('should throw an error if any part of the array is not a string',
            function(){
                expect(function(){
                    messages.addWithParams([undefined,undefined]);
                }).toThrow('msgWithParams must be an array of strings, but found undefined,undefined');
            }
        );

        it('should throw an error if array is empty',
            function(){
                expect(function(){
                    messages.addWithParams([]);
                }).toThrow();
            }
        );

        it('should throw an error if array is undefined',
            function(){
                expect(function(){
                    messages.addWithParams();
                }).toThrow();
            }
        );
    })
}