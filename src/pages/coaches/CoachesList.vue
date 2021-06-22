<template>
  <div>
    <section>
      <coach-filter @change-filter="setFilters"></coach-filter>
    </section>
    <section>
      <base-dialog
        :show="!!error"
        title="Something went wrong"
        @close="handleError"
      >
        <p>{{ error }}</p>
      </base-dialog>
      <base-card>
        <div class="controls">
          <base-button mode="outline" @click="setCoaches(true)"
            >Refresh</base-button
          >
          <base-button link to="/auth" v-if="!isLoggedIn && !isLoading"
            >Login to register as a coach</base-button
          >
          <base-button
            v-if="isLoggedIn && !isCoach && !isLoading"
            link
            to="/register"
            >Register as a coach</base-button
          >
        </div>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-if="hasCoaches">
          <coach-item
            v-for="coach in filteredCoaches"
            :key="coach.id"
            :id="coach.id"
            :firstName="coach.firstName"
            :lastName="coach.lastName"
            :rate="coach.hourlyRate"
            :areas="coach.areas"
          ></coach-item>
        </ul>
        <h3 v-else>No coaches found.</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import CoachFilter from '../../components/coaches/CoachFilter.vue';
import CoachItem from '../../components/coaches/CoachItem.vue';

export default {
  components: {
    CoachItem,
    CoachFilter
  },
  data() {
    return {
      error: null,
      activeFilters: {
        frontend: true,
        backend: true,
        career: true
      },
      isLoading: true
    };
  },
  computed: {
    filteredCoaches() {
      const coaches = this.$store.getters['coaches/coaches'];
      return coaches.filter(coach => {
        if (this.activeFilters.frontend && coach.areas.includes('frontend')) {
          return true;
        }
        if (this.activeFilters.backend && coach.areas.includes('backend')) {
          return true;
        }
        if (this.activeFilters.career && coach.areas.includes('career')) {
          return true;
        }
        return false;
      });
    },
    hasCoaches() {
      return !this.isLoading && this.$store.getters['coaches/hasCoaches'];
    },
    isCoach() {
      return this.$store.getters['coaches/isCoach'];
    },
    isLoggedIn() {
      return this.$store.getters['isAuthenticated'];
    }
  },
  methods: {
    setFilters(updatedFilters, filteredCoaches) {
      this.activeFilters = updatedFilters;
      console.log(filteredCoaches.id);
    },
    async setCoaches(refresh = false) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('coaches/setCoach', {
          forceRefresh: refresh
        });
      } catch (error) {
        this.error = error.message || 'Something went wrong';
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    }
  },
  created() {
    this.setCoaches();
  }
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
