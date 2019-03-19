---
title: Multicheck
---

# Multicheck

## Schema

<schema></schema>

## Examples

```php
'field-id' => array(
  'setting' => array(
    'default' => json_encode( array( 'apple', 'orange', 'mango' ) ),
    'transport' => 'postMessage',
  ),
  'control' => array(
    'label' => __( 'Social share', 'textdomain' ),
    'description' => __( 'Select some fruits', 'textdomain' ),
    'type' => 'kkcp_multicheck',
    'choices' => array(
      'apple' => __( 'Apple', 'textdomain' ),
      'lemon' => __( 'Lemon', 'textdomain' ),
      'orange' => __( 'Orange', 'textdomain' ),
      'grape' => __( 'Grape', 'textdomain' ),
      'mango' => __( 'Mango', 'textdomain' ),
    ),
  )
)
```
