import { SanitizeHtmlPipePipe } from './sanitize-html-pipe.pipe';

describe('SanitizeHtmlPipePipe', () => {
  it('create an instance', () => {
    const pipe = new SanitizeHtmlPipePipe();
    expect(pipe).toBeTruthy();
  });
});
