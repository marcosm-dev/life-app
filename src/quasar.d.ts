/* eslint-disable */

// Forces TS to apply `@quasar/app-vite` augmentations of `quasar` package
// Removing this would break `quasar/wrappers` imports as those typings are declared
//  into `@quasar/app-vite`
// As a side effect, since `@quasar/app-vite` reference `quasar` to augment it,
//  this declaration also apply `quasar` own
//  augmentations (eg. adds `$q` into Vue component context)
/// <reference types="@quasar/app-vite" />

// src/quasar.d.ts

declare module '@quasar/app' {
  interface QuasarHTMLElement extends HTMLElement {
    $el: HTMLElement;
    // Agrega otras propiedades específicas de Quasar si es necesario
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $q: {
      // Define las propiedades y métodos específicos de Quasar que necesitas
    };
  }
}
