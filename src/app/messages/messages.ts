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
    
    constructor(private messagesDictionary:MD){}

    private messageList : Message[] = [];

    /**
     * @param id used to identify the message. Must be an existing key.
     *   If it is not, the id param gets interpreted as a message content of an unknown
     *   error condition with level 'danger'.
     */   
    public add(id: string): void {
        var msg = this._get(id);
        if (!msg) msg = {content: id, level: 'danger', params: []};
        this._add(msg,undefined);
    }
    
    /**
     * @param msgWithParams
     *   msgWithParams[0] -> id. Used to identify the message. Must be an existing key.
     *   msgWithParams[1..n] -> params. Contains strings which will be inserted into the message content.
     *   Every occurrence of "{0}", "{1}", "{2}" etc. will be replaced with the param string at the corresponding
     *   array position: {0} will be replaced with params[0] etc.
     */
    public addWithParams(msgWithParams: Array<string>): void {
        var id = msgWithParams[0];
        msgWithParams.splice(0,1);
        var params = msgWithParams;
        var msg = this._get(id);
        if (!msg) throw 'No message found for key '+id;
        this._add(msg,params);
    }

    private _get(id) : Message {
        var msg = this.internalMessagesDictionary.msgs[id];
        var providedMsg = this.messagesDictionary.msgs[id];
        if (providedMsg) msg = providedMsg;
        return msg;
    }

    private _add(msg,params?:Array<string>) {
        
        var isNew = true;
        this.messageList.forEach(function (message) {
            if (message.content == msg.content) {
                isNew = false;
            }
        });
        if (isNew) {
            this.messageList.push({
                content: msg.content,
                level: msg.level,
                params: params ? params.slice() : msg.params
            });
        }
    }
    
    /**
     * @param message to be removed
     */
    public removeMessage(message: Message) {
        var index:number = this.messageList.indexOf(message, 0);
        if (index > -1) {
            this.messageList.splice(index, 1);
        }
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
