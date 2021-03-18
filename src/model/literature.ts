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


    export type Translations = 'zenonId'|'page'|'figure';


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
                                  getTranslation: (term: Literature.Translations) => string,
                                  includeZenonId: boolean = true): string {

        let additionalInformation: string[] = [];

        if (includeZenonId && literature.zenonId) {
            additionalInformation.push(getTranslation('zenonId') + ': ' + literature.zenonId);
        }
        if (literature.page) {
            additionalInformation.push(getTranslation('page') + ' ' + literature.page);
        }
        if (literature.figure) {
            additionalInformation.push(getTranslation('figure') + ' ' + literature.figure);
        }

        return literature.quotation + (additionalInformation.length > 0
            ? ' (' + additionalInformation.join(', ') + ')'
            : ''
        );
    }
}
