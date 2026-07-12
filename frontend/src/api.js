const BASE_URL = "http://localhost:3000/api/v1";

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
    }
    return data;
};

export const api = {
    // Analytics
    getAnalytics: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) queryParams.append(key, filters[key]);
        });
        const res = await fetch(`${BASE_URL}/analytics?${queryParams.toString()}`);
        return handleResponse(res);
    },

    // Employees
    getEmployees: async (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key]) queryParams.append(key, params[key]);
        });
        const res = await fetch(`${BASE_URL}/employees?${queryParams.toString()}`);
        return handleResponse(res);
    },

    getEmployeeById: async (id) => {
        const res = await fetch(`${BASE_URL}/employees/${id}`);
        return handleResponse(res);
    },

    createEmployee: async (payload) => {
        const res = await fetch(`${BASE_URL}/employees`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        return handleResponse(res);
    },

    updateEmployee: async (id, payload) => {
        const res = await fetch(`${BASE_URL}/employees/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        return handleResponse(res);
    },

    deleteEmployee: async (id) => {
        const res = await fetch(`${BASE_URL}/employees/${id}`, {
            method: "DELETE"
        });
        return handleResponse(res);
    },

    // Salary History
    getSalaryHistory: async (id) => {
        const res = await fetch(`${BASE_URL}/employees/${id}/salary-history`);
        return handleResponse(res);
    },

    addSalaryHistory: async (id, payload) => {
        const res = await fetch(`${BASE_URL}/employees/${id}/salary-history`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        return handleResponse(res);
    },

    // Lookups
    getLookups: async () => {
        const res = await fetch(`${BASE_URL}/lookups`);
        return handleResponse(res);
    }
};
