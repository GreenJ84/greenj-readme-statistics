import { checkAllowlistRequest } from '../../src/utils/allowlist';

describe('Allow list should function properly', () => {
    it('Should accept user in the allowlist', () => {
        expect(checkAllowlistRequest('GreenJ84')).toEqual(true);
    })
})