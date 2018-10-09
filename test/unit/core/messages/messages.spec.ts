import {Messages} from '../../../../src/messages/messages';
import {MDInternal} from '../../../../src/messages/md-internal';

/**
 * @author Daniel de Oliveira
 * @author Jan G. Wieners
 * @author Thomas Kleinke
 */

let messagesDictionary = {
    msgs: {
        'key1' : {
            content: 'content1',
            level: 'danger',
            params: [],
            hidden: false
        },
        'key2' : {
            content: 'content2',
            level: 'danger',
            params: [],
            hidden: false
        }
    }
};

let messages: Messages;


const verifyUnknownError = (consoleError) => {

    expect(messages.getActiveMessages()[1].content).toEqual(
        (new MDInternal().msgs[MDInternal.MESSAGES_UNKNOWN_ERROR]).content
    );
    expect(console.error).toHaveBeenCalledWith(consoleError);
};


beforeEach(() => {

    spyOn(console, 'error');
    messages = new Messages(messagesDictionary, 100);
    messages.add(['key1']);
});


describe('Messages', () => {

    it('should store, retrieve and delete a message', () => {

        expect(messages.getActiveMessages()[0]).toEqual(messagesDictionary.msgs['key1']);
        messages.removeAllMessages();
        expect(messages.getActiveMessages()[0]).toBe(undefined);
    });


    it('should add message with same identifier twice', () => {

        messages.add(['key1']);
        expect(messages.getActiveMessages()[0]).toEqual(messagesDictionary.msgs['key1']);
        expect(messages.getActiveMessages().length).toBe(2);
    });


    it('should add two messages with different identifiers', () => {

        messages.add(['key2']);
        expect(messages.getActiveMessages()[0]).toEqual(messagesDictionary.msgs['key1']);
        expect(messages.getActiveMessages()[1]).toEqual(messagesDictionary.msgs['key2']);
        expect(messages.getActiveMessages().length).toBe(2);
    });


    it('should return always the same instance', () => {

        expect(messages.getActiveMessages() === messages.getActiveMessages()).toBeTruthy();
    });


    it('should clear all messages', () => {

        messages.removeAllMessages();
        expect(messages.getActiveMessages().length).toBe(0);
    });


    it('should show a msg from the internal message dictionary', () => {

        messages.add([MDInternal.PROJECT_CONFIGURATION_GENERIC_ERROR]);
        expect(messages.getActiveMessages()[1]).toEqual((new MDInternal()).msgs[MDInternal.PROJECT_CONFIGURATION_GENERIC_ERROR]);
    });


    it('should override a msg from the internal message dictionary with the provided one', () => {

        messagesDictionary.msgs[MDInternal.PROJECT_CONFIGURATION_GENERIC_ERROR]={
            content: 'test',
            level: 'danger',
            params: [],
            hidden: false
        };
        messages.add([MDInternal.PROJECT_CONFIGURATION_GENERIC_ERROR]);
        expect(messages.getActiveMessages()[1]).toEqual(messagesDictionary.msgs[MDInternal.PROJECT_CONFIGURATION_GENERIC_ERROR]);
    });

    it('should add a message with parameters', () => {

        let params = ['param1','param2'];
        messages.add(['key2'].concat(params));
        expect(messages.getActiveMessages()[1].params).toEqual(params);
    });


    it('should throw an error if adding a message with parameters but id not found', () => {

        messages.add(['nonexisting']);
        verifyUnknownError('no msg found for key of M with id: "nonexisting"');
    });


    it('should throw an error if array is empty', () => {

        messages.add([]);
        verifyUnknownError('no msg found for key of M with id: "undefined"');
    });
});
