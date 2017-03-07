import {Injectable} from "@angular/core";
import {Message} from "./message";
import {MD} from "./md";
import {MDInternal} from "./md-internal";

/**
 * Maintains a collection of currently active messages the
 * user can see at a given moment. Messages can be added
 * based on identifiers.
 *
 * @author Jan G. Wieners
 * @author Daniel M. de Oliveira
 * @author Thomas Kleinke
 */
@Injectable()
export class Messages {

    private internalMessagesDictionary = new MDInternal();
    
    constructor(private messagesDictionary: MD) {}

    private messageList: Message[] = [];

    /**
     * @param msgWithParams an array of strings and numbers
     *   msgWithParams[0] -> id. Used to identify the message. Must be an existing key.
     *   msgWithParams[1..n] -> params. Contains strings which will be inserted into the message content.
     *   Every occurrence of "{0}", "{1}", "{2}" etc. will be replaced with the param string at the corresponding
     *   array position: {0} will be replaced with params[0] etc.
     */
    public add(msgWithParams: Array<string>): void {

        if (!Array.isArray(msgWithParams)) throw "msgWithParams must be an array, but is "+msgWithParams;
        let errs = [];
        for (let i in msgWithParams) {
            if ((typeof msgWithParams[i])!='string' && (typeof msgWithParams[i])!='number') {
                if (!msgWithParams[i]) errs.push('undefined');
                else errs.push(msgWithParams[i]);
            }
        }
        if (errs.length > 0) {
            throw 'msgWithParams must be an array of strings, but found '+errs.join(',')
        }

        let id = msgWithParams[0];
        msgWithParams.splice(0, 1);

        let params = msgWithParams;
        let msg = this._get(id);
        if (!msg) throw 'No message found for key ' + id;
        this._add(msg,params);
    }

    private _get(id) : Message {

        let msg = this.internalMessagesDictionary.msgs[id];
        let providedMsg = this.messagesDictionary.msgs[id];
        if (providedMsg) msg = providedMsg;
        return msg;
    }

    private _add(msg, params?: Array<string>) {
        let messageToAdd = {
            content: msg.content,
            level: msg.level,
            params: params ? params.slice() : msg.params,
            hidden: false
        };

        if (messageToAdd.level != 'danger') {
            setTimeout(() => {
                messageToAdd.hidden = true;
            }, 2000);
        }
        this.messageList.push(messageToAdd);
    }
    
    /**
     * @param message to be removed
     */
    public removeMessage(message: Message) {

        let index:number = this.messageList.indexOf(message, 0);
        if (index > -1) {
            this.messageList.splice(index, 1);
        }
    }

    public hideMessage(message: Message) {
        message.hidden = true;
    }

    public setHidden(hidden: boolean) {
        this.messageList.forEach(function (msg) {
            msg.hidden = hidden;
        })
    }

    /**
     * Removes all messages.
     */
    public clear() {
        this.messageList.splice(0, this.messageList.length);
    }

    /**
     * @returns {Array} reference to the list of current messages.
     */
    public getMessages() : Message[] {
        return this.messageList;
    }
}
