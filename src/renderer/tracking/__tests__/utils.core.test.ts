import { compareStrings, step, ChangeObj } from '../utils';

describe('Change Tracking Algorithm - Core Contracts', () => {
  describe('Basic text operations', () => {
    it('should handle identical strings with no changes', () => {
      const result = compareStrings('hello', 'hello', 5);
      const reconstructed = step('hello', result);

      expect(reconstructed).toBe('hello');
      expect(result.inserted).toBe('');
      expect(result.t).toBeInstanceOf(Date);
    });

    it('should preserve text through insertion operations', () => {
      const original = 'hello';
      const modified = 'hello world';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
    });

    it('should preserve text through deletion operations', () => {
      const original = 'hello world';
      const modified = 'hello';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
    });

    it('should preserve text through replacement operations', () => {
      const original = 'hello world';
      const modified = 'hello universe';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
    });
  });

  describe('Data integrity contracts', () => {
    it('should handle empty string transformations', () => {
      const change = compareStrings('', 'hello', 5);
      const reconstructed = step('', change);

      expect(reconstructed).toBe('hello');
      expect(change.inserted).toBe('hello');
    });

    it('should handle text-to-empty transformations', () => {
      const change = compareStrings('hello', '', 0);
      const reconstructed = step('hello', change);

      expect(reconstructed).toBe('');
      expect(change.inserted).toBe('');
    });

    it('should preserve complex HTML structures', () => {
      const original = '<p>Hello</p>';
      const modified = '<p><strong>Hello</strong> <em>world</em></p>';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
    });

    it('should handle line breaks correctly', () => {
      const original = 'hello world';
      const modified = 'hello\nworld';

      const change = compareStrings(original, modified, 6);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
    });
  });

  describe('Performance contracts', () => {
    it('should handle large text efficiently', () => {
      const longText = 'a'.repeat(10000);
      const modifiedText = `${longText}X`;

      const start = Date.now();
      const change = compareStrings(
        longText,
        modifiedText,
        modifiedText.length,
      );
      const reconstructed = step(longText, change);
      const duration = Date.now() - start;

      expect(reconstructed).toBe(modifiedText);
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Unicode support contracts', () => {
    it('should preserve basic Unicode characters', () => {
      const original = 'hello';
      const modified = 'hello🌟';

      const change = compareStrings(original, modified, 7);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('🌟');
    });

    it('should handle special characters', () => {
      const original = 'test';
      const modified = 'test\t\n\r';

      const change = compareStrings(original, modified, 7);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
    });
  });
});
