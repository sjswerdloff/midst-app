import { compareStrings, step } from '../utils';

describe('Change Tracking Algorithm - Persian Poetry Support', () => {
  describe('Persian character preservation contracts', () => {
    it('should preserve Persian text through insertions', () => {
      const original = 'سلام';
      const modified = 'سلام دنیا';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('سلام');
      expect(reconstructed).toContain('دنیا');
    });

    it('should preserve Persian text during reconstruction', () => {
      const persian_text = 'شعر فارسی زیبا است';

      const change = compareStrings('', persian_text, persian_text.length);
      const reconstructed = step('', change);

      expect(reconstructed).toBe(persian_text);
      expect(change.inserted).toBe(persian_text);
    });

    it('should handle Persian word modifications', () => {
      const original = 'شعر';
      const modified = 'شعری';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
    });
  });

  describe('Persian diacritical marks contracts', () => {
    it('should preserve diacritical marks', () => {
      const original = 'شِعر';
      const modified = 'شِعرِ';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('ِ');
    });

    it('should handle adding diacritics to existing text', () => {
      const original = 'شعر';
      const modified = 'شَعْر';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('َ');
      expect(reconstructed).toContain('ْ');
    });
  });

  describe('Mixed script contracts', () => {
    it('should preserve Persian-English mixed content', () => {
      const original = 'شعر English';
      const modified = 'شعر فارسی English poetry';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('فارسی');
      expect(reconstructed).toContain('English');
    });

    it('should handle Persian numerals', () => {
      const original = 'صفحه';
      const modified = 'صفحه ۱۲۳';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('۱۲۳');
    });

    it('should handle Arabic text within Persian content', () => {
      const original = 'شعر فارسی';
      const modified = 'شعر فارسی و عربی';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('عربی');
    });
  });

  describe('Persian poetry structure contracts', () => {
    it('should preserve traditional poetry formatting', () => {
      const ghazal_line = 'دل می‌خواهد که با تو سخن گویم';

      const change = compareStrings('', ghazal_line, ghazal_line.length);
      const reconstructed = step('', change);

      expect(reconstructed).toBe(ghazal_line);
      expect(reconstructed).toContain('می‌خواهد');
    });

    it('should handle Persian punctuation', () => {
      const original = 'شعر';
      const modified = 'شعر؟ شعر!';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('؟');
    });

    it('should preserve poetry line structure', () => {
      const original = 'بیت اول';
      const modified = 'بیت اول\nبیت دوم';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed.split('\n')).toHaveLength(2);
    });
  });

  describe('Persian text performance contracts', () => {
    it('should handle long Persian text efficiently', () => {
      const persian_paragraph =
        'در این دشت بی‌انتها که زمین و آسمان در هم آمیخته‌اند، شاعری نشسته و به ستارگان نگاه می‌کند. او در جستجوی الهامی است که قلبش را به لرزه درآورد و کلماتی بیافریند که جاودانه باشند.';

      const original = persian_paragraph.slice(0, 50);
      const modified = persian_paragraph;

      const start = Date.now();
      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);
      const duration = Date.now() - start;

      expect(reconstructed).toBe(modified);
      expect(duration).toBeLessThan(100);
    });

    it('should handle Unicode normalization consistently', () => {
      const persian_text = 'شِعر';

      const change1 = compareStrings('', persian_text, persian_text.length);
      const result1 = step('', change1);

      const change2 = compareStrings('', persian_text, persian_text.length);
      const result2 = step('', change2);

      expect(result1).toBe(result2);
      expect(result1).toBe(persian_text);
    });
  });
});
