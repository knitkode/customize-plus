---
title: Theme integration
---

# Theme integration

Customize Plus take advantage of the [WordPress Theme Support API](https://developer.wordpress.org/reference/functions/add_theme_support/) to put you in control over its behaviour.
All the configuration of Customize Plus must be defined under a single array passed under the `theme_support` key named `kkcp-customize`. Here's a snippet to get you started, or you can look at the [Demo Theme](https://github.com/knitkode/customize-plus-demo):

```php
add_action( 'after_setup_theme', 'my_theme_supports' ) );

function my_theme_supports() {
  add_theme_support( 'kkcp-customize', array(
    'theme_prefix' => 'mytheme',
    'customize_tree' => array(), // this should return a customize tree array
    'images_base_url' => get_stylesheet_directory_uri() . '/images/',
  ) );
}
```

Here is a breakdown of each argument you *can* or *must* pass to the theme support array argument:

| name and description |   type   | required |
|:---------------------|:---------|----------|
| `theme_prefix` | `string` | ✓    |
| responsible for prefixing your settings defined as Options |
| `customize_tree` | `Array`  | ✓    |
| contains all your theme settings customizable through the Customize Screen. See [how to structure your customize tree](@@todolink) |
| `images_base_url` | `string` | - |
| @@todocheck: defines the base URL path to your custom images you might use in the customize tree |
| `docs_base_url` | `string` | - |
| @@todocheck defines the base URL path to your docs website to prepend to the documentation links you might use in the customize tree |
| `dynamic_controls_rendering` | `bool` | - |
| @@todocheck if `true` Customize Plus Controls in the Customize screen will be rendered "on demand", that is only when their section is open. This is opt-in for now |

<!--
| `theme_prefix`       | `string` |     ✓    |
| dddddddddddddddd |
 -->

<!-- 1. `theme_prefix` {string} (mandatory): is responsible for prefixing your settings defined as Options
2. `customize_tree` {Array} (mandatory): contains all your theme settings customizable through the Customize Screen. See [how to structure your customize tree](@@todolink).
3. `images_base_url` {string} (optional) @@todocheck: defines the base URL path to your custom images you might use in the customize tree
4. `docs_base_url` {string} (optional) @@todocheck: defines the base URL path to your docs website to prepend to the documentation links you might use in the customize tree
5. `dynamic_controls_rendering` {bool} (optional): if `true` Customize Plus Controls in the Customize screen will be rendered "on demand", that is only when their section is open. This is opt-in for now. -->

<!--
[Customize Plus Premium](/products/customize-plus-premium) **only**:

6. `styles` {Array} (optional): this is mandatory only if you want to take advantage of the [Compiler Component](@@todolink) to write and customize your theme stylesheets. Each style must be defined with a key and an array with the following arguments:
  a. `path` {string} (mandatory): @@todoidontremember
7. `components` {Array} (optional): Define the support of each Customize Plus Premium [components](@@todolink). Each component array has as key the component id and can its value must be a string set to:
  a. `required`: alway forces the activation of the component and prevent users to disable it.
  b. `recommended`: forces the activation of the component on theme activation but then allow users to disable it.
  c. `optional`: do not forces the activation of the component on theme activation and always allow users to disable it.
  d. `blocked`: always deactivate the component, users will not be able to enable it
 -->