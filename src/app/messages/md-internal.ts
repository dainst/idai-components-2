import {Injectable} from "@angular/core";
import {Message} from "./message"
import {MD} from "./md"

/**
 * A message dictionary with messages for
 * native library functionality.
 *
 * @author Daniel de Oliveira
 */
@Injectable()
export class MDInternal extends MD {

    public static MESSAGES_NOBODY : string = 'messages/nobody';
    public static PC_GENERIC_ERROR : string = 'pmc/generic';
    public static PARSE_GENERIC_ERROR : string = 'parse/generic';

    public static VALIDATION_ERROR_IDMISSING : string = 'validation/error/idmissing';
    public static VALIDATION_ERROR_INVALIDTYPE: string = 'validation/error/invalidtype';
    public static VALIDATION_ERROR_INVALIDFIELD: string = 'validation/error/invalidfield';
    public static VALIDATION_ERROR_INVALIDFIELDS: string = 'validation/error/invalidfields';

    public msgs : { [id: string]: Message } = {};

    constructor() {
        super();
        this.msgs[MDInternal.MESSAGES_NOBODY]={
            content: "Keine Message gefunden für Schlüssel 'id'.",
            level: 'danger',
            params: []
        };
        this.msgs[MDInternal.PC_GENERIC_ERROR]={
            content: "Fehler beim Auswerten eines Konfigurationsobjektes.",
            level: 'danger',
            params: []
        };
        this.msgs[MDInternal.PARSE_GENERIC_ERROR]={
            content: 'Fehler beim Parsen der Konfigurationsdatei "{0}" (mehr Informationen in der Konsole).',
            level: 'danger',
            params: []
        };

        
        this.msgs[MDInternal.VALIDATION_ERROR_INVALIDTYPE]={
            content: "Der Typ der Ressource wird nicht unterstützt.",
            level: 'danger',
            params: []
        };
        this.msgs[MDInternal.VALIDATION_ERROR_INVALIDFIELD]={
            content: "Fehlende Felddefinition für das Feld \"{1}\" der Ressource vom Typ \"{0}\".",
            level: 'danger',
            params: []
        };
        this.msgs[MDInternal.VALIDATION_ERROR_INVALIDFIELDS]={
            content: "Fehlende Felddefinitionen für die Felder \"{1}\" der Ressource vom Typ \"{0}\".",
            level: 'danger',
            params: []
        };
        this.msgs[MDInternal.VALIDATION_ERROR_IDMISSING]={
            content: 'Objekt-Identifier fehlt.',
            level: 'danger',
            params: []
        };
    }
}