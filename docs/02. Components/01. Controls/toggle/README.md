---
title: Toggle
---

# Toggle

## Schema

<schema></schema>

## Examples

```php
'field-id' => array(
  'setting' => array(
    'default' => 1, // Either 1 or 0
    'transport' => 'postMessage',
  ),
  'control' => array(
    'label' => __( 'Toggle', 'textdomain' ),
    'description' => __( 'Toggle on or off, 0 or 1', 'textdomain' ),
    'type' => 'kkcp_toggle', // required
  )
),
```
