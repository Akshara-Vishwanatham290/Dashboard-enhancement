<template>
  <div class="filters">
    <!-- Filter by Date -->
    <div class="filter-item date-filter">
      <label for="date" class="filter-label">Filter by Date</label>
      <input
        id="date"
        type="date"
        v-model="localFilters.date"
        @change="updateFilters"
        class="filter-input"
      />
    </div>

    <!-- Filter by Status -->
    <div class="filter-item status-filter">
      <label for="status" class="filter-label">Filter by Status</label>
      <select
        id="status"
        v-model="localFilters.status"
        @change="updateFilters"
        class="filter-input"
      >
        <option value="all">All</option>
        <option value="open">Open</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <!-- Filter by Nurse -->
    <div class="filter-item">
      <label for="nurse" class="filter-label">Filter by Nurse</label>
      <select
        id="nurse"
        v-model="localFilters.nurse"
        @change="updateFilters"
        class="filter-input"
      >
        <option value="all">All</option>
        <option v-for="nurse in nurses" :key="nurse" :value="nurse">
          {{ nurse }}
        </option>
      </select>
    </div>

    <!-- Search Query -->
    <div class="filter-item">
      <label for="search" class="filter-label">Search by Shift Name</label>
      <input
        id="search"
        type="text"
        v-model="localSearchQuery"
        placeholder="Search by Shift Name"
        @input="updateSearchQuery"
        class="filter-input"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    filters: Object,
    searchQuery: String,
    nurses: Array,
  },
  data() {
    return {
      localFilters: { ...this.filters },
      localSearchQuery: this.searchQuery,
    };
  },
  methods: {
    updateFilters() {
      console.log("Filters updated:", this.localFilters);
      this.$emit("update:filters", this.localFilters);
    },
    updateSearchQuery() {
      console.log("Search query updated:", this.localSearchQuery);
      this.$emit("update:searchQuery", this.localSearchQuery);
    },
  },
};
</script>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  margin-bottom: 30px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 220px; /* Increased width for better alignment */
}

/* Adding margin to specific filter sections */
.date-filter,
.status-filter {
  margin-right: 20px; /* Adds a gap between Date and Status filters */
}

.filter-label {
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
  font-weight: bold; /* Added bold style to labels */
}

.filter-input {
  width: 100%;
  padding: 10px 14px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease; /* Smooth transition */
}

.filter-input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
}

select.filter-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding: 10px 14px;
  background-color: #fff;
}

select.filter-input option {
  padding: 10px;
}

/* Add subtle hover effect */
.filter-input:hover {
  border-color: #4caf50;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .filters {
    justify-content: center;
    gap: 15px;
  }

  .filter-item {
    width: 100%;
  }
}
</style>
