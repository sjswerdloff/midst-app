import { convertMidstFile } from '../util';

describe('convertMidstFile Data Integrity', () => {
  const validOldFormat = {
    editorTimelineFrames: [
      {
        content: '<p>First line</p>',
        lineNumber: '0',
        timestamp: 1642000000000,
      },
      {
        content: '<p>First line</p><p>Second line</p>',
        lineNumber: '1',
        timestamp: 1642000001000,
      },
      {
        content: '<p>First line edited</p><p>Second line</p>',
        lineNumber: '0',
        timestamp: 1642000002000,
      },
    ],
  };

  describe('Data Preservation Contracts', () => {
    it('should preserve all timeline frames as history entries', () => {
      const input = JSON.stringify(validOldFormat);
      const result = convertMidstFile(input);
      const parsed = JSON.parse(result);

      expect(parsed.history).toHaveLength(3);
      expect(parsed.history).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            inserted: expect.any(String),
            front: expect.any(Number),
            end: expect.any(Number),
            t: expect.any(String), // Date serialized as string in JSON
          }),
        ]),
      );
    });

    it('should preserve all timestamps during conversion', () => {
      const input = JSON.stringify(validOldFormat);
      const result = convertMidstFile(input);
      const parsed = JSON.parse(result);

      const timestamps = parsed.history.map((h: any) =>
        new Date(h.t).getTime(),
      );
      expect(timestamps).toEqual([1642000000000, 1642000001000, 1642000002000]);
    });

    it('should generate final text from last timeline frame', () => {
      const input = JSON.stringify(validOldFormat);
      const result = convertMidstFile(input);
      const parsed = JSON.parse(result);

      expect(parsed.text).toBeTruthy();
      expect(parsed.text).toContain('First line edited');
      expect(parsed.text).toContain('Second line');
    });

    it('should return valid JSON structure with text and history', () => {
      const input = JSON.stringify(validOldFormat);
      const result = convertMidstFile(input);

      expect(() => JSON.parse(result)).not.toThrow();

      const parsed = JSON.parse(result);
      expect(parsed).toHaveProperty('text');
      expect(parsed).toHaveProperty('history');
      expect(Array.isArray(parsed.history)).toBe(true);
    });
  });

  describe('Fail-Fast Behavior', () => {
    it('should fail fast on malformed JSON input', () => {
      const invalidJson = 'not valid json {';

      expect(() => convertMidstFile(invalidJson)).toThrow();
    });

    it('should fail fast on missing editorTimelineFrames property', () => {
      const missingFrames = JSON.stringify({ someOtherProperty: 'value' });

      expect(() => convertMidstFile(missingFrames)).toThrow();
    });

    it('should fail fast on null input', () => {
      expect(() => convertMidstFile(null as any)).toThrow();
    });

    it('should fail fast on empty string input', () => {
      expect(() => convertMidstFile('')).toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty timeline frames array gracefully', () => {
      const emptyFrames = JSON.stringify({ editorTimelineFrames: [] });

      expect(() => convertMidstFile(emptyFrames)).not.toThrow();

      const result = convertMidstFile(emptyFrames);
      const parsed = JSON.parse(result);

      expect(parsed.history).toHaveLength(0);
    });

    it('should handle single frame input', () => {
      const singleFrame = JSON.stringify({
        editorTimelineFrames: [
          {
            content: '<p>Only content</p>',
            lineNumber: '0',
            timestamp: 1642000000000,
          },
        ],
      });

      const result = convertMidstFile(singleFrame);
      const parsed = JSON.parse(result);

      expect(parsed.history).toHaveLength(1);
      expect(parsed.text).toContain('Only content');
    });

    it('should handle frames with missing timestamp gracefully', () => {
      const invalidFrame = JSON.stringify({
        editorTimelineFrames: [
          {
            content: '<p>Content without timestamp</p>',
            lineNumber: '0',
            // timestamp missing
          },
        ],
      });

      // Should fail fast rather than create invalid dates
      expect(() => convertMidstFile(invalidFrame)).toThrow();
    });
  });
});
