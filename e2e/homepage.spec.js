'use strict';

describe('The homepage view', function () {

  beforeEach(function () {
    browser.get('/');
  });

  it('should display title apila', function() {
    expect(browser.getTitle()).toEqual('Apila');
  });

  it('should have the right description', function() {
    var title = element(by.css('.title'));
    expect(title.getText()).toEqual("The best healthcare information system in the world!");
  });



});
