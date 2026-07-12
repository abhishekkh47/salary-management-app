import React, { useState, useEffect } from "react";
import { api } from "../api";
import { UserPlus, CheckCircle } from "lucide-react";

export default function NewEmployeeTab({ onEmployeeCreated }) {
  const [form, setForm] = useState({
    employeeCode: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "MALE",
    departmentId: "",
    designationId: "",
    employmentTypeId: "",
    joiningDate: new Date().toISOString().split("T")[0],
    countryId: "",
    workLocation: "",
    managerId: "",
    salary: "",
    currency: "INR",
    effectiveDate: new Date().toISOString().split("T")[0]
  });

  const [lookups, setLookups] = useState({
    departments: [],
    countries: [],
    designations: [],
    employmentTypes: []
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchLookups = async () => {
    try {
      const res = await api.getLookups();
      setLookups(res.data || { departments: [], countries: [], designations: [], employmentTypes: [] });
      
      // Default select values on load if options exist
      const data = res.data;
      if (data) {
        setForm(prev => ({
          ...prev,
          departmentId: data.departments[0]?.id || "",
          designationId: data.designations[0]?.id || "",
          employmentTypeId: data.employmentTypes[0]?.id || "",
          countryId: data.countries[0]?.id || "",
          currency: data.countries[0]?.currency || "INR",
          workLocation: data.countries[0]?.name === "India" ? "Mumbai" : "New York"
        }));
      }
    } catch (e) {
      console.error("Error fetching lookups:", e);
    }
  };

  useEffect(() => {
    fetchLookups();
  }, []);

  const handleCountryChange = (countryIdVal) => {
    const selectedCountry = lookups.countries.find(c => String(c.id) === String(countryIdVal));
    setForm(prev => ({
      ...prev,
      countryId: countryIdVal,
      currency: selectedCountry ? selectedCountry.currency : prev.currency,
      workLocation: selectedCountry ? (selectedCountry.name === "India" ? "Mumbai" : "New York") : prev.workLocation
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      const payload = {
        ...form,
        departmentId: parseInt(form.departmentId, 10),
        designationId: parseInt(form.designationId, 10),
        employmentTypeId: parseInt(form.employmentTypeId, 10),
        countryId: parseInt(form.countryId, 10),
        salary: parseFloat(form.salary)
      };

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
        departmentId: lookups.departments[0]?.id || "",
        designationId: lookups.designations[0]?.id || "",
        employmentTypeId: lookups.employmentTypes[0]?.id || "",
        joiningDate: new Date().toISOString().split("T")[0],
        countryId: lookups.countries[0]?.id || "",
        workLocation: lookups.countries[0]?.name === "India" ? "Mumbai" : "New York",
        managerId: "",
        salary: "",
        currency: lookups.countries[0]?.currency || "INR",
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
              <select
                className="filter-select"
                required
                value={form.departmentId}
                onChange={e => setForm({ ...form, departmentId: e.target.value })}
              >
                <option value="">Select Department</option>
                {lookups.departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="filter-label">Designation *</label>
              <select
                className="filter-select"
                required
                value={form.designationId}
                onChange={e => setForm({ ...form, designationId: e.target.value })}
              >
                <option value="">Select Designation</option>
                {lookups.designations.map(d => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="filter-label">Employment Type *</label>
              <select
                className="filter-select"
                required
                value={form.employmentTypeId}
                onChange={e => setForm({ ...form, employmentTypeId: e.target.value })}
              >
                <option value="">Select Employment Type</option>
                {lookups.employmentTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="filter-label">Country *</label>
              <select
                className="filter-select"
                required
                value={form.countryId}
                onChange={e => handleCountryChange(e.target.value)}
              >
                <option value="">Select Country</option>
                {lookups.countries.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
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
                disabled
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              >
                {[...new Set(lookups.countries.map(c => c.currency))].map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
              <span style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                Autofilled based on selected country
              </span>
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
