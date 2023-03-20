import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            alias: "/login",
            name: "login",
            component: () => import('./components/Login.vue'),
        },
        {
            path: "/register",
            name: "register",
            component: () => import('./components/Register.vue'),
        },
        {
            path: "/teams",
            name: "teams",
            component: () => import('./components/Teams.vue'),
        },
        {
            path: "/teams/:id",
            name: "team-details",
            component: () => import('./components/TeamDetails.vue'),
        },
    ]
})

// Block if not logged in
router.beforeEach((to, from, next)=>{
    if ( !localStorage.token.length && !['login', 'register',].includes(to.name) ){
        next({
            path: '/login',
            replace: true
        })
    } else {
        next();
    }
})

createApp(App)  // .mount('#app')
.use(router)
.mount('#app');
