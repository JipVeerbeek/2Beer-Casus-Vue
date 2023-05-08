<template>
  <div class="appNav">
    <ul>
      <li>
        <router-link class="linkNav" to="/home">Home</router-link>
      </li>
      <li>
        <router-link class="linkNav" to="/table">Table</router-link>
      </li>

      <li>
        <button v-if="name" style="display: none"></button>
        <router-link v-else class="linkNav" to="/signup">Signup</router-link>
      </li>
      <li>
        <button v-if="name" class="linkNav" @click="logout">Logout</button>
        <router-link v-else class="linkNav" to="/login">Login</router-link>
      </li>
      <li class="linkNavN">
        {{ name }}
      </li>
    </ul>
  </div>
  <router-view></router-view>
</template>

<script>
export default {
  data() {
    return {
      name: "",
    };
  },
  mounted() {
    this.name = JSON.parse(localStorage.getItem("name"));
  },
  methods: {
    logout() {
      window.alert("Je bent uitgelogd");
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      this.name = "";
      window.location.reload();
    },
  },
};
</script>

<style>
.appNav {
  text-align: center;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333;
  display: flex;
  justify-content: center;
}

li {
  float: left;
}

.linkNav {
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: xx-large;
  background-color: #333;
  border: none;
  cursor: pointer;
}

.linkNavN {
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: xx-large;
  background-color: #333;
  border: none;
}

.linkNav:hover {
  background-color: #111;
}
</style>
