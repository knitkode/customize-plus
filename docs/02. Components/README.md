---
title: Components
---

# Components

We collect in this section the links to implementations of Customize Plus custom:

- [Controls](components/controls)
- [Section](components/sections)
- [Panels](components/panels)
- [Settings](components/settings)

The terminology "*Components*" is just an abstraction used in the Customize Plus codebase to give a recognizable *type* to these four entities. Furthermore it conveys the idea of treating them as decoupled entities from a development perspective. Each **Control**, **Section**, **Panel**, **Setting** is in fact developed with a module like system that spans across their `php`, `js` and `css` implementations. Only internally there is a fifth entity called **Field** which groups a pair **Control->Setting**, you will encounter this terminology in [Customize Plus Builder](/products/customize-plus-builder). Customize Plus at the moment supports only single setting's controls (@@todotocheck and explain).
