---
title: Sections
---

# Sections

For the time being Customize Plus adds only a `dashicon` argument to the native WordPress implementation.
See the [base section schema](sections/base#schema)

## Other features

> Included only in [Customize Plus Premium](/products/customize-plus-premium)

- reset all section values to the factory state or to the initial session value, prompt for a confirmation.

## Example

```php
array(
  'subject' => 'section',
  'id' => 'section',
  'title' => __( 'Color controls', 'textdomain' ),
  'type' => 'kkcp_section',
  'dashicon' => 309,
  'fields' => array(
    // here the controls arrays
  ),
)
```
