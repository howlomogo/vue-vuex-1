# vue-vuex-1 - Vue V2

**Basic**
- Getters are NOT for manipulating state, they are essentially computed for the store
- You should NOT use Asycronus tasks within Mutations (Use Actions for this)
- Mutations MUST be sycronus

You cannot directly mutate the store's state. The only way to change a store's state is by explicitly committing mutations. This ensures every state change leaves a track-able record, and enables tooling that helps us better understand our applications.

In order to have an access to this.$store property in your Vue components, you need to provide the created store to Vue instance. Vuex has a mechanism to "inject" the store into all child components from the root component with the store option:
```
new Vue({
  el: '#app',
  store: store,
})
```

**The reason we are committing a mutation instead of changing store directly, is because we want to explicitly track it. This simple convention makes your intention more explicit, so that you can reason about state changes in your app better when reading the code. In addition, this gives us the opportunity to implement tools that can log every mutation, take state snapshots, or even perform time travel debugging.**
(It does seem possible to update state directly from a component, but don't do this)

Getting Vuex State into Vue Components
Since Vuex stores are reactive, the simplest way to "retrieve" state from it is simply returning some store state from within a computed property:
```
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

The mapState Helper - ** This essentially looks like mapStateToProps WITH GETTERS in redux **
When a component needs to make use of multiple store state properties or getters, declaring all these computed properties can get repetitive and verbose. To deal with this we can make use of the mapState helper which generates computed getter functions for us, saving us some keystrokes:

```
// in full builds helpers are exposed as Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // arrow functions can make the code very succinct!
    count: state => state.count,

    // passing the string value 'count' is same as `state => state.count`
    countAlias: 'count',

    // to access local state with `this`, a normal function must be used
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

We can also pass a string array to mapState when the name of a mapped computed property is the same as a state sub tree name.
```
computed: mapState([
  // map this.count to store.state.count
  'count'
])
```

Object Spread Operator
Note that mapState returns an object. How do we use it in combination with other local computed properties? Normally, we'd have to use a utility to merge multiple objects into one so that we can pass the final object to computed. However with the object spread operator, we can greatly simplify the syntax:
```
computed: {
  localComputed () { /* ... */ },
  // mix this into the outer object with the object spread operator
  ...mapState({
    // ...
  })
}
```

Components Can Still Have Local State (Don't see why that would be a good idea though..)
Using Vuex doesn't mean you should put all the state in Vuex. Although putting more state into Vuex makes your state mutations more explicit and debuggable, sometimes it could also make the code more verbose and indirect. If a piece of state strictly belongs to a single component, it could be just fine leaving it as local state. You should weigh the trade-offs and make decisions that fit the development needs of your app.

# Getters (Essentially computed properties for stores)
You can set these instead of computed if you have say repeated computed properties in multiple components. Remember computed and getters are NOT for setting state, but just returning things based on data/state. a good example would be if we needed to count the amount of todos done in various components.
We would have to repeat this multiple times
```
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```

Where as we could put this in a getter
```
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```
This would then be exposed on the
```
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Getters also recieve other getter as the 2nd argument, so in the above example you could do to get the count of the returned value from doneTodos
```
getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
store.getters.doneTodosCount // -> 1
```

You can now easily make use of it inside any component:
```
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```
Note that getters accessed as properties are cached as part of Vue's reactivity system.

# Method-Style Access
You can also pass arguments to getters by returning a function. This is particularly useful when you want to query an array in the store:
```
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
```
```
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```
Note that getters accessed via methods will run each time you call them, and the result is not cached.

The mapGetters Helper - (Seems essentially like, mapDispatchToProps WITH GETTERS)
The mapGetters helper simply maps store getters to local computed properties:
```
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

If you want to map a getter to a different name, use an object:
```
...mapGetters({
  // map `this.doneCount` to `this.$store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```

# Mutations
The only way to actually change state in a Vuex store is by committing a mutation. Vuex mutations are very similar to events: each mutation has a string type and a handler. The handler function is where we perform actual state modifications, and it will receive the state as the first argument:

- As in Redux always initialize your store's initial state with all desired fields upfront.


```
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // mutate state
      state.count++
    }
  }
})
```
You cannot directly call a mutation handler. Think of it more like event registration: "When a mutation with type increment is triggered, call this handler." To invoke a mutation handler, you need to call store.commit with its type:
```
store.commit('increment')
```

# Commit with Payload
You can pass an additional argument to store.commit, which is called the payload for the mutation:
```
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```
```
store.commit('increment', 10)
```
In most cases, the payload should be an object so that it can contain multiple fields, and the recorded mutation will also be more descriptive:
```
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```
```
store.commit('increment', {
  amount: 10
})
```

# Object-Style Commit
An alternative way to commit a mutation is by directly using an object that has a type property:
```
store.commit({
  type: 'increment',
  amount: 10
})
```
When using object-style commit, the entire object will be passed as the payload to mutation handlers, so the handler remains the same:
```
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

# Mutations Follow Vue's Reactivity Rules
- Prefer initializing your store's initial state with all desired fields upfront.

When you have to add new properties to an Object, you should either:
```
Use Vue.set(obj, 'newProp', 123), or
```

Replace that Object with a fresh one. For example, using the object spread syntax we can write it like this:
```
state.obj = { ...state.obj, newProp: 123 }
```

# Using Constants for Mutation Types
It is a commonly seen pattern to use constants for mutation types in various Flux implementations. This allows the code to take advantage of tooling like linters, and putting all constants in a single file allows your collaborators to get an at-a-glance view of what mutations are possible in the entire application:
```
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```
```
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // we can use the ES2015 computed property name feature
    // to use a constant as the function name
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```
Whether to use constants is largely a preference - it can be helpful in large projects with many developers, but it's totally optional if you don't like them.


# Mutations Must Be Synchronous
One important rule to remember is that mutation handler functions must be synchronous. Why? Consider the following example:
```
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```
Now imagine we are debugging the app and looking at the devtool's mutation logs. For every mutation logged, the devtool will need to capture a "before" and "after" snapshots of the state. However, the asynchronous callback inside the example mutation above makes that impossible: the callback is not called yet when the mutation is committed, and there's no way for the devtool to know when the callback will actually be called - any state mutation performed in the callback is essentially un-trackable!

# Committing Mutations in Components
You can commit mutations in components with this.$store.commit('xxx'), or use the mapMutations helper which maps component methods to store.commit calls (requires root store injection):
```
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // map `this.increment()` to `this.$store.commit('increment')`

      // `mapMutations` also supports payloads:
      'incrementBy' // map `this.incrementBy(amount)` to `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // map `this.add()` to `this.$store.commit('increment')`
    })
  }
}
```

# Actions
- ACTIONS MUST BE USED FOR ASYNCHRONOUS OPERATIONS - mutations CANT NOT BE USED FOR ASYNCHROUS OPERATIONS
- ^ IF it's not asynchronous just use a mutation.
- Actions are triggered with the store.dispatch method
- context is a object which exposed the same methods and properties of the store instance. Such as commit, dispatch, state, getters.
- You can use argument destructuring if you just need one type of method. i.e. 'increment ({ commit })' <- action

Actions are similar to mutations, the differences being that:
Instead of mutating the state, actions commit mutations.
Actions can contain arbitrary asynchronous operations.
Let's register a simple action:
```
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```
Action handlers receive a context object which exposes the same set of methods/properties on the store instance, so you can call context.commit to commit a mutation, or access the state and getters via context.state and context.getters. We can even call other actions with context.dispatch. We will see why this context object is not the store instance itself when we introduce Modules later.

In practice, we often use ES2015 argument destructuring to simplify the code a bit (especially when we need to call commit multiple times):
```
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```
# Dispatching Actions
Actions are triggered with the store.dispatch method:
```
store.dispatch('increment')
```
This may look silly at first sight: if we want to increment the count, why don't we just call store.commit('increment') directly? Remember that mutations have to be synchronous. Actions don't. We can perform asynchronous operations inside an action:
```
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```
Actions support the same payload format and object-style dispatch:
```
// dispatch with a payload
store.dispatch('incrementAsync', {
  amount: 10
})
```
```
// dispatch with an object
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

**A more practical example of real-world actions would be an action to checkout a shopping cart, which involves calling an async API and committing multiple mutations:**
```
actions: {
  checkout ({ commit, state }, products) {
    // save the items currently in the cart
    const savedCartItems = [...state.cart.added]
    // send out checkout request, and optimistically
    // clear the cart
    commit(types.CHECKOUT_REQUEST)
    // the shop API accepts a success callback and a failure callback
    shop.buyProducts(
      products,
      // handle success
      () => commit(types.CHECKOUT_SUCCESS),
      // handle failure
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
^^^ Look at mutation types how this is done, seems similar pattern to recucers

```
Note we are performing a flow of asynchronous operations, and recording the side effects (state mutations) of the action by committing them.

# Dispatching Actions in Components
You can dispatch actions in components with this.$store.dispatch('xxx'), or use the mapActions helper which maps component methods to store.dispatch calls (requires root store injection):
```
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // map `this.increment()` to `this.$store.dispatch('increment')`

      // `mapActions` also supports payloads:
      'incrementBy' // map `this.incrementBy(amount)` to `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // map `this.add()` to `this.$store.dispatch('increment')`
    })
  }
}
```

# Composing Actions - (Promise / Async/Await)
Actions are often asynchronous, so how do we know when an action is done? And more importantly, how can we compose multiple actions together to handle more complex async flows?

**The first thing to know is that store.dispatch can handle Promise returned by the triggered action handler and it also returns Promise:**
```
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```
Now you can do:
```
store.dispatch('actionA').then(() => {
  // ...
})
```
And also in another action:
```
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

Finally, if we make use of async / await, we can compose our actions like this:
```
// assuming `getData()` and `getOtherData()` return Promises

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // wait for `actionA` to finish
    commit('gotOtherData', await getOtherData())
  }
}
```

It's possible for a store.dispatch to trigger multiple action handlers in different modules. In such a case the returned value will be a Promise that resolves when all triggered handlers have been resolved.


# Modules
Due to using a single state tree, all states of our application are contained inside one big object. However, as our application grows in scale, the store can get really bloated.

To help with that, Vuex allows us to divide our store into modules. Each module can contain its own state, mutations, actions, getters, and even nested modules - it's fractal all the way down:
```
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> `moduleA`'s state
store.state.b // -> `moduleB`'s state
```

# Module Local State
Inside a module's mutations and getters, the first argument received will be the module's local state.
```
const moduleA = {
  state: () => ({
    count: 0
  }),
  mutations: {
    increment (state) {
      // `state` is the local module state
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

Similarly, inside module actions, context.state will expose the local state, and root state will be exposed as context.rootState:
```
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

Also, inside module getters, the root state will be exposed as their 3rd argument:
```
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

# Namespacing
By default, actions, mutations and getters inside modules are still registered under the global namespace - this allows multiple modules to react to the same mutation/action type.

If you want your modules to be more self-contained or reusable, you can mark it as namespaced with namespaced: true. When the module is registered, all of its getters, actions and mutations will be automatically namespaced based on the path the module is registered at. For example:
```
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // module assets
      state: () => ({ ... }), // module state is already nested and not affected by namespace option
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // nested modules
      modules: {
        // inherits the namespace from parent module
        myPage: {
          state: () => ({ ... }),
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // further nest the namespace
        posts: {
          namespaced: true,

          state: () => ({ ... }),
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

Namespaced getters and actions will receive localized getters, dispatch and commit. In other words, you can use the module assets without writing prefix in the same module. Toggling between namespaced or not does not affect the code inside the module.

# Accessing Global Assets in Namespaced Modules
If you want to use global state and getters, rootState and rootGetters are passed as the 3rd and 4th arguments to getter functions, and also exposed as properties on the context object passed to action functions.

To dispatch actions or commit mutations in the global namespace, pass { root: true } as the 3rd argument to dispatch and commit.
```
modules: {
  foo: {
    namespaced: true,

    getters: {
      // `getters` is localized to this module's getters
      // you can use rootGetters via 4th argument of getters
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
        rootGetters['bar/someOtherGetter'] // -> 'bar/someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // dispatch and commit are also localized for this module
      // they will accept `root` option for the root dispatch/commit
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'
        rootGetters['bar/someGetter'] // -> 'bar/someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

# Register Global Action in Namespaced Modules
https://vuex.vuejs.org/guide/modules.html#register-global-action-in-namespaced-modules
If you want to register global actions in namespaced modules, you can mark it with root: true and place the action definition to function handler. For example:
```
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}
```

# Binding Helpers with Namespace
When binding a namespaced module to components with the mapState, mapGetters, mapActions and mapMutations helpers, it can get a bit verbose:
```
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  }),
  ...mapGetters([
    'some/nested/module/someGetter', // -> this['some/nested/module/someGetter']
    'some/nested/module/someOtherGetter', // -> this['some/nested/module/someOtherGetter']
  ])
},
methods: {
  ...mapActions([
    'some/nested/module/foo', // -> this['some/nested/module/foo']()
    'some/nested/module/bar' // -> this['some/nested/module/bar']()
  ])
}
```

In such cases, you can pass the module namespace string as the first argument to the helpers so that all bindings are done using that module as the context. The above can be simplified to:
```
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  }),
  ...mapGetters('some/nested/module', [
    'someGetter', // -> this.someGetter
    'someOtherGetter', // -> this.someOtherGetter
  ])
},
methods: {
  ...mapActions('some/nested/module', [
    'foo', // -> this.foo()
    'bar' // -> this.bar()
  ])
}
```

Furthermore, you can create namespaced helpers by using createNamespacedHelpers. It returns an object having new component binding helpers that are bound with the given namespace value:
```
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // look up in `some/nested/module`
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // look up in `some/nested/module`
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

# Caveat for Plugin Developers
You may care about unpredictable namespacing for your modules when you create a plugin that provides the modules and let users add them to a Vuex store. Your modules will be also namespaced if the plugin users add your modules under a namespaced module. To adapt this situation, you may need to receive a namespace value via your plugin option:
```
// get namespace value via plugin option
// and returns Vuex plugin function
export function createPlugin (options = {}) {
  return function (store) {
    // add namespace to plugin module's types
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

# Dynamic Module Registration
You can register a module after the store has been created with the store.registerModule method:
```
import Vuex from 'vuex'

const store = new Vuex.Store({ /* options */ })

// register a module `myModule`
store.registerModule('myModule', {
  // ...
})

// register a nested module `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

The module's state will be exposed as store.state.myModule and store.state.nested.myModule.

Dynamic module registration makes it possible for other Vue plugins to also leverage Vuex for state management by attaching a module to the application's store. For example, the vuex-router-sync library integrates vue-router with vuex by managing the application's route state in a dynamically attached module.

You can also remove a dynamically registered module with store.unregisterModule(moduleName). Note you cannot remove static modules (declared at store creation) with this method.

Note that you may check if the module is already registered to the store or not via store.hasModule(moduleName) method.

# Preserving state
It may be likely that you want to preserve the previous state when registering a new module, such as preserving state from a Server Side Rendered app. You can achieve this with preserveState option: store.registerModule('a', module, { preserveState: true })

When you set preserveState: true, the module is registered, actions, mutations and getters are added to the store, but the state is not. It's assumed that your store state already contains state for that module and you don't want to overwrite it.

# Module Reuse
Sometimes we may need to create multiple instances of a module, for example:

Creating multiple stores that use the same module (e.g. To avoid stateful singletons in the SSR when the runInNewContext option is false or 'once');
Register the same module multiple times in the same store.
If we use a plain object to declare the state of the module, then that state object will be shared by reference and cause cross store/module state pollution when it's mutated.

This is actually the exact same problem with data inside Vue components. So the solution is also the same - use a function for declaring module state (supported in 2.3.0+):
```
const MyReusableModule = {
  state: () => ({
    foo: 'bar'
  }),
  // mutations, actions, getters...
}
```

# Application Structure
Vuex doesn't really restrict how you structure your code. Rather, it enforces a set of high-level principles:

Application-level state is centralized in the store.

The only way to mutate the state is by committing mutations, which are synchronous transactions.

Asynchronous logic should be encapsulated in, and can be composed with actions.

As long as you follow these rules, it's up to you how to structure your project. If your store file gets too big, simply start splitting the actions, mutations and getters into separate files.

For any non-trivial app, we will likely need to leverage modules. Here's an example project structure:
```
├── index.html
├── main.js
├── api
│   └── ... # abstractions for making API requests
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # where we assemble modules and export the store
    ├── actions.js        # root actions
    ├── mutations.js      # root mutations
    └── modules
        ├── cart.js       # cart module
        └── products.js   # products module
```

# Plugins (Come back to this, when needed)
https://vuex.vuejs.org/guide/plugins.html

# Strict Mode (BAsically always have this true)
To enable strict mode, simply pass in strict: true when creating a Vuex store:
```
const store = new Vuex.Store({
  // ...
  strict: true
})
```
In strict mode, whenever Vuex state is mutated outside of mutation handlers, an error will be thrown. This ensures that all state mutations can be explicitly tracked by debugging tools.

# Development vs. Production
Do not enable strict mode when deploying for production! Strict mode runs a synchronous deep watcher on the state tree for detecting inappropriate mutations, and it can be quite expensive when you make large amount of mutations to the state. Make sure to turn it off in production to avoid the performance cost.

Similar to plugins, we can let the build tools handle that:

const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})

# Form Handling
When using Vuex in strict mode, it could be a bit tricky to use v-model on a piece of state that belongs to Vuex:
```
<input v-model="obj.message">
```

Assuming obj is a computed property that returns an Object from the store, the v-model here will attempt to directly mutate obj.message when the user types in the input. In strict mode, this will result in an error because the mutation is not performed inside an explicit Vuex mutation handler.

The "Vuex way" to deal with it is binding the <input>'s value and call a method on the input or change event:
```
<input :value="message" @input="updateMessage">
// ...
computed: {
  ...mapState({
    message: state => state.obj.message
  })
},
methods: {
  updateMessage (e) {
    this.$store.commit('updateMessage', e.target.value)
  }
}
```
And here's the mutation handler:
```
// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```

# Two-way Computed Property
Admittedly, the above is quite a bit more verbose than v-model + local state, and we lose some of the useful features from v-model as well. An alternative approach is using a two-way computed property with a setter:
```
<input v-model="message">
// ...
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```