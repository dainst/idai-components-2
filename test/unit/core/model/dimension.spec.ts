import {Dimension} from '../../../../src/model/dimension';


/**
 * @author Daniel de Oliveira
 */
describe('Dimension', () => {

    it('translate back to original state', () => {

        const dim: Dimension = {
            inputValue: 100,
            inputRangeEndValue: 200,
            inputUnit: 'cm',
            isImprecise: false,
            isRange: false
        };

        Dimension.addNormalizedValues(dim);
        expect(dim.value).not.toBeUndefined();

        const reverted = Dimension.revert(dim);
        expect(reverted['value']).toBeUndefined();
    });

    // TODO test also for range
});