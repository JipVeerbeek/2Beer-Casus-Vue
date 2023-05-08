import { createApp } from 'vue';
import App from './App.vue';
import {createRouter, createWebHistory} from "vue-router";
import homeComp from "./components/homeComp.vue";
import tableComp from "./components/tableComp.vue";
import createComp from "./components/createComp.vue";
import updateComp from "./components/updateComp.vue";
import loginComp from "./components/loginComp.vue";
import signupComp from "./components/signupComp.vue";



const routes = [
    { path: '/', redirect: "/home" },
    { path: '/home', component: homeComp },
    { path: '/table', component: tableComp },
    { path: '/create', component: createComp },
    { path: '/update/:id', component: updateComp },
    { path: '/login', component: loginComp },
    { path: '/signup', component: signupComp },
]

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHistory(),
    routes, // short for `routes: routes`
})



const app = createApp(App)

app.use(router)

app.mount("#app")