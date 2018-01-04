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

    public static VALIDATION_ERROR_MISSINGPROPERTY: string = 'validation/error/missingproperty';
    public static VALIDATION_ERROR_MISSINGVIEWTYPE: string = 'validation/error/missingviewtype';
    public static VALIDATION_ERROR_NONOPERATIONVIEWTYPE: string = 'validation/error/nonoperationviewtype';
    public static VALIDATION_ERROR_TOPLEVELTYPEHASPARENT: string = 'validation/error/topleveltypehasparent';
    public static VALIDATION_ERROR_INCOMPLETERECORDEDIN: string = 'validation/error/incompleterecordedin';
    public static VALIDATION_ERROR_NOPROJECTRECORDEDIN: string = 'validation/error/noprojectrecordedin';
    public static VALIDATION_ERROR_INVALIDINPUTTYPE: string = 'validation/error/invalidinputtype';
    public static VALIDATION_ERROR_INVALIDTYPE: string = 'validation/error/invalidtype';
    public static VALIDATION_ERROR_INVALIDFIELD: string = 'validation/error/invalidfield';
    public static VALIDATION_ERROR_INVALIDFIELDS: string = 'validation/error/invalidfields';
    public static VALIDATION_ERROR_INVALIDRELATIONFIELD: string = 'validation/error/invalidrelationfield';
    public static VALIDATION_ERROR_INVALIDRELATIONFIELDS: string = 'validation/error/invalidrelationfields';
    public static VALIDATION_ERROR_INVALID_NUMERIC_VALUE: string = 'validation/error/invalidnumericvalue';
    public static VALIDATION_ERROR_INVALID_NUMERIC_VALUES: string = 'validation/error/invalidnumericvalues';

    public static PERSISTENCE_ERROR_TARGETNOTFOUND: string = 'persistence/error/targetnotfound';

    public msgs: { [id: string]: Message } = {};

    constructor() {
        super();
        this.msgs[MDInternal.VALIDATION_ERROR_INVALIDTYPE]={
            content: 'Ungültige Typdefinition: \'{0}\'',
            level: 'danger',
            params: [],
            hidden: false
        };
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
            content: 'Fehler beim Parsen der Konfigurationsdatei \'{0}\': Das JSON ist nicht valide.',
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
        this.msgs[MDInternal.VALIDATION_ERROR_INVALIDRELATIONFIELD]={
            content: 'Fehlende Definition für die Relation \'{1}\' der Ressource vom Typ \'{0}\'.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.VALIDATION_ERROR_INVALIDRELATIONFIELDS]={
            content: 'Fehlende Definitionen für die Relationen \'{1}\' der Ressource vom Typ \'{0}\'.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.VALIDATION_ERROR_INVALID_NUMERIC_VALUE]={
            content: 'Falsche Zahlenwerte für das Feld \'{1}\' der Ressource vom Typ \'{0}\'.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.VALIDATION_ERROR_INVALID_NUMERIC_VALUES]={
            content: 'Falsche Zahlenwerte für das Felder \'{1}\' der Ressource vom Typ \'{0}\'.',
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
        this.msgs[MDInternal.VALIDATION_ERROR_MISSINGVIEWTYPE]={
            content: 'Im View-Teil der Configuration.json wird auf den nicht definierten Typ \'{0}\' verwiesen.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.VALIDATION_ERROR_NONOPERATIONVIEWTYPE]={
            content: 'Im View-Teil der Configuration.json wird auf den Typ \'{0}\' verwiesen. Dieser ist als Nicht-Maßnahmen-Typ nicht unterstützt.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.VALIDATION_ERROR_TOPLEVELTYPEHASPARENT]={
            content: 'Top-Level-Type \'{0}\' darf kein parent besitzen.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.VALIDATION_ERROR_INCOMPLETERECORDEDIN]={
            content: 'Fehlende oder unvollständige Definition von \'recordedIn\' für Top-Level-Type \'{0}\'.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.VALIDATION_ERROR_NOPROJECTRECORDEDIN]={
            content: 'Fehlende Definition von \'recordedIn\' für den Type \'project\'.',
            level: 'danger',
            params: [],
            hidden: false
        };
        this.msgs[MDInternal.VALIDATION_ERROR_INVALIDINPUTTYPE]={
            content: 'Ungültiger Wert \'{1}\' für \'inputType\' in Felddefinition für \'{0}\'. Erlaubte Werte: {2}.',
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