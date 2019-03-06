---
title: Introduction
---

> This document is a draft currently under improvement

## Foreword

Since the slight confusion that can arise using the normally interchangeable names of `setting` and `option` in relation to the WordPress APIs, here is a preliminary clarification on how we intend and use these terms.
We use `settings` to describe at the same time both theme_mods and options, so both the ones you get from the `get_theme_mod` and the ones got from the `get_option` WordPress functions. The words `theme_mod` or `mods` are used only for the former, and `options` only for the latter.

By the default every setting declared through Customize Plus use the [Theme Mods API](https://codex.wordpress.org/Theme_Modification_API), you can anyway set a setting to use the [Options API](https://codex.wordpress.org/Options_API) by specifying in the setting args `'type' => 'option'`.
Customize Plus provide only 4 global functions: `kk_get_option`, `kk_get_theme_mod` and `kk_get_theme_mods` which behaves exactly as the respective WordPress functions (same names but unprefixed), with the only difference that these always return automatically the default value you have set it in the customize tree as default. The last global function is kk_get_option_id that, given a simple id such as `color-header` returns the real and full setting id `themeprefix[color-header]`, in use when that setting uses the Options API.

All the settings defined as `options`, will be available in an array under a single namespace defined through the `add_theme_support` API under the key `theme_prefix`.
This behavior follows the WordPress best practices.

## Theme support

Customize Plus take advantage of the [Theme Support API](https://developer.wordpress.org/reference/functions/add_theme_support/) to put you in control over its behavior.
All the configuration of Customize Plus must be defined under a single array passed under the theme_support key named `kkcp-customize`. Here's a snippet to get you started, or you can look at the [Demo Theme](https://github.com/knitkode/customize-plus-demo):

```php
add_action( 'after_setup_theme', 'my_theme_supports' ) );

function my_theme_supports() {
  add_theme_support( 'kkcp-customize', array(
    'prefix' => 'mytheme',
    'customize_tree' => array(), // this should return a customize tree array
    'images_base_url' => get_stylesheet_directory_uri() . '/images/',
  ) );
}
```

Here is a breakdown of each argument you can or must pass to the support array:

1. `theme_prefix` {string} (mandatory): is responsible for prefixing your settings defined as Options
2. `customize_tree` {Array} (mandatory): contains all your theme settings customizable through the Customize Screen. See [how to structure your customize tree](@@todolink).
3. `images_base_url` {string} (optional) @@todocheck: defines the base URL path to your custom images you might use in the customize tree
4. `docs_base_url` {string} (optional) @@todocheck: defines the base URL path to your docs website to prepend to the documentation links you might use in the customize tree
5. `dynamic_controls_rendering` {bool} (optional): if `true` Customize Plus Controls in the Customize screen will be rendered "on demand", that is only when their section is open. This is opt-in for now.

Customize Plus Premium only:
6. `styles` {Array} (optional): this is mandatory only if you want to take advantage of the [Compiler Component](@@todolink) to write and customize your theme stylesheets. Each style must be defined with a key and an array with the following arguments:
  a. `path` {string} (mandatory): @@todoidontremember
7. `components` {Array} (optional): Define the support of each Customize Plus Premium [components](@@todolink). Each component array has as key the component id and can its value must be a string set to:
  a. `required`: alway forces the activation of the component and prevent users to disable it.
  b. `recommended`: forces the activation of the component on theme activation but then allow users to disable it.
  c. `optional`: do not forces the activation of the component on theme activation and always allow users to disable it.
  d. `blocked`: always deactivate the component, users will not be able to enable it

## Custom controls

Each custom control's default setting can be resetted in three ways:

- `Reset to last saved value` which restore the setting value to the last saved one. So pressing the Save button while  you're customizing your website will change the effect of this reset action.
- `Reset to initial session value` which brings the setting to the value it had when the Customize page has loaded. The difference with the above reset action is that this does not care about the different values that have been stored when pressing the Save button, it will always reset to the value as it was when the page has just loaded, which should also be the last value stored in the database before opening the Customize screen.
- `Reset to factory value`. This brings the setting value to its default value as defined by your current theme developers.
