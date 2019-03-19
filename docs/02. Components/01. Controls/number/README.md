---
title: Number
---

# Number

## Schema

<schema></schema>

## Examples

```php
'field-id' => array(
  'setting' => array(
    'default' => 14,
    'transport' => 'postMessage',
  ),
  'control' => array(
    'label' => __( 'Number', 'textdomain' ),
    'description' => __( 'A number field.', 'textdomain' ),
    'type' => 'kkcp_number', // required
    'input_attrs' => array( // optional
      'min' => 3 // default: null,
      'max' => 17 // default: null,
      'step' => 5 // default: null,
    ),
  )
),
```
