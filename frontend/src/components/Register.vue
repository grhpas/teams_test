<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      confirmpassword: '',
      twofa: '',
      token: '',
      errors: '',
      imageSource: '',
      show: false,
    }
  },
  mounted() {
    this.preregister();
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
      this.show = false;
      // Password validation
      if (this.password.length < 8) {
        this.errors = "Password too small, (less than 8 characters long)!";
        this.show = true;
      }
      if (this.password !== this.confirmpassword) {
        if (this.errors.length) {
          this.errors = this.errors + " Passwords don't match!";
        } else {
          this.errors = "Passwords don't match!";
        }

        this.show = true;
      }

      if (!this.show) {
        // Complete registration
        fetch("http://localhost:3000/api/users/register", {
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
      }
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
          Register New User
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
                <input type="password" required v-model="password" class="form-control" id="password">
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input type="password" required v-model="confirmpassword" class="form-control" id="confirmPassword">
              </div>
              <img id="qrcode2fa" :src="imageSource" alt="" />
              <div class="mb-3">
                <label for="2faCode" class="form-label">2FA</label>
                <input type="password" required v-model="twofa" class="form-control" id="2faCode">
              </div>
              <div class="d-grid gap-2 d-sm-flex justify-content-sm-end">
                <button class="btn btn-danger" type="button">Cancel</button>
                <button class="btn btn-primary me-md-2" type="submit">Register</button>
              </div>
            </form>
          </div>
        </div>
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