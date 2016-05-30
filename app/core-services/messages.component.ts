import {Component, Input} from '@angular/core';
import {Messages} from "./messages";

/**
 * @author Jan G. Wieners
 */
@Component({
    selector: 'message',
    template: `<div *ngFor="let message of messages.getMessages(); let index=index"
     class="alert alert-{{message.level}}"
     role="alert"
     id="message-{{index}}">
    {{message.content}}
</div>`
})

export class MessagesComponent {

    constructor(private messages: Messages) {}
}