import {Injectable} from "@angular/core";
import {Message} from "./message";
import {MD} from "./md";

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

    constructor(private messagesDictionary:MD){ }

    private messageList : Message[] = [];

    /**
     * @param id used to identify the message. Must be an existing key.
     *   If it is not, the id param gets interpreted as a message content of an unknown
     *   error condition with level 'danger'.
     * @param params (optional) contains strings which will be inserted into the message content.
     *   Every occurrence of "{0}", "{1}", "{2}" etc. will be replaced with the param string at the corresponding
     *   array position: {0} will be replaced with params[0] etc.
     */
    public add(id: string, params?: Array<string>): void {

        var msg = this.messagesDictionary.msgs[id];

        if (!msg) msg = { content: id, level: 'danger', params: [] };

        this.messageList.push({
            content: msg.content,
            level: msg.level,
            params: params ? params.slice() : msg.params
        });
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
