import { createDecorator } from 'vue-facing-decorator';

export function namespace(moduleName: string) {
  return {
    State: (mapFn: (state: any) => any) => {
      return createDecorator((options, key) => {
        if (!options.computed) options.computed = {};
        options.computed[key] = function(this: any) {
          return mapFn(this.$store.state[moduleName]);
        };
      });
    },
    Action: (actionName: string) => {
      return createDecorator((options, key) => {
        if (!options.methods) options.methods = {};
        options.methods[key] = function(this: any, payload: any) {
          return this.$store.dispatch(`${moduleName}/${actionName}`, payload);
        };
      });
    },
    Mutation: (mutationName: string) => {
      return createDecorator((options, key) => {
        if (!options.methods) options.methods = {};
        options.methods[key] = function(this: any, payload: any) {
          return this.$store.commit(`${moduleName}/${mutationName}`, payload);
        };
      });
    },
    Getter: (getterName: string) => {
      return createDecorator((options, key) => {
        if (!options.computed) options.computed = {};
        options.computed[key] = function(this: any) {
          return this.$store.getters[`${moduleName}/${getterName}`];
        };
      });
    }
  };
}
