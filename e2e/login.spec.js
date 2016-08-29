'use strict';

describe('User login', function() {
  beforeEach(function () {
    browser.get('/auth/login');
  });

  it('Login user', function() {

    element(by.model('vm.form.email')).sendKeys('test0@gmail.com');
    element(by.model('vm.form.password')).sendKeys('123456');

    element(by.css('.submit-button')).click();

    var communityTitle = element(by.binding('vm.title'));
    browser.wait(protractor.until.elementIsVisible(communityTitle), 10000, 'Error: Element did not display within 10 seconds');

  });
});
