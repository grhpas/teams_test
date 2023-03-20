<script>
export default {
  data() {
    return {
      teamid: 0,
      team: {},
      players: [],
      filter_name: '',
      token: '',
      errors: '',
      newplayer: '',
      newinjured: false,
      show: true,
    }
  },
  mounted() {
    if (localStorage.token) {
      this.token = localStorage.token;
      this.teamid = this.$route.params.id;
    }

    fetch("http://localhost:3000/api/teams/get_id", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: this.token, id: this.teamid, })
    })
    .then(res => this.checkStatus(res))
    .then(res => res.json())
    .then(data => this.team = data)
    .catch(err => this.handleError(err));

    this.fetch_players();
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
    async clearForm() {
      this.newplayer = '';
      this.newinjured = false;
    },
    nameFilter() {
      if (!this.filter_name.length) {
        return this.players;
      }
      const query = this.filter_name.toUpperCase();
      return this.players.filter(row => row.name.toUpperCase().includes(query));
    },
    async fetch_players() {
      fetch("http://localhost:3000/api/players/all_players", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: this.token, teamid: this.teamid, })
      })
          .then(res => this.checkStatus(res))
          .then(res => res.json())
          .then(data => this.players = data["players"])
          .catch(err => this.handleError(err));
    },
    async add_player() {
      if (this.newplayer.length) {
        fetch("http://localhost:3000/api/players/add", {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          redirect: "follow",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({token: this.token, teamid: this.teamid, name: this.newplayer, injured: this.newinjured})
        })
            .then(res => this.checkStatus(res))
            .then(res => res.json())
            .then(res => this.fetch_players())
            .then(res => this.clearForm())
            .catch(err => this.handleError(err));
      }
    },
    async injured_player(playerid, event) {
      const target = event.target;
      fetch("http://localhost:3000/api/players/injured", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: this.token, id: playerid, injured: target.checked })
      })
          .then(res => this.checkStatus(res))
          .then(res => res.json())
          .then(res => this.fetch_players())
          .catch(err => this.handleError(err));
    },
    async delete_player(playerid) {
      fetch("http://localhost:3000/api/players/delete", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: this.token, id: playerid })
      })
        .then(res => this.checkStatus(res))
        .then(res => res.json())
        .then(res => this.fetch_players())
        .catch(err => this.handleError(err));
    }
  }
}
</script>

<template>
  <div id="app" class="container">
    <div>
      <div class="alert alert-danger" role="alert" v-if="show">
        {{ errors }}
      </div>
      <h1>{{ team.name }} ({{ team.teamid }})</h1>
      <br/>
      <div class="d-flex">
        <input class="form-control me-2" type="search" placeholder="Search Player" v-model="filter_name">
      </div>
      <br/>
      <table class="table">
        <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Injured</th>
          <th scope="col"></th>
        </tr>
        </thead>
        <tbody class="table-group-divider">
        <tr v-for="player in nameFilter()" :key="player.playerid" class="team">
          <td>{{ player.name }}</td>
          <td><input type="checkbox" v-model="player.injured" v-bind:id="player.playerid" @click="injured_player(player.playerid, $event)"/></td>
          <td><span class="btn btn-link" @click="delete_player(player.playerid)">Delete</span></td>
        </tr>
        <tr class="table-secondary">
          <td><input type="text" v-model="newplayer"></td>
          <td><input type="checkbox" v-model="newinjured"/></td>
          <td><button class="btn btn-link" @click="add_player">Add</button></td>
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