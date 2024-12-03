<template>
  <table>
    <thead>
      <tr>
        <th>Shift Name</th>
        <th @click="sortTable('date')" class="sortable-column">
          Date
          <span v-if="sortColumn === 'date'">
            ({{ sortOrder === "asc" ? "↑" : "↓" }})
          </span>
        </th>
        <th @click="sortTable('status')" class="sortable-column">
          Status
          <span v-if="sortColumn === 'status'">
            ({{ sortOrder === "asc" ? "↑" : "↓" }})
          </span>
        </th>
        <th>Assigned Nurses</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="shift in sortedShifts" :key="shift.id">
        <td>{{ shift.name }}</td>
        <td>{{ shift.date }}</td>
        <td>{{ shift.status }}</td>
        <td>
          <span v-if="shift.nurses.length">
            {{
              shift.nurses.map((nurse) => nurse.name).join(", ") ||
              shift.nurses.join(", ")
            }}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    shifts: Array,
  },
  data() {
    return {
      sortColumn: null,
      sortOrder: "asc",
    };
  },
  computed: {
    sortedShifts() {
      let shifts = [...this.shifts];
      if (this.sortColumn) {
        shifts.sort((a, b) => {
          let comparison = 0;
          if (this.sortColumn === "date") {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            comparison = dateA - dateB; // Sorting by date
          } else if (this.sortColumn === "status") {
            comparison = a.status.localeCompare(b.status); // Sorting by status
          }
          return this.sortOrder === "asc" ? comparison : -comparison;
        });
      }
      return shifts;
    },
  },
  methods: {
    sortTable(column) {
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc"; // Toggle sorting direction
      } else {
        this.sortColumn = column;
        this.sortOrder = "asc"; // Default to ascending order
      }
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-family: Arial, sans-serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 10px 15px;
  border: 1px solid #ddd;
  text-align: left;
  font-size: 14px;
}

th {
  background-color: #f4f4f4;
  color: #333;
  font-weight: bold;
  cursor: pointer;
}

th.sortable-column:hover {
  background-color: #e4e4e4;
}

tr:hover {
  background-color: #f9f9f9;
}

td {
  background-color: #fff;
  color: #555;
}
</style>
