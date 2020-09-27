import Vue from 'vue'
import Vuex from 'vuex'

// import store modules
import module1 from './modules/module1'
import module2 from './modules/module2'

Vue.use(Vuex)

export default new Vuex.Store({
  // Always have strict mode on in development to detect mutations not done properly
  // NEVER have strict mode on in production as very expensive will affect performance
  strict: process.env.NODE_ENV !== 'production',
  state: {
    count: 0,
    count2: 0,
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ],
    message: 'hello'
  },
  modules: {
    module1: module1,
    module2: module2
  },
  mutations: {
    increment (state) {
      state.count++
    },
    increment2 (state, payload) {
      console.log('Payload in increment2 mutation', payload)
      state.count2 += payload.amount
    },
    // For form handling simple update
    updateMessage (state, message) {
      state.message = message
    }
    // You can pass in one argument as below but I would always pass as a payload object, no reason to do it like below.
    // increment2 (state, n) {
    //   state.count2 += n
    // }
  },
  actions: {
    // increment ({ commit }) {
    //   commit('increment') // You can use argument destructuring
    // },
    increment (context) {
      context.commit('increment')
    },
    incrementAction1 ({ commit }) {
      // Take API call, in this situation we would NOT want to call mutation right away
      setTimeout(() => {
        commit('increment')
      }, 2000)
    },
    // You can accept payloads like in mutations etc
    incrementWithPayload ({ commit }, payload) {
      console.log('Payload in incrementWithPayload Action', payload)
      commit('increment2', payload)
    },
    someMappedAction ({ commit }) {
      console.log('Some mapped action')
      setTimeout(() => {
        commit('increment2', { amount: 20 })
      }, 2000)
    }
  },
  getters: {
    // Return done todos without manipulating the state, getters good if being used in multiple components
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    },
    // Example of using getters as 2nd argument (Have access to all of them)
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length
    },
    todoById: (state) => (id) => {
      return state.todos.find(todo => todo.id ===id)
    }
  }
})
