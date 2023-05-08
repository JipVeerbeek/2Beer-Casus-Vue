<template>
  <h1>Form</h1>
  <div>
    <table>
      <tr>
        <td>
          <label for="name">Name: </label>
        </td>
        <td>
          <input type="text" id="name" v-model="name" />
        </td>
      </tr>
      <tr>
        <td>
          <label for="brewer">Brewer: </label>
        </td>
        <td>
          <input type="text" id="brewer" v-model="brewer" />
        </td>
      </tr>
      <tr>
        <td>
          <label for="type">Type: </label>
        </td>
        <td>
          <input type="text" id="type" v-model="type" />
        </td>
      </tr>
      <tr>
        <td>
          <label for="yeast">Yeast: </label>
        </td>
        <td>
          <input type="text" id="yeast" v-model="yeast" />
        </td>
      </tr>
      <tr>
        <td>
          <label for="perc">Perc: </label>
        </td>
        <td>
          <input type="text" id="perc" v-model="perc" />
        </td>
      </tr>
      <tr>
        <td>
          <label for="purchase_price">Purchase price: </label>
        </td>
        <td>
          <input type="text" id="purchase_price" v-model="purchase_price" />
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
      name: "",
      brewer: "",
      type: "",
      yeast: "",
      perc: "",
      purchase_price: "",
    };
  },
  methods: {
    submit() {
      if (this.name && this.brewer && this.type) {
        //console.log(" name: " + this.name + " brewer: " + this.brewer + " type: " + this.type);

        let url = "http://localhost:3000/";
        axios
          .post(
            url,
            qs.stringify({
              name: this.name,
              brewer: this.brewer,
              type: this.type,
              yeast: this.yeast,
              perc: this.perc,
              purchase_price: this.purchase_price,
            }),
            {
              headers: {
                "x-access-token":
                  JSON.parse(localStorage.getItem("token")) || "",
              },
            }
          )
          .then((response) => {
            console.log(response);
            if (response.status == 200) {
              window.alert("form verzonden");
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

        this.$router.push("/table");
      } else {
        window.alert("vul form in");
      }
    },
  },
};
</script>
