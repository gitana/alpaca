---
layout: documentation-api
title: Ordering
header: Ordering
group: navigation
tags: field
---
{% include JB/setup %}

The default rendering engine that Alpaca utilizes will render your fields in the order that they are described within
your schema.  

<div id="field1"></div>
{% raw %}
<script type="text/javascript" id="field1-script">
$("#field1").alpaca({
  "schema": {
    "title": "Names",
    "type": "object",
    "properties": {
      "name1": {
        "type": "string",
        "title": "Name1",
        "required": true
      },
      "name2": {
        "type": "string",
        "title": "Name2",
        "required": true
      },
      "name3": {
        "type": "string",
        "title": "Name3",
        "required": true
      },
      "name4": {
        "type": "string",
        "title": "Name4",
        "required": true
      },
      "name5": {
        "type": "string",
        "title": "Name5",
        "required": true
      },
      "name6": {
        "type": "string",
        "title": "Name6",
        "required": true
      },
      "name7": {
        "type": "string",
        "title": "Name7",
        "required": true
      },
      "name8": {
        "type": "string",
        "title": "Name8",
        "required": true
      },
      "name9": {
        "type": "string",
        "title": "Name9",
        "required": true
      },
      "name10": {
        "type": "string",
        "title": "Name10",
        "required": true
      },
      "name11": {
        "type": "string",
        "title": "Name11",
        "required": true
      }
    }
  } 
});</script>
{% endraw %}

## Use the <code>order</code> option to specify rendering order

The precise order of properties can be configured using the <code>order</code> option.

<div id="field2"></div>
{% raw %}
<script type="text/javascript" id="field2-script">
$("#field2").alpaca({
  "schema": {
    "title": "Names",
    "type": "object",
    "properties": {
      "name1": {
        "type": "string",
        "title": "Name1",
        "required": true
      },
      "name2": {
        "type": "string",
        "title": "Name2",
        "required": true
      },
      "name3": {
        "type": "string",
        "title": "Name3",
        "required": true
      },
      "name4": {
        "type": "string",
        "title": "Name4",
        "required": true
      },
      "name5": {
        "type": "string",
        "title": "Name5",
        "required": true
      },
      "name6": {
        "type": "string",
        "title": "Name6",
        "required": true
      },
      "name7": {
        "type": "string",
        "title": "Name7",
        "required": true
      },
      "name8": {
        "type": "string",
        "title": "Name8",
        "required": true
      },
      "name9": {
        "type": "string",
        "title": "Name9",
        "required": true
      },
      "name10": {
        "type": "string",
        "title": "Name10",
        "required": true
      },
      "name11": {
        "type": "string",
        "title": "Name11",
        "required": true
      }
    }
  },
  "options": {
    "fields": {
      "name1": {
        "order": 11
      },
      "name2": {
        "order": 10
      },
      "name3": {
        "order": 9
      },
      "name4": {
        "order": 8
      },
      "name5": {
        "order": 7
      },
      "name6": {
        "order": 6
      },
      "name7": {
        "order": 5
      },
      "name8": {
        "order": 4
      },
      "name9": {
        "order": 3
      },
      "name10": {
        "order": 2
      },
      "name11": {
        "order": 1
      }
    }
  } 
});</script>
{% endraw %}


## Use a Template to layout fields

See <a href="/docs/api/templates.html">Templates</a> for more information on using custom templates to take full control over
the layout of your forms.