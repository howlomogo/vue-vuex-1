<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Mapstate / Home</router-link> |
      <router-link to="/basic">Basic</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/getters">Getters</router-link> |
      <router-link to="/mutations">Mutations</router-link> |
      <router-link to="/actions">Actions</router-link> |
      <router-link to="/modules">Modules</router-link> |
      <router-link to="/form-handling">Form Handling</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
