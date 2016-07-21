import {Component} from '@angular/core';
import {Messages} from "./messages";
import {Message} from "./message";

/**
 * @author Jan G. Wieners
 * @author Thomas Kleinke
 */
@Component({
    selector: 'message',
    template: `<div *ngFor="let message of messages.getMessages(); let index=index"
     class="alert alert-{{message.level}}"
     role="alert"
     id="message-{{index}}">
     <button type="button" class="close" (click)="closeAlert(message)" aria-label="Close">
        <span aria-hidden="true">&times;</span>
     </button>
    {{getMessageContent(message)}}
</div>`
})

export class MessagesComponent {

    constructor(private messages: Messages) {}
    
    public getMessageContent(message: Message): string {
        var content = message.content;

        if (message.params) {
            for (var i in message.params) {
                content = content.replace("{" + i + "}", message.params[i]);
            }
        }
        
        return content;
    }

    public closeAlert(message: Message) {
        this.messages.removeMessage(message)
    }
}