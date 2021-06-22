const axios = require('axios');

export default {
  namespaced: true,
  state() {
    return {
      lastFetch: '',
      coaches: [
        {
          firstName: 'julia',
          lastName: 'Jones',
          areas: ['frontend', 'backend'],
          description: 'F',
          hourlyRate: '30'
        }
      ]
    };
  },
  mutations: {
    registerCoach(state, payload) {
      state.coaches.push(payload);
    },
    setCoach(state, payload) {
      state.coaches = payload;
    },
    setFetchTime(state) {
      state.lastFetch = new Date().getTime();
    }
  },
  actions: {
    registerCoach(context, data) {
      const userId = context.rootGetters.userId;
      const coachData = {
        firstName: data.first,
        lastName: data.last,
        description: data.desc,
        hourlyRate: data.rate,
        areas: data.areas
      };

      const token = context.rootGetters.token;
      axios
        .put(
          `https://main-project-course-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=` +
            token,
          coachData
        )
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });

      context.commit('registerCoach', coachData);
    },
    async setCoach(context, payload) {
      if (!payload.forceRefresh && !context.getters.shouldUpdate) {
        return;
      }

      const response = await axios.get(
        'https://main-project-course-default-rtdb.firebaseio.com/coaches.json'
      );

      if (!response.statusText) {
        const error = new Error(response.message || 'Failed to fetch !');
        throw error;
      }

      const coaches = [];

      for (const key in response.data) {
        const coach = {
          id: key,
          firstName: response.data[key].firstName,
          lastName: response.data[key].lastName,
          description: response.data[key].description,
          hourlyRate: response.data[key].hourlyRate,
          areas: response.data[key].areas
        };
        coaches.push(coach);
      }
      context.commit('setCoach', coaches);
      context.commit('setFetchTime');
    }
  },
  getters: {
    coaches(state) {
      return state.coaches;
    },
    hasCoaches(state) {
      return state.coaches && state.coaches.length > 0;
    },
    isCoach(_, getters, _2, rootGetters) {
      const coaches = getters.coaches;
      const userId = rootGetters.userId;
      return coaches.some(coach => coach.id === userId);
    },
    shouldUpdate(state) {
      const lastFetch = state.lastFetch;
      if (!lastFetch) {
        return true;
      } else {
        const currentTimeStamp = new Date().getTime();
        return (currentTimeStamp - lastFetch) / 1000 > 60;
      }
    }
  }
};
