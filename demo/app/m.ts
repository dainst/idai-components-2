import {Injectable} from "@angular/core";
import {Message} from "../../src/app/core-services/message"
import {MD} from "../../src/app/core-services/md"

@Injectable()
export class M extends MD{

    public msgs : { [id: string]: Message } = {};

    constructor() {
        super();
        this.msgs['success_msg']={
            content: 'Erfolg.',
            level: 'success',
            params: []
        };
        this.msgs['danger_msg']={
            content: 'Schwerwiegender Fehler!',
            level: 'danger',
            params: []
        };
        this.msgs['with_params']={
            content: "Hier ist ein Parameter: {0}",
            level: 'success',
            params: [ "Standardwert" ]
        };
    }
}