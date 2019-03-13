---
title: Introduction
---

# Introduction

> This document is a draft currently under improvement

## Terminology

Some preliminary distinctions:

### Settings: Theme mods vs Options

Since the slight confusion that can arise using the normally interchangeable names of `setting` and `option` in relation to the WordPress APIs, here is a preliminary clarification on how we intend and use these terms.
We use `settings` to describe at the same time both [theme_mods](https://codex.wordpress.org/Theme_Modification_API) and [options](https://codex.wordpress.org/Options_API), so both the ones you get from the `get_theme_mod` and the ones got from the `get_option` WordPress functions. The words `theme_mod` or `mods` are used only for the former, and `options` only for the latter.

By the default every setting declared through Customize Plus use the [Theme Mods API](https://codex.wordpress.org/Theme_Modification_API), you can anyway set a setting to use the [Options API](https://codex.wordpress.org/Options_API) by specifying in the setting args `'type' => 'option'` ([see settings base schema](/docs/customize-plus/components/settings/base)).
Customize Plus provide only 4 global functions: `kk_get_option`, `kk_get_theme_mod` and `kk_get_theme_mods` which behaves exactly as the respective WordPress functions (same names but unprefixed), with the only difference that these always return automatically the default value you have set it in the customize tree as default. The last global function is kk_get_option_id that, given a simple id such as `color-header` returns the real and full setting id `themeprefix[color-header]`, in use when that setting uses the Options API.

All the settings defined as `options`, will be available in an array under a single namespace defined through the `add_theme_support` API under the key `theme_prefix`.
This behavior follows the WordPress best practices.
