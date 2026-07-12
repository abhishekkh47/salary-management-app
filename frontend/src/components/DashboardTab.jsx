import React, { useState, useEffect } from "react";
import { api } from "../api";
import {
  Users,
  CreditCard,
  TrendingUp,
  MapPin,
  Briefcase,
  SlidersHorizontal,
  DollarSign
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

export default function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    country: "",
    department: "",
    employmentType: ""
  });

  // Extract unique filters from stats on initial load for dropdowns
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableDepartments, setAvailableDepartments] = useState([]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getAnalytics(filters);
      setStats(data.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [filters]);

  // Load dropdown lists once
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const data = await api.getAnalytics({});
        if (data.data) {
          const countries = data.data.payrollByCountry.map(c => c.country);
          const depts = data.data.payrollByDepartment.map(d => d.department);
          setAvailableCountries(countries);
          setAvailableDepartments(depts);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadDropdownData();
  }, []);

  if (loading && !stats) {
    return <div className="loading-state">Loading dashboard analytics...</div>;
  }

  const { summary, payrollByCountry, payrollByDepartment, salaryDistribution, highestPaid } = stats || {};

  // Format salary distribution for Pie Chart
  const pieData = salaryDistribution
    ? Object.keys(salaryDistribution).map(key => ({
        name: key,
        value: salaryDistribution[key]
      }))
    : [];

  // Helper to format currency values to lakhs
  const formatLakhs = (val) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)}L`;
    }
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="dashboard-tab" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Filters Bar */}
      <div className="filters-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginRight: "16px" }}>
          <SlidersHorizontal size={18} className="kpi-icon" />
          <span style={{ fontWeight: 600, fontSize: "14px" }}>Filters</span>
        </div>

        <div className="filter-group">
          <label className="filter-label">Country</label>
          <select
            className="filter-select"
            value={filters.country}
            onChange={e => setFilters({ ...filters, country: e.target.value })}
            id="filter-country"
          >
            <option value="">All Countries</option>
            {availableCountries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Department</label>
          <select
            className="filter-select"
            value={filters.department}
            onChange={e => setFilters({ ...filters, department: e.target.value })}
            id="filter-department"
          >
            <option value="">All Departments</option>
            {availableDepartments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Employment Type</label>
          <select
            className="filter-select"
            value={filters.employmentType}
            onChange={e => setFilters({ ...filters, employmentType: e.target.value })}
            id="filter-employment-type"
          >
            <option value="">All Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="CONTRACTOR">Contractor</option>
            <option value="INTERN">Intern</option>
          </select>
        </div>

        {(filters.country || filters.department || filters.employmentType) && (
          <button
            className="btn btn-outline"
            style={{ padding: "6px 12px", fontSize: "12px", marginTop: "18px" }}
            onClick={() => setFilters({ country: "", department: "", employmentType: "" })}
            id="btn-clear-filters"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card" id="kpi-employees">
          <div className="kpi-header">
            <span className="kpi-title">Active Employees</span>
            <Users className="kpi-icon" size={20} />
          </div>
          <span className="kpi-value">{summary?.totalEmployees || 0}</span>
        </div>

        <div className="kpi-card" id="kpi-payroll">
          <div className="kpi-header">
            <span className="kpi-title">Total Payroll (INR)</span>
            <CreditCard className="kpi-icon" size={20} />
          </div>
          <span className="kpi-value">{formatLakhs(summary?.totalPayrollINR || 0)}</span>
        </div>

        <div className="kpi-card" id="kpi-average">
          <div className="kpi-header">
            <span className="kpi-title">Average Salary (INR)</span>
            <TrendingUp className="kpi-icon" size={20} />
          </div>
          <span className="kpi-value">{formatLakhs(summary?.averageSalaryINR || 0)}</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Department Payroll */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Payroll by Department</h3>
          </div>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payrollByDepartment || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e303a" />
                <XAxis dataKey="department" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2028", borderColor: "#2e303a" }}
                  formatter={(value) => [`₹${(value / 100000).toFixed(1)}L`, "Total Payroll"]}
                />
                <Bar dataKey="totalPayrollINR" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Salary Distribution (INR)</h3>
          </div>
          <div style={{ width: "100%", height: 300, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1f2028", borderColor: "#2e303a" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Country Breakdown */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Payroll Breakdown by Country</h3>
          </div>
          <div className="table-container">
            <table className="data-table" id="table-country-payroll">
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Employees</th>
                  <th>Total Payroll (INR)</th>
                  <th>Local Currency Totals</th>
                </tr>
              </thead>
              <tbody>
                {payrollByCountry?.map(c => (
                  <tr key={c.country}>
                    <td style={{ fontWeight: 600 }}>{c.country}</td>
                    <td>{c.employeeCount}</td>
                    <td>{formatLakhs(c.totalPayrollINR)}</td>
                    <td>
                      {Object.keys(c.localCurrencies).map(curr => (
                        <span
                          key={curr}
                          className="badge"
                          style={{
                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                            color: "#3b82f6",
                            marginRight: "6px"
                          }}
                        >
                          {curr}: {c.localCurrencies[curr].toLocaleString()}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 10 Highest Paid */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Highest Paid Employees</h3>
          </div>
          <div className="table-container">
            <table className="data-table" id="table-highest-paid">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Country</th>
                  <th>Designation</th>
                  <th>Salary (Local)</th>
                  <th>Salary (INR)</th>
                </tr>
              </thead>
              <tbody>
                {highestPaid?.map(emp => (
                  <tr key={emp.id}>
                    <td style={{ fontWeight: 600 }}>{`${emp.firstName} ${emp.lastName}`}</td>
                    <td>{emp.department}</td>
                    <td>{emp.country}</td>
                    <td>{emp.designation}</td>
                    <td>{`${emp.currency} ${parseFloat(emp.salary).toLocaleString()}`}</td>
                    <td style={{ color: "#10b981", fontWeight: 600 }}>{formatLakhs(emp.salaryINR)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
