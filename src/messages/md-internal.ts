import {Injectable} from '@angular/core';
import {Message} from './message'
import {MD} from './md'

/**
 * A message dictionary with messages for native library functionality.
 *
 * @author Daniel de Oliveira
 */
@Injectable()
export class MDInternal extends MD {

    public static UNKOWN_ERROR: string = 'unknown-error';
    public static PC_GENERIC_ERROR: string = 'pmc/generic';
    public static PARSE_ERROR_INVALID_JSON: string = 'parse/error/invalidjson';

    public msgs: { [id: string]: Message } = {};

    constructor() {
        super();
        this.msgs[MDInternal.UNKOWN_ERROR] = {
            content: 'Ein unbekannter Fehler ist aufgetreten. Details können in der Developer Console eingesehen werden.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.PC_GENERIC_ERROR] = {
            content: 'Fehler beim Auswerten eines Konfigurationsobjektes.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.PARSE_ERROR_INVALID_JSON] = {
            content: 'Fehler beim Parsen der Konfigurationsdatei \'[0]\': Das JSON ist nicht valide.',
            level: 'danger',
            params: [],
            hidden: false
        };
    }
}