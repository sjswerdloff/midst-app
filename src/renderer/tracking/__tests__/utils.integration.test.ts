import {
  compareStrings,
  step,
  reconstruct,
  reconstructHTML,
  ChangeObj,
} from '../utils';

describe('Change Tracking Algorithm - Integration Contracts', () => {
  describe('Multi-step editing contracts', () => {
    it('should maintain integrity through sequential changes', () => {
      const sequence = ['', 'H', 'He', 'Hel', 'Hell', 'Hello'];

      const changes: ChangeObj[] = [];
      for (let i = 1; i < sequence.length; i++) {
        changes.push(
          compareStrings(sequence[i - 1], sequence[i], sequence[i].length),
        );
      }

      let current = '';
      for (let i = 0; i < changes.length; i++) {
        current = step(current, changes[i]);
        expect(current).toBe(sequence[i + 1]);
      }
    });

    it('should handle complex document editing workflow', () => {
      const workflow = [
        'Introduction',
        'Introduction\n\nFirst paragraph.',
        'Introduction\n\nRevised first paragraph.',
        'Introduction\n\nRevised first paragraph.\n\nSecond paragraph.',
      ];

      const changes: ChangeObj[] = [];
      for (let i = 1; i < workflow.length; i++) {
        changes.push(
          compareStrings(workflow[i - 1], workflow[i], workflow[i].length),
        );
      }

      let current = workflow[0];
      for (let i = 0; i < changes.length; i++) {
        current = step(current, changes[i]);
        expect(current).toBe(workflow[i + 1]);
      }
    });
  });

  describe('History reconstruction contracts', () => {
    it('should reconstruct any point in editing history', () => {
      const changes: ChangeObj[] = [
        { inserted: 'H', front: 0, end: 0, t: new Date(), pos: 1 },
        { inserted: 'e', front: 1, end: 0, t: new Date(), pos: 2 },
        { inserted: 'l', front: 2, end: 0, t: new Date(), pos: 3 },
        { inserted: 'l', front: 3, end: 0, t: new Date(), pos: 4 },
        { inserted: 'o', front: 4, end: 0, t: new Date(), pos: 5 },
      ];

      expect(reconstruct('', changes, 0)).toBe('H');
      expect(reconstruct('', changes, 2)).toBe('Hel');
      expect(reconstruct('', changes, 4)).toBe('Hello');
    });

    it('should handle empty history correctly', () => {
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
  });

  describe('HTML reconstruction contracts', () => {
    it('should preserve HTML structure through changes', () => {
      const changes: ChangeObj[] = [
        { inserted: '<p>Hello</p>', front: 0, end: 0, t: new Date(), pos: 11 },
        { inserted: '<p>World</p>', front: 11, end: 0, t: new Date(), pos: 22 },
      ];

      const result = reconstructHTML('', changes, 1);
      expect(result).toBe('<p>Hello</p><p>World</p>');
    });

    it('should handle empty HTML changes', () => {
      const result = reconstructHTML('initial', [], 0);
      expect(result).toBe('');
    });
  });

  describe('Data integrity contracts', () => {
    it('should maintain round-trip integrity', () => {
      const original = 'hello world';
      const modified = 'hello beautiful world';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
    });

    it('should handle collaborative editing scenarios', () => {
      const base = 'Shared document.';

      const userA_edit = 'Shared document with User A content.';
      const changeA = compareStrings(base, userA_edit, userA_edit.length);

      const userB_edit = 'Shared document with User B additions.';
      const changeB = compareStrings(base, userB_edit, userB_edit.length);

      expect(step(base, changeA)).toBe(userA_edit);
      expect(step(base, changeB)).toBe(userB_edit);

      expect(changeA.inserted).toContain('User A');
      expect(changeB.inserted).toContain('User B');
    });

    it('should preserve complex HTML through multiple operations', () => {
      const operations = [
        '<p>Hello <strong>world</strong>!</p>',
        '<p>Hello <strong>beautiful world</strong>!</p>',
        '<p><em>Hello</em> <strong>beautiful world</strong>!</p>',
      ];

      let current = operations[0];
      for (let i = 1; i < operations.length; i++) {
        const change = compareStrings(
          current,
          operations[i],
          operations[i].length,
        );
        current = step(current, change);
        expect(current).toBe(operations[i]);
      }
    });
  });
});
