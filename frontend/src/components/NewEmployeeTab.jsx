import React, { useState } from "react";
import { api } from "../api";
import { UserPlus, CheckCircle } from "lucide-react";

export default function NewEmployeeTab({ onEmployeeCreated }) {
  const [form, setForm] = useState({
    employeeCode: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "MALE",
    department: "",
    designation: "",
    employmentType: "FULL_TIME",
    joiningDate: new Date().toISOString().split("T")[0],
    country: "India",
    workLocation: "Mumbai",
    managerId: "",
    salary: "",
    currency: "INR",
    effectiveDate: new Date().toISOString().split("T")[0]
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      const payload = { ...form };
      // Parse numbers/nulls
      payload.salary = parseFloat(payload.salary);
      if (payload.managerId === "") {
        payload.managerId = null;
      } else {
        payload.managerId = parseInt(payload.managerId, 10);
      }

      await api.createEmployee(payload);
      setSuccess(true);
      // Reset form
      setForm({
        employeeCode: "",
        firstName: "",
        lastName: "",
        email: "",
        gender: "MALE",
        department: "",
        designation: "",
        employmentType: "FULL_TIME",
        joiningDate: new Date().toISOString().split("T")[0],
        country: "India",
        workLocation: "Mumbai",
        managerId: "",
        salary: "",
        currency: "INR",
        effectiveDate: new Date().toISOString().split("T")[0]
      });
      if (typeof onEmployeeCreated === "function") {
        onEmployeeCreated();
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-employee-tab">
      <div className="form-card">
        <h2 style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
          <UserPlus className="kpi-icon" />
          <span>Register New Employee</span>
        </h2>

        {errorMsg && (
          <div
            style={{
              color: "#ef4444",
              fontSize: "14px",
              marginBottom: "20px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              padding: "12px",
              borderRadius: "8px"
            }}
          >
            {errorMsg}
          </div>
        )}

        {success && (
          <div
            style={{
              color: "#10b981",
              fontSize: "14px",
              marginBottom: "20px",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              padding: "12px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <CheckCircle size={16} />
            <span>Employee registered successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} id="new-employee-form">
          <div className="form-grid">
            {/* Employee Details */}
            <div className="form-group">
              <label className="filter-label">Employee Code *</label>
              <input
                type="text"
                className="form-input"
                required
                value={form.employeeCode}
                onChange={e => setForm({ ...form, employeeCode: e.target.value })}
                placeholder="e.g. EMP-101"
              />
            </div>

            <div className="form-group">
              <label className="filter-label">Email *</label>
              <input
                type="email"
                className="form-input"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. name@acme.com"
              />
            </div>

            <div className="form-group">
              <label className="filter-label">First Name *</label>
              <input
                type="text"
                className="form-input"
                required
                value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="filter-label">Last Name *</label>
              <input
                type="text"
                className="form-input"
                required
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="filter-label">Gender *</label>
              <select
                className="filter-select"
                required
                value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value })}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="filter-label">Department *</label>
              <input
                type="text"
                className="form-input"
                required
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
                placeholder="e.g. Engineering"
              />
            </div>

            <div className="form-group">
              <label className="filter-label">Designation *</label>
              <input
                type="text"
                className="form-input"
                required
                value={form.designation}
                onChange={e => setForm({ ...form, designation: e.target.value })}
                placeholder="e.g. Senior Developer"
              />
            </div>

            <div className="form-group">
              <label className="filter-label">Employment Type *</label>
              <select
                className="filter-select"
                required
                value={form.employmentType}
                onChange={e => setForm({ ...form, employmentType: e.target.value })}
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="CONTRACTOR">Contractor</option>
                <option value="INTERN">Intern</option>
              </select>
            </div>

            <div className="form-group">
              <label className="filter-label">Country *</label>
              <input
                type="text"
                className="form-input"
                required
                value={form.country}
                onChange={e => setForm({ ...form, country: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="filter-label">Work Location *</label>
              <input
                type="text"
                className="form-input"
                required
                value={form.workLocation}
                onChange={e => setForm({ ...form, workLocation: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="filter-label">Joining Date *</label>
              <input
                type="date"
                className="form-input"
                required
                value={form.joiningDate}
                onChange={e => setForm({ ...form, joiningDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="filter-label">Manager ID (Optional)</label>
              <input
                type="number"
                className="form-input"
                value={form.managerId}
                onChange={e => setForm({ ...form, managerId: e.target.value })}
                placeholder="None"
              />
            </div>

            {/* Starting Salary Details */}
            <div className="form-group full-width" style={{ borderTop: "1px solid #2e303a", paddingTop: "20px", marginTop: "10px" }}>
              <h3 style={{ fontSize: "16px", marginBottom: "16px" }}>Starting Salary Details</h3>
            </div>

            <div className="form-group">
              <label className="filter-label">Starting Salary *</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                required
                value={form.salary}
                onChange={e => setForm({ ...form, salary: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="filter-label">Currency *</label>
              <select
                className="filter-select"
                required
                value={form.currency}
                onChange={e => setForm({ ...form, currency: e.target.value })}
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div className="form-group">
              <label className="filter-label">Salary Effective Date *</label>
              <input
                type="date"
                className="form-input"
                required
                value={form.effectiveDate}
                onChange={e => setForm({ ...form, effectiveDate: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn" disabled={loading} id="btn-submit-employee">
              {loading ? "Registering..." : "Register Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
