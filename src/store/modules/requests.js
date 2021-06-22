const axios = require('axios');

export default {
  namespaced: true,
  state() {
    return {
      requests: []
    };
  },
  mutations: {
    addRequest(state, payload) {
      state.requests.push(payload);
      console.log(state.requests);
    },
    loadRequest(state, payload) {
      state.requests = payload;
      console.log(state.requests);
    }
  },
  actions: {
    receiveRequest(context, payload) {
      const newRequest = {
        id: new Date().toISOString(),
        coachId: payload.coachId,
        email: payload.email,
        message: payload.message
      };

      axios
        .post(
          `https://main-project-course-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`,
          newRequest
        )
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
          console.log(error.message);
        });

      context.commit('addRequest', newRequest);
    },
    async loadRequest(context) {
      const coachId = context.rootGetters.userId;
      const token = context.rootGetters.token;
      const response = await axios.get(
        `https://main-project-course-default-rtdb.firebaseio.com/requests/${coachId}.json?auth=` +
          token
      );

      if (!response.statusText) {
        const error = new Error(response.message || 'Failed to fetch !');
        throw error;
      }

      const requests = [];

      for (const key in response.data) {
        const request = {
          coachId: response.data[key].coachId,
          email: response.data[key].email,
          id: response.data[key].id,
          message: response.data[key].message
        };
        requests.push(request);
      }
      context.commit('loadRequest', requests);
    }
  },
  getters: {
    getRequests(state, _, _2, rootGetters) {
      const coachId = rootGetters.userId;
      return state.requests.filter(req => req.coachId === coachId);
    },
    hasRequests(_, getters) {
      return getters.getRequests && getters.getRequests.length > 0;
    }
  }
};
