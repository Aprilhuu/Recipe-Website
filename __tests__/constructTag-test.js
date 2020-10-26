import constructTag from '../src/helper_functions/constructTag'

// constructTag should take a list of strings as input and output
// elements of type tag that have contents equal to given inputs
describe('Tests for constructTag function', () => {
    const testStrings = ['hello', 'hi']
    

    test('check that the function returns an element of type Tag', () => {
        let result = constructTag(testStrings);

        for(let i = 0; i < testStrings.length; i++) {
            expect(result[i].type.displayName).toBe('Tag');
        }
    })

    test('check that the contents of the tag is correct', () => {
        let result = constructTag(testStrings);

        for(let i = 0; i < testStrings.length; i++) {
            expect(result[i].props['children']).toBe(testStrings[i]);
        }
    })
})