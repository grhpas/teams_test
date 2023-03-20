<script>

export default {
  data() {
    return {
      email: '',
      password: '',
      twofa: '',
      token: '',
      errors: '',
      imageSource: '',
      show: false,
    }
  },
  mounted() {
    if (localStorage.token) {
      this.token = localStorage.token;
      this.$router.push({ name: 'teams' });
    } else {
      this.preregister();
    }
  },
  watch: {
    token(newToken) {
      localStorage.token = newToken;
      this.$router.push({ name: 'teams' });
    }
  },
  methods: {
    async preregister() {
      fetch("http://localhost:3000/api/users/preregister", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
      })
          .then(res => res.text())
          .then(code => this.createQR(code))
    },
    async createQR(code) {
      this.imageSource = code;
      console.log(code);
    },
    formSubmit() {
      fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: this.email, password: this.password, twofa: this.twofa })
      })
      .then(res => this.checkStatus(res))
      .then(res => res.json())
      .then(data => this.token = data["token"])
      .catch(err => this.handleError(err))
    },
    async handleError(err) {
      this.errors = err.message;
      this.show = true;
    },
    async checkStatus(res) {
      this.show = false;
      if (![200, 201, 202].includes(res.status)) {
        const message = await res.json();
        throw new Error(message.message);
      }
      return res;
    }
  }
}
</script>

<template>
  <div id="app" class="container">
    <div class="container-sm" style="max-width: 400px;">
        <div class="card">
            <h5 class="card-header">
                Login
            </h5>
            <div class="card-body">

                <div class="alert alert-danger" role="alert" v-if="show">
                   {{ errors }}
                </div>
                <div class="card-text">
                    <form @submit.prevent="formSubmit">
                        <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">Email address</label>
                            <input type="email" required v-model="email" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" required v-model="password" class="form-control">
                        </div>
                        <img id="qrcode2fa" :src="imageSource" alt="" />
                        <div class="mb-3">
                            <label for="2faCode" class="form-label">2FA</label>
                            <input type="text" required v-model="twofa" class="form-control">
                        </div>
                        <div class="d-grid gap-2 d-sm-flex justify-content-sm-end">
                            <button class="btn btn-primary me-md-2" type="submit">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div><router-link :to="{ name: 'register' }">Register</router-link>
        </div>
    </div>
  </div>
</template>

<style scoped>
  img {
    margin: 0 auto;
    display: block;
  }
</style>