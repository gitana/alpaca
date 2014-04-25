---
layout: documentation-field
title: Validation
header: Validation
group: navigation
tags: field
---
{% include JB/setup %}

Alpaca computes the validity of fields in a rendered form and updates the DOM automatically to reflect things
nicely for the end user.

When validity checks run, the entire tree is traversed and computed.  Each field being traversed will have it's
outer DOM element updated with new classes.  The ```alpaca-valid``` class is applied to fields that are in a valid state.
The ```alpaca-invalid``` class is applied to fields that in an invalid state.

In addition, a field may be in an invalid state and also be told to hide its validation reporting.  An example of this
is when the ```hideInitValidationError``` flag is set true in the options for the form.  In the case, initial validation
errors are to be hidden.  In this case, fields in an invalid state may also have the ```alpaca-invalid-hidden``` class
applied.

While the basic logic from above holds, callbacks are also fired which allow for developers to extend this behavior.
The ```valid``` and ```invalid``` callbacks are triggered respectively.  The '''clearValidity''' callback is used to
clear all validity state for the field (i.e. a reset) as shown here:

```
    view.callbacks["valid"] = function() {
        // this = field
    };

    view.callbacks["invalid"] = function(hidden) {
        // this = field
    };

    view.callbacks["clearValidity"] = function() {
        // this = field
    };
````

Any invalid field can have zero or more messages applied to them.  Messages are intended as guidance information to
the end user about why the field is invalid and what they can do about it.  An invalid field could have multiple
messages.

By default, these messages are wrapped into ```DIV``` elements with the ```alpaca-message``` class applied.  They are
appended as siblings of the field so that they appear underneath.

You can customize this behavior using callbacks.  The ```addMessage``` callback lets you plug the message onto a field
and the ```removeMessages``` callback removes all messages for a field.

```
    view.callbacks["addMessage"] = function(message) {
        // this = field
    };

    view.callbacks["removeMessages"] = function() {
        // this = field
    };
````

Note that if you apply your own callbacks, you will also likely want to override the ```alpaca-message``` class so
that it doesn't display (i.e. set ```display:none```).

