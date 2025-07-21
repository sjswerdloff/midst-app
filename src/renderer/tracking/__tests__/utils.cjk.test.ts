import { compareStrings, step } from '../utils';

describe('Change Tracking Algorithm - CJK Poetry Support', () => {
  describe('Chinese character preservation contracts', () => {
    it('should preserve traditional Chinese poetry text', () => {
      const original = '詩詞';
      const modified = '詩詞創作';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('創作');
    });

    it('should preserve simplified Chinese poetry text', () => {
      const original = '诗词';
      const modified = '诗词创作';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('创作');
    });

    it('should handle Chinese character modifications', () => {
      const original = '春花';
      const modified = '春日花';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
    });

    it('should preserve traditional Chinese poetry lines', () => {
      const poem_line = '春眠不覺曉，處處聞啼鳥';

      const change = compareStrings('', poem_line, poem_line.length);
      const reconstructed = step('', change);

      expect(reconstructed).toBe(poem_line);
      expect(reconstructed).toContain('春眠');
      expect(reconstructed).toContain('啼鳥');
    });

    it('should handle Chinese punctuation', () => {
      const original = '詩';
      const modified = '詩？詩！';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('？');
      expect(reconstructed).toContain('！');
    });
  });

  describe('Japanese character preservation contracts', () => {
    it('should preserve hiragana text', () => {
      const original = 'はい';
      const modified = 'はいそうです';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('そうです');
    });

    it('should preserve katakana text', () => {
      const original = 'ポエム';
      const modified = 'ポエムコンテスト';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('コンテスト');
    });

    it('should preserve kanji text', () => {
      const original = '俳句';
      const modified = '俳句作品';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('作品');
    });

    it('should handle mixed Japanese scripts', () => {
      const original = '俳句はすばらしい';
      const modified = '俳句はとてもすばらしいポエムです';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('とても');
      expect(reconstructed).toContain('ポエム');
    });

    it('should preserve traditional haiku structure', () => {
      const haiku = '古池や\n蛙飛び込む\n水の音';

      const change = compareStrings('', haiku, haiku.length);
      const reconstructed = step('', change);

      expect(reconstructed).toBe(haiku);
      expect(reconstructed.split('\n')).toHaveLength(3);
      expect(reconstructed).toContain('古池');
      expect(reconstructed).toContain('水の音');
    });

    it('should handle Japanese punctuation and particles', () => {
      const original = '花';
      const modified = '花は美しい。';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('は');
      expect(reconstructed).toContain('。');
    });
  });

  describe('Mixed CJK and multilingual contracts', () => {
    it('should preserve Chinese-English mixed content', () => {
      const original = '詩 Poetry';
      const modified = '中國詩 Chinese Poetry';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('中國');
      expect(reconstructed).toContain('Chinese');
    });

    it('should preserve Japanese-English mixed content', () => {
      const original = '俳句 Haiku';
      const modified = '日本の俳句 Japanese Haiku Poetry';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('日本の');
      expect(reconstructed).toContain('Japanese');
    });

    it('should handle Chinese numerals', () => {
      const original = '第';
      const modified = '第一二三四五章';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('一二三四五');
    });

    it('should handle traditional Chinese and Japanese mixed', () => {
      const original = '漢字';
      const modified = '漢字とひらがな';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('ひらがな');
    });
  });

  describe('CJK poetry structure contracts', () => {
    it('should handle vertical writing line structure', () => {
      const original = '春';
      const modified = '春\n夏\n秋\n冬';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed.split('\n')).toHaveLength(4);
    });

    it('should preserve CJK punctuation variations', () => {
      const original = '詩';
      const modified = '詩、俳句、短歌。';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('、');
      expect(reconstructed).toContain('。');
    });

    it('should handle triple-script content', () => {
      const original = '詩 Poetry';
      const modified = '中國詩 Japanese 俳句 English Poetry';

      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);

      expect(reconstructed).toBe(modified);
      expect(reconstructed).toContain('中國');
      expect(reconstructed).toContain('俳句');
      expect(reconstructed).toContain('English');
    });
  });

  describe('CJK performance and edge cases', () => {
    it('should handle long CJK text efficiently', () => {
      const chinese_paragraph =
        '在這個廣闊的宇宙中，詩歌如同璀璨的星辰，照亮了人類心靈的夜空。每一首詩都是詩人內心世界的真實寫照，承載著深刻的情感和對生活的感悟。';

      const original = chinese_paragraph.slice(0, 20);
      const modified = chinese_paragraph;

      const start = Date.now();
      const change = compareStrings(original, modified, modified.length);
      const reconstructed = step(original, change);
      const duration = Date.now() - start;

      expect(reconstructed).toBe(modified);
      expect(duration).toBeLessThan(100);
    });

    it('should handle CJK Unicode normalization consistently', () => {
      const cjk_text = '詩';

      const change1 = compareStrings('', cjk_text, cjk_text.length);
      const result1 = step('', change1);

      const change2 = compareStrings('', cjk_text, cjk_text.length);
      const result2 = step('', change2);

      expect(result1).toBe(result2);
      expect(result1).toBe(cjk_text);
    });

    it('should handle single CJK character operations', () => {
      const change = compareStrings('', '詩', 1);
      const reconstructed = step('', change);

      expect(reconstructed).toBe('詩');
      expect(change.inserted).toBe('詩');
    });
  });
});
