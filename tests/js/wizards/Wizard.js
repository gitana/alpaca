(function($) {

    module("wizard: wizard");

    // Test case 1 : Configuration-based wizard without using a layout template.
    test("Configuration-based wizard without using a layout template.", function() {
        stop();
        $("#wizard-1").alpaca({
            "dataSource": "../examples/components/wizards/customer-profile-data.json",
            "optionsSource": "../examples/components/wizards/customer-profile-options.json",
            "schemaSource": "../examples/components/wizards/customer-profile-schema.json",
            "view": {
                "parent": "VIEW_WEB_EDIT_LIST",
                "wizard": {
                    "statusBar": true,
                    "validation": true,
                    "steps": 3,
                    "bindings": {
                        "name": 1,
                        "age": 1,
                        "gender": 1,
                        "photo": 1,
                        "member": 2,
                        "phone": 2,
                        "icecream": 2,
                        "address": 3
                    },
                    "stepTitles": [
                        {
                            "title": "Basic",
                            "description": "Name, Age etc."
                        },
                        {
                            "title": "Membership",
                            "description": "Favorite, Member etc."
                        },
                        {
                            "title": "Contact",
                            "description": "Phone, Address etc."
                        }
                    ]
                }
            },
            "postRender": function (renderedField) {
                expect(29);
                var fieldSetElem = $('#wizard-1 fieldset');
                ok(fieldSetElem.length, 'Fieldset for wizard generated.');
                var wizardStatusBarElem = $('.alpaca-wizard-status-bar', fieldSetElem);
                ok(wizardStatusBarElem.length, 'Wizard status bar generated.');
                var wizardStepHeadElems = $('li', wizardStatusBarElem);
                equal(wizardStepHeadElems.length, 3, "Right number of step heads generated.");
                var step0Elem = $('#step0', fieldSetElem);
                ok(step0Elem.length, 'Step 1 of wizard generated.');
                notEqual(step0Elem.css('display'), 'none', 'Step 1 of wizard shown.');
                var step1Elem = $('#step1', fieldSetElem);
                ok(step1Elem.length, 'Step 2 of wizard generated.');
                equal(step1Elem.css('display'), 'none', 'Step 2 of wizard hidden.');
                var step2Elem = $('#step2', fieldSetElem);
                ok(step2Elem.length, 'Step 3 of wizard generated.');
                equal(step2Elem.css('display'), 'none', 'Step 3 of wizard hidden.');
                var step0NextButtonElem = $('button#step0-button-next', step0Elem);
                ok(step0NextButtonElem.length, "Next button for step 1 generated");
                equal(step0NextButtonElem.text(), 'Next', "Text for stepv1 next button populated correctly.");
                step0NextButtonElem.click(function() {
                    notEqual(step1Elem.css('display'), 'none', 'Step 2 of wizard shown.');
                    equal(step0Elem.css('display'), 'none', 'Step 1 of wizard hidden.');
                    equal(step2Elem.css('display'), 'none', 'Step 3 of wizard hidden.');
                    var step1NextButtonElem = $('button#step1-button-next', step1Elem);
                    ok(step1NextButtonElem.length, "Next button for step 2 generated");
                    equal(step1NextButtonElem.text(), 'Next', "Text for step 2 next button populated correctly.");
                    step1NextButtonElem.click(function() {
                        notEqual(step2Elem.css('display'), 'none', 'Step 3 of wizard shown.');
                        equal(step0Elem.css('display'), 'none', 'Step 1 of wizard hidden.');
                        equal(step1Elem.css('display'), 'none', 'Step 2 of wizard hidden.');
                        var step2PrevButtonElem = $('button#step2-button-pre', step2Elem);
                        ok(step2PrevButtonElem.length, "Back button for step 3 generated");
                        equal(step2PrevButtonElem.text(), 'Back', "Text for step 3 back button populated correctly.");
                        step2PrevButtonElem.click(function() {
                            notEqual(step1Elem.css('display'), 'none', 'Step 2 of wizard shown.');
                            equal(step0Elem.css('display'), 'none', 'Step 1 of wizard hidden.');
                            equal(step2Elem.css('display'), 'none', 'Step 3 of wizard hidden.');
                            var step1PrevButtonElem = $('button#step1-button-pre', step1Elem);
                            ok(step1PrevButtonElem.length, "Back button for step 2 generated");
                            equal(step1PrevButtonElem.text(), 'Back', "Text for step 2 back button populated correctly.");
                            step1PrevButtonElem.click(function() {
                                notEqual(step0Elem.css('display'), 'none', 'Step 1 of wizard shown.');
                                equal(step1Elem.css('display'), 'none', 'Step 2 of wizard hidden.');
                                equal(step2Elem.css('display'), 'none', 'Step 3 of wizard hidden.');

                            });
                            step1PrevButtonElem.click();
                        });
                        step2PrevButtonElem.click();
                    });
                    step1NextButtonElem.click();
                });
                step0NextButtonElem.click();
                start();
            }
        });
    });

    // Test case 2 : Template-based wizard.
    test("Template-based wizard.", function() {
        stop();
        $("#wizard-2").alpaca({
            "dataSource": "../examples/components/wizards/customer-profile-data.json",
            "optionsSource": "../examples/components/wizards/customer-profile-options.json",
            "schemaSource": "../examples/components/wizards/customer-profile-schema.json",
            "view": {
                "parent": "VIEW_JQUERYUI_EDIT_LIST",
                "layout": {
                    "template": "../examples/components/wizards/wizard-template.html",
                    "bindings": {
                        "name": "alpaca-wizard-step-1",
                        "age": "alpaca-wizard-step-1",
                        "gender": "alpaca-wizard-step-1",
                        "photo": "alpaca-wizard-step-1",
                        "member": "alpaca-wizard-step-2",
                        "phone": "alpaca-wizard-step-2",
                        "icecream": "alpaca-wizard-step-2",
                        "address": "alpaca-wizard-step-3"
                    }
                },
                "wizard": {
                    "statusBar": true
                }
            },
            "postRender": function (renderedField) {
                expect(29);
                var fieldSetElem = $('#wizard-2 .alpaca-wizard');
                ok(fieldSetElem.length, 'Wizard generated.');
                var wizardStatusBarElem = $('#wizard-2 .alpaca-wizard-status-bar');
                ok(wizardStatusBarElem.length, 'Wizard status bar generated.');
                var wizardStepHeadElems = $('li', wizardStatusBarElem);
                equal(wizardStepHeadElems.length, 3, "Right number of step heads generated.");
                var step0Elem = $('#step0', fieldSetElem);
                ok(step0Elem.length, 'Step 1 of wizard generated.');
                notEqual(step0Elem.css('display'), 'none', 'Step 1 of wizard shown.');
                var step1Elem = $('#step1', fieldSetElem);
                ok(step1Elem.length, 'Step 2 of wizard generated.');
                equal(step1Elem.css('display'), 'none', 'Step 2 of wizard hidden.');
                var step2Elem = $('#step2', fieldSetElem);
                ok(step2Elem.length, 'Step 3 of wizard generated.');
                equal(step2Elem.css('display'), 'none', 'Step 3 of wizard hidden.');
                var step0NextButtonElem = $('button#step0-button-next', step0Elem);
                ok(step0NextButtonElem.length, "Next button for step 1 generated");
                equal(step0NextButtonElem.text(), 'Next', "Text for stepv1 next button populated correctly.");
                step0NextButtonElem.click(function() {
                    notEqual(step1Elem.css('display'), 'none', 'Step 2 of wizard shown.');
                    equal(step0Elem.css('display'), 'none', 'Step 1 of wizard hidden.');
                    equal(step2Elem.css('display'), 'none', 'Step 3 of wizard hidden.');
                    var step1NextButtonElem = $('button#step1-button-next', step1Elem);
                    ok(step1NextButtonElem.length, "Next button for step 2 generated");
                    equal(step1NextButtonElem.text(), 'Next', "Text for step 2 next button populated correctly.");
                    step1NextButtonElem.click(function() {
                        notEqual(step2Elem.css('display'), 'none', 'Step 3 of wizard shown.');
                        equal(step0Elem.css('display'), 'none', 'Step 1 of wizard hidden.');
                        equal(step1Elem.css('display'), 'none', 'Step 2 of wizard hidden.');
                        var step2PrevButtonElem = $('button#step2-button-pre', step2Elem);
                        ok(step2PrevButtonElem.length, "Back button for step 3 generated");
                        equal(step2PrevButtonElem.text(), 'Back', "Text for step 3 back button populated correctly.");
                        step2PrevButtonElem.click(function() {
                            notEqual(step1Elem.css('display'), 'none', 'Step 2 of wizard shown.');
                            equal(step0Elem.css('display'), 'none', 'Step 1 of wizard hidden.');
                            equal(step2Elem.css('display'), 'none', 'Step 3 of wizard hidden.');
                            var step1PrevButtonElem = $('button#step1-button-pre', step1Elem);
                            ok(step1PrevButtonElem.length, "Back button for step 2 generated");
                            equal(step1PrevButtonElem.text(), 'Back', "Text for step 2 back button populated correctly.");
                            step1PrevButtonElem.click(function() {
                                notEqual(step0Elem.css('display'), 'none', 'Step 1 of wizard shown.');
                                equal(step1Elem.css('display'), 'none', 'Step 2 of wizard hidden.');
                                equal(step2Elem.css('display'), 'none', 'Step 3 of wizard hidden.');

                            });
                            step1PrevButtonElem.click();
                        });
                        step2PrevButtonElem.click();
                    });
                    step1NextButtonElem.click();
                });
                step0NextButtonElem.click();
                start();
            }
        });
    });

}(jQuery) );