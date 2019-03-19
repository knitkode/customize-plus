---
title: Panels
---

# Panels

For the time being Customize Plus adds only a `dashicon` argument to the native WordPress implementation.
See the [base panel schema](panels/base#schema)

## Other features

> Included only in [Customize Plus Premium](/products/customize-plus-premium)

- reset all panel values to the factory state or to the initial session value, prompt for a confirmation.

## Example

```php
array(
  'subject' => 'panel',
  'id' => 'panel-id',
  'title' => __( 'Layout', 'textdomain' ),
  'type' => 'kkcp_panel',
  'dashicon' => 157,
  'sections' => array(
    // here the sections arrays
  ),
)
```