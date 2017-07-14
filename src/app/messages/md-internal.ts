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
    public static PARSE_GENERIC_ERROR : string = 'parse/generic';

    public static VALIDATION_ERROR_MISSINGPROPERTY: string = 'validation/error/missingproperty';
    public static VALIDATION_ERROR_MISSINGPARENTTYPE: string = 'validation/error/missingparenttype';
    public static VALIDATION_ERROR_MISSINGVIEWTYPE: string = 'validation/error/missingviewtype';
    public static VALIDATION_ERROR_MISSINGRELATIONTYPE: string = 'validation/error/missingrelationtype';
    public static VALIDATION_ERROR_INVALIDTYPE: string = 'validation/error/invalidtype';
    public static VALIDATION_ERROR_INVALIDFIELD: string = 'validation/error/invalidfield';
    public static VALIDATION_ERROR_INVALIDFIELDS: string = 'validation/error/invalidfields';
    
    public static VALIDATION_ERROR_MISSINGTYPE: string = 'validation/error/missingtype';
    public static VALIDATION_ERROR_DUPLICATETYPE: string = 'validation/error/duplicatetype';

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
        this.msgs[MDInternal.PARSE_GENERIC_ERROR]={
            content: 'Fehler beim Parsen der Konfigurationsdatei \'{0}\' (mehr Informationen in der Konsole).',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.VALIDATION_ERROR_INVALIDTYPE]={
            content: 'Ungültige Typdefinition: \'{0}\'',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.VALIDATION_ERROR_INVALIDFIELD]={
            content: 'Fehlende Felddefinition für das Feld \'{1}\' der Ressource vom Typ \'{0}\'.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.VALIDATION_ERROR_INVALIDFIELDS]={
            content: 'Fehlende Felddefinitionen für die Felder \'{1}\' der Ressource vom Typ \'{0}\'.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.VALIDATION_ERROR_MISSINGPROPERTY]={
            content: 'Eigenschaft(en) der Ressource vom Typ \'{0}\' müssen vorhanden sein: \'{1}\'.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.VALIDATION_ERROR_MISSINGTYPE]={
            content: 'Die Configuration.json benötigt eine Definition für den Typ \'{0}\'.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.VALIDATION_ERROR_MISSINGPARENTTYPE]={
            content: 'In der Configuration.json wird auf den nicht definierten Parent-Typ \'{0}\' verwiesen.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.VALIDATION_ERROR_MISSINGVIEWTYPE]={
            content: 'Im View-Teil der Configuration.json wird auf den nicht definierten Typ \'{0}\' verwiesen.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.VALIDATION_ERROR_MISSINGRELATIONTYPE]={
            content: 'Im Relation-Teil der Configuration.json wird auf den nicht definierten Typ \'{0}\' verwiesen.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.VALIDATION_ERROR_DUPLICATETYPE]={
            content: 'Die Configuration.json enthält eine Mehrfachdefinition für den Typ \'{0}\'.',
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