import {Component} from '@angular/core';
import {Messages} from "./messages";
import {Message} from "./message";

/**
 * @author Jan G. Wieners
 * @author Thomas Kleinke
 */
@Component({
    selector: 'messages',
    template: `<ng-container *ngFor="let message of messages.getMessages().reverse(); let index=index">
        <div *ngIf="message.hidden==false || message.overrideHidden == true"
            id="message-{{index}}" style="text-align:right;">
            <div class="alert alert-{{message.level}}" style="display: inline-block;">
                <button *ngIf="message.level == 'danger' || message.level == 'warning'" type="button" class="close"
                        (click)="closeAlert(message)" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <span class="message-content">{{getMessageContent(message)}}</span>
            </div>
        </div>
    </ng-container>`
})

export class MessagesComponent {

    constructor(private messages: Messages) {}
    
    public getMessageContent(message: Message): string {
        let content = message.content;

        if (message.params) {
            for (let i in message.params) {
                content = content.replace("{" + i + "}", message.params[i]);
            }
        }

        return content;
    }

    public closeAlert(message: Message) {
        this.messages.hideMessage(message);
    }
}