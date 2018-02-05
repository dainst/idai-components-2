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
    public add(msgWithParams: Array<string>): void {

        if (!this.isArrayOfStrings(msgWithParams)) return;

        const id = msgWithParams[0];
        msgWithParams.splice(0, 1);

        const params = msgWithParams;
        const msg = this._get(id);
        if (!msg) {
            this.addUnknownErr('no msg found for key of M with id: "' + id + '"');
        } else {
            this._add(msg, params);
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


    // TODO Move method to util class

    /**
     * @returns {boolean} false and adds an unknown error if not, true otherwise
     */
    private isArrayOfStrings(msgWithParams: any): boolean {

        if (!Array.isArray(msgWithParams)) {
            this.addUnknownErr('msgWithParams must be an array, but is "' + msgWithParams + '"');
            return false;
        }

        const errs: string[] = [];

        for (let i in msgWithParams) {
            if ((typeof msgWithParams[i]) != 'string' && (typeof msgWithParams[i]) != 'number') {
                if (!msgWithParams[i]) errs.push('undefined' as never);
                else errs.push(msgWithParams[i] as never);
            }
        }

        if (errs.length > 0) {
            // TODO remove from this method
            this.addUnknownErr('msgWithParams must be an array of strings, but found "'
                + errs.join(',') + '"');
            return false;
        }

        return true;
    }

    
    private addUnknownErr(consoleError: string) {
        
        console.error(consoleError);
        this._add(this.internalMessagesDictionary.msgs[MDInternal.UNKOWN_ERROR], undefined);
    }
    

    private _get(key: string): Message {

        let message: Message = this.internalMessagesDictionary.msgs[key];
        const providedMsg = this.messagesDictionary.msgs[key];
        if (providedMsg) message = providedMsg;

        return message;
    }

    
    private _add(message: Message, params?: Array<string>) {
        
        const messageToAdd = {
            content: message.content,
            level: message.level,
            params: params ? params.slice() : message.params,
            hidden: false
        };

        if (Messages.shouldSetTimeout(messageToAdd)) {
            setTimeout(() => messageToAdd.hidden = true, this.timeout);
        }
        this.activeMessages.push(messageToAdd);
    }


    private static shouldSetTimeout(message: Message): boolean {

        //return (message.level) in Messages.TIMEOUT_TYPES;
        return Messages.TIMEOUT_TYPES.includes(message.level);
    }
}
