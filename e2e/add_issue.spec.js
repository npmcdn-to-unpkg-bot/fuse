'use strict';

describe('Add issue', function() {
  beforeEach(function () {
    browser.get('/issues/boards/');
  });

  it('Add issue', function() {

    var addBtn = element(by.css('ms-sb-add-card'));
    addBtn.click();

    // wait for modal to pop up
    browser.waitForAngular();

    submitForm();

    //check if we added the issue
    // var title = element.all(by.css(".list-card-name"));
    // expect(title.getText()).toEqual("Awesome issue");

  });

  function submitForm() {
    var titleInput = element(by.model("vm.form.title"));
    titleInput.sendKeys("Awesome issue");

    var timeFrameInput = element(by.model('vm.form.resolutionTimeframe'));
    timeFrameInput.sendKeys('Months');

    var descriptionInput = element(by.model('vm.form.description'));
    descriptionInput.sendKeys('Some awesome input description');

    var addIssueBtn = element(by.css(".send-button"));
    addIssueBtn.click();
  }
});
