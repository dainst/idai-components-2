import { isObject } from 'tsfun';

/**
 * @author Thomas Kleinke
 */
export interface Literature {

    quotation: string;
    zenonId?: string;
    page?: string;
    figure?: string;
}


export module Literature {

    export const QUOTATION = 'quotation';
    export const ZENON_ID = 'zenonId';
    export const PAGE = 'page';
    export const FIGURE = 'figure';

    const VALID_FIELDS = [QUOTATION, ZENON_ID, PAGE, FIGURE];


    export interface Translations {
        'zenonId': string;
        'page': string;
        'figure': string;
    }


    export function isLiterature(literature: any): literature is Literature {

        return isObject(literature) && isValid(literature);
    }


    export function isValid(literature: Literature, options?: any): boolean {

        for (const fieldName in literature) {
            if (!VALID_FIELDS.includes(fieldName)) return false;
        }

        return literature.quotation !== undefined && literature.quotation.length > 0;
    }


    export function generateLabel(literature: Literature, 
                                  translations: Literature.Translations,
                                  includeZenonId: boolean = true): string {

        let additionalInformation: string[] = [];

        if (includeZenonId && literature.zenonId) {
            additionalInformation.push(translations['zenonId'] + ': ' + literature.zenonId);
        }
        if (literature.page) {
            additionalInformation.push(translations['page'] + ' ' + literature.page);
        }
        if (literature.figure) {
            additionalInformation.push(translations['figure'] + ' ' + literature.figure);
        }

        return literature.quotation + (additionalInformation.length > 0
            ? ' (' + additionalInformation.join(', ') + ')'
            : ''
        );
    }
}
