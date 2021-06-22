<template>
  <div>
    <base-card>
      <h2>{{ fullName }}</h2>
      <span>${{ coachRate }}/hour</span>
    </base-card>
    <base-card>
      <h2>Interested ? Contact the coach now !</h2>
      <router-view></router-view>
      <base-button link :to="coachContactLink">Contact</base-button>
    </base-card>
    <base-card>
      <base-badge
        v-for="area in areas"
        :key="area"
        :title="area"
        :type="area"
      ></base-badge>
      <p>{{ description }}</p>
    </base-card>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      selectedCoach: null
    };
  },
  created() {
    this.selectedCoach = this.$store.getters['coaches/coaches'].find(
      coach => coach.id === this.id
    );
  },
  computed: {
    fullName() {
      return this.selectedCoach.firstName + ' ' + this.selectedCoach.lastName;
    },
    coachRate() {
      return this.selectedCoach.hourlyRate;
    },
    areas() {
      return this.selectedCoach.areas;
    },
    description() {
      return this.selectedCoach.description;
    },
    coachContactLink() {
      return '/coaches/' + this.id + '/contact';
    }
  }
};
</script>
