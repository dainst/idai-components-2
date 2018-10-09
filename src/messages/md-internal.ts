import {Injectable} from '@angular/core';
import {Message} from './message'
import {MD} from './md'

/**
 * A message dictionary with messages for
 * native library functionality.
 *
 * @author Daniel de Oliveira
 */
@Injectable()
export class MDInternal extends MD {

    public static UNKOWN_ERROR: string = 'unknown-error';

    public static MESSAGES_NOBODY: string = 'messages/nobody';
    public static PC_GENERIC_ERROR: string = 'pmc/generic';

    public static PARSE_ERROR_INVALID_JSON: string = 'parse/error/invalidjson';

    public static PERSISTENCE_ERROR_TARGETNOTFOUND: string = 'persistence/error/targetnotfound';

    public msgs: { [id: string]: Message } = {};

    constructor() {
        super();
        this.msgs[MDInternal.UNKOWN_ERROR]={
            content: 'Ein unbekannter Fehler ist aufgetreten. Details können in der Developer Console eingesehen werden.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.MESSAGES_NOBODY]={
            content: 'Keine Message gefunden für Schlüssel \'id\'.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.PC_GENERIC_ERROR]={
            content: 'Fehler beim Auswerten eines Konfigurationsobjektes.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.PARSE_ERROR_INVALID_JSON]={
            content: 'Fehler beim Parsen der Konfigurationsdatei \'[0]\': Das JSON ist nicht valide.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.PERSISTENCE_ERROR_TARGETNOTFOUND]={
            content: 'Die Ressource wurde erfolgreich gespeichert. Relationen wurden aufgrund fehlender Zielressourcen '
                + 'nicht aktualisiert.',
            level: 'warning',
            params: [],
            hidden: false
        };
    }
}