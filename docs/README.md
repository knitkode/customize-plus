---
title: Customize Plus
description: Official documentation
---

### What is Customize Plus?
Customize Plus is a WordPress plugin to streamline the development experience for WordPres themes developers who want to build rich user experiences with minimal code.

### Should you use Customize Plus?
Our target is WordPress developers building complex themes or plugins that require dozens of controls in the customizer, complex CSS generation based on the values of those controls, live-updating the customizer preview without a refresh (using postMessage) and other features that Kirki includes.

If you do not have an understanding of PHP, JS, the WordPress Customizer and its APIs you should not use Kirki.

Getting Started
The first thing you should do is decide how you are going to distribute and integrate Kirki with your project. You can read more about that in this article.

The next step is to create a configuration. The ID you choose for your config has to be unique and will be used to differentiate your project from other projects that may be using Kirki on the same site (since Kirki can be used not only by themes but also plugins).

After you create your config you can start adding panels and sections, or if you already have some sections you have created via the WordPress Customizer API move directly to adding controls.

