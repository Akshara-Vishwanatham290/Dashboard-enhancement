<template>
  <div class="pagination">
    <button @click="previousPage" :disabled="currentPage === 1">
      Previous
    </button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="nextPage" :disabled="currentPage === totalPages">
      Next
    </button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.$emit("update:currentPage", this.currentPage + 1);
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.$emit("update:currentPage", this.currentPage - 1);
      }
    },
  },
};
</script>
