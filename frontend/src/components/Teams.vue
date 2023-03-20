<script>
export default {
  data() {
    return {
      teams: [],
      token: '',
      errors: '',
      show: false,
      newteam: ''
    }
  },
  mounted() {
    if (localStorage.token) {
      this.token = localStorage.token;
    }
    this.fetch_teams();
  },
  methods: {
    async handleError(err) {
      this.errors = err.message;
      this.show = true;
    },
    async checkStatus(res) {
      this.show = false;
      if (res.status !== 200) {
        const message = await res.json();
        throw new Error(message.message);
      }
      return res;
    },
    async fetch_teams() {
      fetch("http://localhost:3000/api/teams/all_teams", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: this.token })
      })
          .then(res => this.checkStatus(res))
          .then(res => res.json())
          .then(data => this.teams = data["teams"])
          .catch(err => this.handleError(err))
    },
    async add_team() {
      if (this.newteam.length) {
        fetch("http://localhost:3000/api/teams/add", {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          redirect: "follow",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({token: this.token, name: this.newteam})
        })
            .then(res => this.checkStatus(res))
            .then(res => res.json())
            .then(data => this.fetch_teams())
            .catch(err => this.handleError(err));
      }
    },
    async delete_team(teamid) {
      fetch("http://localhost:3000/api/teams/delete", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: this.token, id: teamid })
      })
          .then(res => this.checkStatus(res))
          .then(res => res.json())
          .then(data => this.fetch_teams())
          .catch(err => this.handleError(err))
    }
  }
}
</script>

<template>
  <div id="app" class="container">
    <div>
      <h1>Teams</h1>
      <table class="table">
        <thead>
        <tr>
          <th scope="col">Team Name</th>
          <th scope="col"></th>
        </tr>
        </thead>
        <tbody class="table-group-divider">
        <tr v-for="team in teams" :key="team.teamid" class="team">
          <td><router-link :to="{ name: 'team-details', params: { id: team.teamid }}">{{ team.name }}</router-link></td>
          <td><span class="btn btn-link" @click="delete_team(team.teamid)">Delete</span></td>
        </tr>
        <tr class="table-secondary">
          <td><input type="text" v-model="newteam"></td>
          <td><button class="btn btn-link" @click="add_team">Add</button></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
  div.app {
    width: max-content;
  }
</style>