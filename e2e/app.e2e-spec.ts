import { KiedyPociagPage } from './app.po';

describe('kiedy-pociag App', function() {
  let page: KiedyPociagPage;

  beforeEach(() => {
    page = new KiedyPociagPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
