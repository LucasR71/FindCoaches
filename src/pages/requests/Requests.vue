<template>
  <div>
    <section>
      <header>
        <base-card>
          <h2>Requests</h2>
        </base-card>
      </header>
    </section>
    <section>
      <base-dialog
        :show="!!error"
        title="Something went wrong"
        @close="handleError"
      >
        <p>{{ error }}</p>
      </base-dialog>
      <div v-if="isLoading">
        <base-spinner></base-spinner>
      </div>
    </section>
    <section>
      <div>
        <base-card>
          <ul v-if="hasRequests">
            <request-item
              v-for="request in requests"
              :key="request"
              :email="request.email"
              :message="request.message"
            ></request-item>
          </ul>
          <p v-else>No requests yet</p>
        </base-card>
      </div>
    </section>
  </div>
</template>

<script>
import RequestItem from '../../components/requests/RequestItem.vue';
export default {
  components: { RequestItem },
  data() {
    return {
      isLoading: false,
      error: null
    };
  },
  computed: {
    hasRequests() {
      return this.$store.getters['requests/hasRequests'];
    },
    requests() {
      return this.$store.getters['requests/getRequests'];
    }
  },
  methods: {
    async loadRequest() {
      this.isLoading = true;
      try {
        await this.$store.dispatch('requests/loadRequest');
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
    this.loadRequest();
  }
};
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>
