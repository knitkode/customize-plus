export const addComponentsOnWordPressAPI = (namespace, components, constructorName) => {
  for (const name in components) {
    if (components.hasOwnProperty(name)) {
      const component = components[name];
      if (component.onWpConstructor) {
        const fullType = `${namespace}_${component.type}`
        wp.customize[constructorName][fullType] = component
      }
    }
  }
}
