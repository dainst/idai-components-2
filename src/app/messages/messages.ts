import {Injectable} from '@angular/core';
import {Message} from './message';
import {MD} from './md';
import {MDInternal} from './md-internal';

@Injectable()
/**
 * Maintains a collection of currently active messages the
 * user can see at a given moment. Message content is defined
 * by message dictionary keys.
 *
 * @author Jan G. Wieners
 * @author Daniel M. de Oliveira
 * @author Thomas Kleinke
 */
export class Messages {

    private internalMessagesDictionary = new MDInternal();

    private activeMessages: Message[] = [];

    // Messages of these types fade away after the given timeout.
    private static TIMEOUT_TYPES: string[] = ['success', 'info'];

    
    constructor(private messagesDictionary: MD,
                private timeout: number) {
    }
    

    /**
     * @param msgWithParams an array of strings and numbers
     *   msgWithParams[0] -> key. Used to identify the message. Must be an existing key.
     *   msgWithParams[1..n] -> params. Contains strings which will be inserted into the message content.
     *   Every occurrence of "{0}", "{1}", "{2}" etc. will be replaced with the param string at the corresponding
     *   array position: {0} will be replaced with params[0] etc.
     */
    public add(msgWithParams: Array<string>) {

        if (msgWithParams.length == 0) {
            this.addUnknownErr('no msg found for key of M with id: "undefined"');
            return;
        }

        const key: string = msgWithParams[0];
        msgWithParams.splice(0, 1);

        const params = msgWithParams;
        const template: Message = this.fetchTemplate(key);
        if (!template) {
            this.addUnknownErr('no msg found for key of M with id: "' + key + '"');
        } else {
            const message: Message = Messages.buildFromTemplate(template, params);
            this.startTimeout(message);
            this.activeMessages.push(message);
        }
    }


    public removeMessage(message: Message) {

        const index: number = this.activeMessages.indexOf(message, 0);
        if (index > -1) {
            this.activeMessages.splice(index, 1);
        }
    }


    public removeAllMessages() {

        this.activeMessages.splice(0, this.activeMessages.length);
    }


    public hideMessage(message: Message) {

        message.hidden = true;
    }


    public setHiddenForAll(hidden: boolean) {

        this.activeMessages.forEach(message => message.hidden = hidden);
    }


    public getActiveMessages(): Message[] {

        return this.activeMessages;
    }

    
    private addUnknownErr(consoleError: string) {
        
        console.error(consoleError);
        const message = Messages.buildFromTemplate(this.internalMessagesDictionary.msgs[MDInternal.UNKOWN_ERROR],
            undefined);
        this.startTimeout(message);
        this.activeMessages.push(message);
    }
    

    private fetchTemplate(key: string): Message {

        let message: Message = this.internalMessagesDictionary.msgs[key];
        const providedMessage = this.messagesDictionary.msgs[key];
        if (providedMessage) message = providedMessage;

        return message;
    }


    private startTimeout(message: Message) {

        if (Messages.shouldSetTimeout(message)) {
            setTimeout(() => message.hidden = true, this.timeout);
        }
    }


    private static shouldSetTimeout(message: Message): boolean {

        return Messages.TIMEOUT_TYPES.includes(message.level);
    }


    private static buildFromTemplate(template: Message, params?: Array<string>): Message {

        return {
            content: template.content,
            level: template.level,
            params: params ? params.slice() : template.params,
            hidden: false
        };
    }
}
