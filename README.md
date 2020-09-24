# vue-vuex-1 - Vue V2

**Basic**
- Getters are NOT for manipulating state, they are essentially computed for the store


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