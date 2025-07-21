import {
  compareStrings,
  step,
  reconstruct,
  reconstructHTML,
  ChangeObj,
} from '../utils';

describe('Change Tracking Algorithm', () => {
  describe('compareStrings', () => {
    it('should handle identical strings', () => {
      const result = compareStrings('hello', 'hello', 5);
      expect(result.inserted).toBe('');
      expect(result.front).toBe(0);
      expect(result.end).toBe(0);
      expect(result.pos).toBe(5);
      expect(result.t).toBeInstanceOf(Date);
    });

    it('should handle character insertion at beginning', () => {
      const result = compareStrings('hello', 'Xhello', 1);
      expect(result.inserted).toBe('X');
      expect(result.front).toBe(0);
      expect(result.end).toBe(0);
      expect(result.pos).toBe(1);
    });

    it('should handle character insertion at end', () => {
      const result = compareStrings('hello', 'helloX', 6);
      expect(result.inserted).toBe('X');
      expect(result.front).toBe(5);
      expect(result.end).toBe(0);
      expect(result.pos).toBe(6);
    });

    it('should handle character insertion in middle', () => {
      const result = compareStrings('hello', 'heXllo', 3);
      expect(result.inserted).toBe('X');
      expect(result.front).toBe(2);
      expect(result.end).toBe(3);
      expect(result.pos).toBe(3);
    });

    it('should handle character deletion at beginning', () => {
      const result = compareStrings('hello', 'ello', 0);
      expect(result.inserted).toBe('');
      expect(result.front).toBe(0);
      expect(result.end).toBe(4);
      expect(result.pos).toBe(0);
    });

    it('should handle character deletion at end', () => {
      const result = compareStrings('hello', 'hell', 4);
      expect(result.inserted).toBe('');
      expect(result.front).toBe(4);
      expect(result.end).toBe(0);
      expect(result.pos).toBe(4);
    });

    it('should handle character deletion in middle', () => {
      const result = compareStrings('hello', 'helo', 2);
      expect(result.inserted).toBe('');
      expect(result.front).toBe(2);
      expect(result.end).toBe(2);
      expect(result.pos).toBe(2);
    });

    it('should handle word insertion', () => {
      const result = compareStrings('hello world', 'hello beautiful world', 15);
      expect(result.inserted).toBe('beautiful ');
      expect(result.front).toBe(6);
      expect(result.end).toBe(5);
      expect(result.pos).toBe(15);
    });

    it('should handle word replacement', () => {
      const result = compareStrings('hello world', 'hello universe', 14);
      expect(result.inserted).toBe('universe');
      expect(result.front).toBe(6);
      expect(result.end).toBe(0);
      expect(result.pos).toBe(14);
    });

    it('should handle complete text replacement', () => {
      const result = compareStrings('hello', 'goodbye', 7);
      expect(result.inserted).toBe('goodbye');
      expect(result.front).toBe(0);
      expect(result.end).toBe(0);
      expect(result.pos).toBe(7);
    });

    it('should handle empty string to text', () => {
      const result = compareStrings('', 'hello', 5);
      expect(result.inserted).toBe('hello');
      expect(result.front).toBe(0);
      expect(result.end).toBe(0);
      expect(result.pos).toBe(5);
    });

    it('should handle text to empty string', () => {
      const result = compareStrings('hello', '', 0);
      expect(result.inserted).toBe('');
      expect(result.front).toBe(0);
      expect(result.end).toBe(0);
      expect(result.pos).toBe(0);
    });

    it('should handle line breaks', () => {
      const result = compareStrings('hello world', 'hello\nworld', 6);
      expect(result.inserted).toBe('\n');
      expect(result.front).toBe(5);
      expect(result.end).toBe(5);
      expect(result.pos).toBe(6);
    });

    it('should handle HTML tag insertion', () => {
      const result = compareStrings(
        '<p>hello</p>',
        '<p><strong>hello</strong></p>',
        17,
      );
      expect(result.inserted).toBe('<strong>hello</strong>');
      expect(result.front).toBe(3);
      expect(result.end).toBe(4);
      expect(result.pos).toBe(17);
    });

    it('should handle multiple character insertion', () => {
      const result = compareStrings('hello', 'hello world!', 12);
      expect(result.inserted).toBe(' world!');
      expect(result.front).toBe(5);
      expect(result.end).toBe(0);
      expect(result.pos).toBe(12);
    });
  });

  describe('step', () => {
    it('should apply change correctly - insertion at beginning', () => {
      const change: ChangeObj = {
        inserted: 'X',
        front: 0,
        end: 0,
        t: new Date(),
        pos: 1,
      };
      const result = step('hello', change);
      expect(result).toBe('Xhello');
    });

    it('should apply change correctly - insertion at end', () => {
      const change: ChangeObj = {
        inserted: 'X',
        front: 5,
        end: 0,
        t: new Date(),
        pos: 6,
      };
      const result = step('hello', change);
      expect(result).toBe('helloX');
    });

    it('should apply change correctly - insertion in middle', () => {
      const change: ChangeObj = {
        inserted: 'X',
        front: 2,
        end: 3,
        t: new Date(),
        pos: 3,
      };
      const result = step('hello', change);
      expect(result).toBe('heXllo');
    });

    it('should apply change correctly - deletion', () => {
      const change: ChangeObj = {
        inserted: '',
        front: 1,
        end: 3,
        t: new Date(),
        pos: 1,
      };
      const result = step('hello', change);
      expect(result).toBe('hlo');
    });

    it('should apply change correctly - replacement', () => {
      const change: ChangeObj = {
        inserted: 'i',
        front: 1,
        end: 3,
        t: new Date(),
        pos: 2,
      };
      const result = step('hello', change);
      expect(result).toBe('hilo');
    });
  });

  describe('Round-trip integrity', () => {
    it('should maintain integrity: compareStrings → step → original result', () => {
      const original = 'hello world';
      const modified = 'hello beautiful world';

      const change = compareStrings(original, modified, 15);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
    });

    it('should handle multiple sequential changes', () => {
      const texts = [
        '',
        'H',
        'He',
        'Hel',
        'Hell',
        'Hello',
        'Hello ',
        'Hello w',
        'Hello wo',
        'Hello wor',
        'Hello worl',
        'Hello world',
      ];

      const changes: ChangeObj[] = [];
      for (let i = 1; i < texts.length; i++) {
        changes.push(compareStrings(texts[i - 1], texts[i], texts[i].length));
      }

      // Verify each step
      let current = '';
      for (let i = 0; i < changes.length; i++) {
        current = step(current, changes[i]);
        expect(current).toBe(texts[i + 1]);
      }
    });

    it('should handle complex editing sequence', () => {
      const sequence = [
        'The quick brown fox',
        'The quick brown fox jumps',
        'The quick brown fox jumps over',
        'The quick brown fox jumps over the lazy dog',
        'The quick brown fox leaps over the lazy dog', // replace "jumps" with "leaps"
        'The quick fox leaps over the lazy dog', // delete "brown"
        'The quick fox leaps over the sleepy dog', // replace "lazy" with "sleepy"
      ];

      const changes: ChangeObj[] = [];
      for (let i = 1; i < sequence.length; i++) {
        changes.push(
          compareStrings(sequence[i - 1], sequence[i], sequence[i].length),
        );
      }

      // Test reconstruction at each point
      for (let i = 0; i < changes.length; i++) {
        const reconstructed = reconstruct('', changes, i);
        expect(reconstructed).toBe(sequence[i + 1]);
      }
    });
  });

  describe('reconstruct', () => {
    it('should reconstruct empty history', () => {
      const result = reconstruct('initial', [], -1);
      expect(result).toBe('');
    });

    it('should reconstruct single change', () => {
      const changes: ChangeObj[] = [
        {
          inserted: 'Hello',
          front: 0,
          end: 0,
          t: new Date(),
          pos: 5,
        },
      ];

      const result = reconstruct('', changes, 0);
      expect(result).toBe('Hello');
    });

    it('should reconstruct partial history', () => {
      const changes: ChangeObj[] = [
        { inserted: 'H', front: 0, end: 0, t: new Date(), pos: 1 },
        { inserted: 'e', front: 1, end: 0, t: new Date(), pos: 2 },
        { inserted: 'l', front: 2, end: 0, t: new Date(), pos: 3 },
        { inserted: 'l', front: 3, end: 0, t: new Date(), pos: 4 },
        { inserted: 'o', front: 4, end: 0, t: new Date(), pos: 5 },
      ];

      expect(reconstruct('', changes, 0)).toBe('H');
      expect(reconstruct('', changes, 1)).toBe('He');
      expect(reconstruct('', changes, 2)).toBe('Hel');
      expect(reconstruct('', changes, 3)).toBe('Hell');
      expect(reconstruct('', changes, 4)).toBe('Hello');
    });
  });

  describe('reconstructHTML', () => {
    it('should handle empty changes', () => {
      const result = reconstructHTML('initial', [], 0);
      expect(result).toBe('');
    });

    it('should reconstruct HTML content', () => {
      const changes: ChangeObj[] = [
        { inserted: '<p>Hello</p>', front: 0, end: 0, t: new Date(), pos: 11 },
        { inserted: '<p>World</p>', front: 11, end: 0, t: new Date(), pos: 22 },
      ];

      const result = reconstructHTML('', changes, 1);
      expect(result).toBe('<p>Hello</p><p>World</p>');
    });
  });

  describe('Edge cases and boundary conditions', () => {
    it('should handle very long strings', () => {
      const longString = 'a'.repeat(10000);
      const modifiedString = `${'a'.repeat(5000)}X${'a'.repeat(5000)}`;

      const change = compareStrings(longString, modifiedString, 5001);
      expect(change.inserted).toBe('X');
      expect(change.front).toBe(5000);
      expect(change.end).toBe(5000);
    });

    it('should handle Unicode characters', () => {
      const result = compareStrings('hello', 'hello🌟', 7);
      expect(result.inserted).toBe('🌟');
      expect(result.front).toBe(5);
      expect(result.end).toBe(0);
    });

    it('should handle special characters', () => {
      const result = compareStrings('test', 'test\t\n\r', 7);
      expect(result.inserted).toBe('\t\n\r');
      expect(result.front).toBe(4);
      expect(result.end).toBe(0);
    });

    it('should handle complex HTML structures', () => {
      const original = '<p>Hello</p>';
      const modified = '<p><strong>Hello</strong> <em>world</em></p>';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);
      expect(reconstructed).toBe(modified);
    });
  });
});
