<script>
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import Teams from "@/components/Teams.vue";
import TeamDetails from "@/components/TeamDetails.vue";
export default {
  name: 'App',
  components: { Login, Register, Teams, TeamDetails },
  mounted() {
    if (localStorage.token) {
      this.token = localStorage.token;
    }
  },
  watch: {
    token(newToken) {
      localStorage.token = newToken;
    }
  },
  methods: {
    logout() {
      localStorage.token = '';
      this.$router.push({ name: 'login' });
    }
  }
}
</script>

<template>
  <div id="app">
    <div>
      <nav class="navbar navbar-expand-lg sticky-top bg-body-tertiary" data-bs-theme="dark" style="margin-bottom: 1rem;">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Team Rosters</a>
          <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="nav-link active" aria-current="page" to="/">Teams</router-link>
              </li>
            </ul>
            <div class="d-flex">
              <button @click="logout" class="btn btn-link" type="submit">Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <div id="app" class="container">
         <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
