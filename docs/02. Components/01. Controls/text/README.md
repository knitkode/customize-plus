---
title: Text
image: ./screencast.gif
<!-- image: ./screenshot.png -->
---

# Text

> Text controls and their variations

![screenshot](./screenshot.png)

## Schema

<schema></schema>

## Examples

```php
'field-id' => array(
  'setting' => array(
    'default' => 'Some text',
    'transport' => 'postMessage',
  ),
  'control' => array(
    'label' => __( 'Text', 'textdomain' ),
    'description' => __( 'A text field.', 'textdomain' ),
    'type' => 'kkcp_text',
    'input_attrs' => array(
      'maxlength' => 15,
      'type' => 'email',
    ),
  )
),
```

## Screenshots

![screencast](./screencast.gif)

<!--
## Args

| arg             | subargs       | type    | supported values            | default        | required |
| :-------------- | :------------ | :------ | :-------------------------- | :------------- | :------- |
| `'optional'`    |               | boolean |                             | `false`        | -        |
| `'label'`       |               | string  |                             | `''`           | ✔        |
| `'description'` |               | string  |                             | `''`           | -        |
| `'type'`        |               | string  |                             | `'kkcp_text'` | ✔        |
| `'input_attrs'` |               | array   |                             | `array()`      | -        |
|                 | `'maxlength'` | number  | 1->...                      | `''`           | -        |
|                 | `'type'`      | string  | `'email'`,`'url'`, `'text'` | `'text'`       | -        |
 -->
