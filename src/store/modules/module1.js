// Modules local state
const defaultState = {
    users: [],
    count: 100
}

const actions = {
    // Lets fake an API response but pass in as a param what we
    // Want returned in the method on component
    getUsers: ({ commit, state, rootState }, users) => {
        console.log('getUsers')
        console.log('state', state) // Local state ^ is state inside module
        console.log('rootState count', rootState.count) // We can get rootState by using context.rootState
        console.log('state count', state.count) // We can get rootState by using context.rootState

        // Fake api call returning users
        setTimeout(() => {
            commit('UPDATE_USERS', users)
        }, 2000)
    },
    // To dispatch actions or commit mutations in the global namespace, pass { root: true } as the 3rd argument to dispatch and commit
    someOtherAction: ({ dispatch, commit }) => {
        // { dispatch, commit, getters, rootGetters}
        //context.getters.someOtherGetterModule1  // = module1/someOtherGetterModule1
        //context.rootGetters.doneTodos // = doneTodos (in index.js)
        //rootGetters['module2/someOtherGetterModule2'] // -> 'module2/someOtherGetterModule2'

        // dispatch('someOtherAction2') // = module1/someOtherAction2

        // 
        dispatch('increment', null, { root: true }) // 'increment' from root (index.js), payload is 2nd param

        // commit('UPDATE_USERS', ['fwefe' 'fewfew']) // = module1/UPDATE_USERS
        commit('increment2', { amount: 50 }, { root: true }) // = call 'increment2' mutation in index.js
    },
    someOtherAction2: (context) => {
        console.log('SomeOtherAction2' + context)
    }
}

const mutations = {
    UPDATE_USERS: (state, payload) => {
        console.log(payload)
        state.users = payload
    }
}

const getters = {
    // Inside a module rootState is the 3rd argument, rootGetter is 4th
    // You can access getters from the root and other modules
    getRootstatePlusStateCount: function(state, getters, rootState) { 
        // (state, getters, rootState, rootGetter) - ARGS
        //getters.someOtherGetterModule1  // = module1/getUsers
        //rootGetters.doneTodos // = doneTodos (in index.js)
        //rootGetters['module2/someOtherGetterModule2'] // -> 'module2/someOtherGetterModule2'
        console.log(typeof state.count)
        console.log(rootState)

        return state.count + rootState.count
    },
    someOtherGetterModule1: state => {
        console.log('someOtherGetterModule1' + state)
    }
}

// I don't see any reason to not namespace a module ever?
export default {
    namespaced: true, // If this WASN'T namespaced we would not use module1/whatever to call getters state etc in component
    actions,
    getters,
    mutations,
    state: defaultState
}


// you can pass the module namespace string as the first argument to the helpers so that all bindings are done using that module as the context
// computed: {
//     ...mapState('some/nested/module', {
//       a: state => state.a,
//       b: state => state.b
//     }),
//     ...mapGetters('some/nested/module', [
//       'someGetter', // -> this.someGetter
//       'someOtherGetter', // -> this.someOtherGetter
//     ])
//   },
//   methods: {
//     ...mapActions('some/nested/module', [
//       'foo', // -> this.foo()
//       'bar' // -> this.bar()
//     ])
//   }

// you can also create namespaced helpers by using createNamespacedHelpers. It returns an object having new component binding helpers that are bound with the given namespace value:
// import { createNamespacedHelpers } from 'vuex'

// const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

// export default {
//   computed: {
//     // look up in `some/nested/module`
//     ...mapState({
//       a: state => state.a,
//       b: state => state.b
//     })
//   },
//   methods: {
//     // look up in `some/nested/module`
//     ...mapActions([
//       'foo',
//       'bar'
//     ])
//   }
// }