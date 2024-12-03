<template>
  <div class="dashboard">
    <h1>Nurse Shifts Dashboard</h1>

    <!-- Add Shift Button -->
    <button @click="showForm = !showForm" class="add-shift-btn">
      {{ showForm ? "Cancel" : "Add Shift" }}
    </button>

    <!-- Add Shift Form (only visible when showForm is true) -->
    <form v-if="showForm" @submit.prevent="addShift" class="add-shift-form">
      <div class="form-field">
        <input
          type="text"
          v-model="newShift.name"
          placeholder="Shift Name"
          required
        />
      </div>
      <div class="form-field">
        <input type="date" v-model="newShift.date" required />
      </div>
      <div class="form-field">
        <select v-model="newShift.status" required>
          <option value="open">Open</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div class="form-field">
        <input
          type="text"
          v-model="newShift.nurses"
          placeholder="Nurses (comma-separated)"
          required
        />
      </div>
      <button type="submit" class="submit-btn">Add Shift</button>
    </form>

    <!-- Filters Component -->
    <ShiftFilters
      :nurses="nurses"
      :filters="filters"
      :searchQuery="searchQuery"
      @update:filters="updateFilters"
      @update:searchQuery="updateSearchQuery"
    />

    <!-- Table and Pagination Container -->
    <div class="table-pagination-container">
      <!-- Shift Table Component -->
      <ShiftTable :shifts="filteredShifts" @sort="sortTable" />

      <!-- No Results Found -->
      <div v-if="filteredShifts.length === 0" class="no-results">
        No shifts match your criteria.
      </div>

      <!-- Pagination Component -->
      <PaginationControls
        v-if="filteredShifts.length > 0"
        :currentPage="currentPage"
        :totalPages="totalPages"
        @update:currentPage="updatePage"
      />
    </div>
  </div>
</template>

<script>
import ShiftFilters from "@/components/ShiftFilters.vue";
import ShiftTable from "@/components/ShiftTable.vue";
import PaginationControls from "@/components/PaginationControls.vue";
import shiftsData from "@/mocks/NurseShifts.json";

export default {
  components: {
    ShiftFilters,
    ShiftTable,
    PaginationControls,
  },
  data() {
    return {
      shifts: shiftsData, // Initial data from JSON
      showForm: false, // To toggle the visibility of the Add Shift form
      newShift: { name: "", date: "", status: "open", nurses: "" }, // New shift data
      filters: { date: "", status: "all", nurse: "all" },
      searchQuery: "",
      nurses: [],
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  mounted() {
    const savedShifts = JSON.parse(localStorage.getItem("shifts"));
    if (savedShifts) {
      this.shifts = savedShifts;
    }

    this.nurses = this.getNursesFromShifts();
    const route = this.$route;
    if (route.query.page) {
      this.currentPage = parseInt(route.query.page, 10);
    }
  },
  watch: {
    $route(to) {
      if (to.query.page) {
        this.currentPage = parseInt(to.query.page, 10);
      }
    },
  },
  computed: {
    filteredShifts() {
      let filteredData = this.shifts;

      // Apply filters
      if (this.filters.date) {
        filteredData = filteredData.filter(
          (shift) => shift.date === this.filters.date
        );
      }
      if (this.filters.status !== "all") {
        filteredData = filteredData.filter(
          (shift) => shift.status === this.filters.status
        );
      }
      if (this.filters.nurse !== "all") {
        filteredData = filteredData.filter((shift) =>
          shift.nurses.some((nurse) => nurse.name === this.filters.nurse)
        );
      }
      if (this.searchQuery) {
        filteredData = filteredData.filter((shift) =>
          shift.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      // Pagination logic
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return filteredData.slice(startIndex, startIndex + this.itemsPerPage);
    },

    totalPages() {
      // Calculate total pages based on the length of the filtered shifts
      const filteredData = this.shifts.filter((shift) => {
        let matches = true;
        if (this.filters.date && shift.date !== this.filters.date)
          matches = false;
        if (
          this.filters.status !== "all" &&
          shift.status !== this.filters.status
        )
          matches = false;
        if (
          this.filters.nurse !== "all" &&
          !shift.nurses.some((nurse) => nurse.name === this.filters.nurse)
        )
          matches = false;
        if (
          this.searchQuery &&
          !shift.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
          matches = false;
        return matches;
      });

      return Math.ceil(filteredData.length / this.itemsPerPage);
    },
  },
  methods: {
    getNursesFromShifts() {
      const nurses = new Set();
      this.shifts.forEach((shift) => {
        if (shift.nurses && Array.isArray(shift.nurses)) {
          shift.nurses.forEach((nurse) => {
            nurses.add(nurse.name);
          });
        }
      });
      return Array.from(nurses);
    },
    updateFilters(newFilters) {
      this.filters = newFilters;
      this.currentPage = 1;
    },
    updateSearchQuery(newSearchQuery) {
      this.searchQuery = newSearchQuery;
    },
    updatePage(newPage) {
      // Ensure the new page is within the available range
      const total = this.totalPages;
      if (newPage > total) {
        newPage = total;
      } else if (newPage < 1) {
        newPage = 1;
      }

      this.$router.push({ query: { page: newPage } });
      this.currentPage = newPage;
    },
    sortTable(column) {
      this.shifts.sort((a, b) => {
        if (a[column] < b[column]) return -1;
        if (a[column] > b[column]) return 1;
        return 0;
      });
    },
    addShift() {
      // Create new shift object
      console.log("Nurse Name: ", this.newShift.nurses);
      const newShift = {
        id: this.shifts.length + 1, // Simple id generation based on array length
        name: this.newShift.name,
        date: this.newShift.date,
        status: this.newShift.status,
        nurses: [this.newShift.nurses.trim()],
      };

      // Add new shift to the shifts array
      this.shifts.push(newShift);

      // Save to LocalStorage
      localStorage.setItem("shifts", JSON.stringify(this.shifts));

      // Reset form and hide it
      this.newShift = { name: "", date: "", status: "open", nurses: "" };
      this.showForm = false;
    },
  },
};
</script>

<style scoped>
body {
  background-color: #f4f7fc;
  margin: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* Main container for the dashboard */
.dashboard {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
}

/* Styling for title */
h1 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
}

/* Add Shift Button */
.add-shift-btn {
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 20px;
  width: 150px;
  text-align: center;
}

.add-shift-btn:hover {
  background-color: #45a049;
}

/* Add Shift Form */
.add-shift-form {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-gap: 15px;
  max-width: 400px;
  margin-top: 20px;
}

.add-shift-form input,
.add-shift-form select,
.add-shift-form button {
  width: 100%;
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.add-shift-form input:focus,
.add-shift-form select:focus,
.add-shift-form button:focus {
  outline: none;
  border-color: #4caf50;
}

.add-shift-form input::placeholder {
  color: #aaa;
}

/* Button styling in the form */
.add-shift-form button {
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.add-shift-form button:hover {
  background-color: #45a049;
}

/* Filters component */
.ShiftFilters {
  margin-bottom: 30px;
}

/* Table and pagination container */
.table-pagination-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 400px;
  margin-top: 20px;
}

/* Table styling */
.ShiftTable {
  width: 100%;
  margin-bottom: 30px;
  font-family: Arial, sans-serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  margin-bottom: 20px;
  font-family: Arial, sans-serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

th,
td {
  padding: 12px 20px;
  border: 1px solid #ddd;
  text-align: left;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

th {
  background-color: #f4f4f4;
  color: #333;
  font-weight: bold;
  cursor: pointer;
}

tr:hover {
  background-color: #f9f9f9;
}

td {
  background-color: #fff;
  color: #555;
}

.text-green-600 {
  color: #16a34a;
}

.text-red-600 {
  color: #dc2626;
}

/* No results message */
.no-results {
  text-align: center;
  color: #999;
  margin: 20px 0;
  font-size: 16px;
}

/* Pagination controls */
.PaginationControls {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}
</style>
