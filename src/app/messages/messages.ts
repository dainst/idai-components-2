import {Injectable} from "@angular/core";
import {Message} from "./message";
import {MD} from "./md";
import {MDInternal} from "./md-internal";

@Injectable()
/**
 * Maintains a collection of currently active messages the
 * user can see at a given moment. Messages can be added
 * based on identifiers.
 *
 * @author Jan G. Wieners
 * @author Daniel M. de Oliveira
 * @author Thomas Kleinke
 */
export class Messages {

    private internalMessagesDictionary = new MDInternal();
    
    constructor(private messagesDictionary: MD,
                private timeout: any) {
    }

    private messageList: Message[] = [];

    /**
     * @param msgWithParams an array of strings and numbers
     *   msgWithParams[0] -> id. Used to identify the message. Must be an existing key.
     *   msgWithParams[1..n] -> params. Contains strings which will be inserted into the message content.
     *   Every occurrence of "{0}", "{1}", "{2}" etc. will be replaced with the param string at the corresponding
     *   array position: {0} will be replaced with params[0] etc.
     */
    public add(msgWithParams: Array<string>): void {

        if (!this.isArrayOfStrings(msgWithParams)) return;

        let id = msgWithParams[0];
        msgWithParams.splice(0, 1);

        let params = msgWithParams;
        let msg = this._get(id);
        if (!msg) this.addUnkownErr('no msg found for key of M with id: "'+id+'"');
        else this._add(msg,params);
    }

    /**
     * @returns {boolean} false and adds an unknown error if not, true otherwiese
     */
    private isArrayOfStrings(msgWithParams) {
        if (!Array.isArray(msgWithParams)) {
            this.addUnkownErr('msgWithParams must be an array, but is "'+msgWithParams+'"');
            return false;
        }
        let errs = [];
        for (let i in msgWithParams) {
            if ((typeof msgWithParams[i])!='string' && (typeof msgWithParams[i])!='number') {
                if (!msgWithParams[i]) errs.push('undefined');
                else errs.push(msgWithParams[i]);
            }
        }
        if (errs.length > 0) {
            this.addUnkownErr('msgWithParams must be an array of strings, but found "'+errs.join(',')+'"');
            return false;
        }
        return true;
    }

    private addUnkownErr(consoleError: string) {
        console.error(consoleError);
        this._add(this.internalMessagesDictionary.msgs[MDInternal.UNKOWN_ERROR],undefined);
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

        if (['warning', 'danger'].indexOf(messageToAdd.level) == -1) {
            if (this.timeout) {
                setTimeout(() => {
                    messageToAdd.hidden = true;
                }, this.timeout);
            }
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
