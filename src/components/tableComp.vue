<template>
  <div v-if="login">
    <router-link to="/create" custom v-slot="{ navigate }">
      <div class="center2">
        <button @click="navigate" role="link">Add beer</button>
      </div>
    </router-link>
    <router-view></router-view>
  </div>
  <div class="scrollBar">
    <table class="beerTBL center">
      <tr>
        <th class="BeerTD" v-for="item in keys" v-bind:key="item">
          {{ item }}
        </th>
        <th v-if="login" class="BeerTD">Update</th>
        <th v-if="login" class="BeerTD">Delete</th>
      </tr>
      <tr v-for="naam in biertjes" v-bind:key="naam">
        <td class="BeerTD" v-for="item in naam" v-bind:key="item">
          {{ item }}
        </td>
        <td v-if="login" class="BeerTD"><button @click="update(naam.id)">Update</button></td>
        <td v-if="login" class="BeerTD">
          <button @click="deleted(naam.id)">delete</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<style>
.center {
  margin-left: auto;
  margin-right: auto;
}

.center2 {
  display: flex;
  justify-content: center;
  padding: 5px;
}

.scrollBar {
  overflow: scroll;
  height: 600px;
  overflow-x: hidden;
}

.beerTBL {
  border-collapse: collapse;
}
.BeerTD {
  border: 1px solid black;
  padding: 2px 5px;
}
</style>

<script>
import axios from "axios";

export default {
  data() {
    return {
      data: "",
      biertjes: "",
      keys: "",
      login: false,
    };
  },
  mounted() {
    let url = "http://localhost:3000/all";
    axios.get(url).then((response) => {
      //console.log(response.data);
      let key = Object.keys(response.data[0]);

      this.biertjes = response.data;
      this.keys = key;
    });

    if (localStorage.getItem("token")) {
      this.login = true;
    }
  },
  methods: {
    update(id) {
      this.$router.push("/update/" + id);
    },
    deleted(id) {
      // console.log(id);

      let url = "http://localhost:3000/" + id;
      axios
        .delete(url, {
          headers: {
            "x-access-token": JSON.parse(localStorage.getItem("token")) || "",
          },
        })
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            window.alert("Verwijderd");
            window.location.reload();
          }
        })
        .catch((response) => {
          if (response.response.status == 401) {
            window.alert("Niet ingelogd");
          } else {
            window.alert("er is iets fout gegaan");
            console.log(response);
          }
        });
    },
  },
};
</script>
