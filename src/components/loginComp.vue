<template>
  <h1>Login Form</h1>
  <div>
    <table>
      <tr>
        <td>
          <label for="email">Email: </label>
        </td>
        <td>
          <input type="text" id="email" v-model="email" />
        </td>
      </tr>
      <tr>
        <td>
          <label for="password">Password: </label>
        </td>
        <td>
          <input type="password" id="password" v-model="password" />
        </td>
      </tr>
      <tr>
        <td>
          <button @click="submit">Submit</button>
        </td>
        <td></td>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    submit() {
      if (this.email && this.password) {
        //console.log(" name: " + this.name + " brewer: " + this.brewer + " type: " + this.type);

        let url = "http://localhost:3000/user/login";
        axios
          .post(
            url,
            qs.stringify({
              email: this.email,
              password: this.password,
            })
          )
          .then((response) => {
            if (response.status == 200) {
              localStorage.setItem(
                "token",
                JSON.stringify(response.data.token)
              );
              localStorage.setItem("name", JSON.stringify(response.data.data.name));
            } else {
              console.log(response);
            }
          });

        window.alert("form verzonden");
        this.$router
          .push({ path: '/table' })
          .then(() => { this.$router.go() })
      } else {
        window.alert("vul form in");
      }
    },
  },
};
</script>
