import React, { useState, useEffect } from "react";
import { api } from "../api";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  X,
  History,
  TrendingUp
} from "lucide-react";

export default function EmployeesTab() {
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    country: "",
    department: "",
    employmentStatus: ""
  });

  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Revision Form State
  const [revisionForm, setRevisionForm] = useState({
    salary: "",
    currency: "INR",
    effectiveDate: new Date().toISOString().split("T")[0],
    revisionReason: "ANNUAL_REVIEW"
  });

  // Edit Employee Form State
  const [editForm, setEditForm] = useState({
    employeeCode: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "MALE",
    department: "",
    designation: "",
    employmentType: "FULL_TIME",
    employmentStatus: "ACTIVE",
    joiningDate: "",
    country: "",
    workLocation: "",
    managerId: ""
  });

  const [errorMsg, setErrorMsg] = useState("");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        search,
        ...filters
      };
      const data = await api.getEmployees(params);
      setEmployees(data.data || []);
      setTotal(data.meta?.total || 0);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, search, filters]);

  const handleOpenDrawer = async (emp) => {
    try {
      const details = await api.getEmployeeById(emp.id);
      setSelectedEmployee(details.data);
      setShowDrawer(true);
    } catch (e) {
      alert("Error fetching employee details: " + e.message);
    }
  };

  const handleDelete = async (empId) => {
    if (window.confirm("Are you sure you want to deactivate/delete this employee?")) {
      try {
        await api.deleteEmployee(empId);
        alert("Employee deactivated successfully.");
        fetchEmployees();
        setShowDrawer(false);
      } catch (e) {
        alert("Error deactivating employee: " + e.message);
      }
    }
  };

  const handleAddRevisionSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await api.addSalaryHistory(selectedEmployee.id, {
        salary: parseFloat(revisionForm.salary),
        currency: revisionForm.currency,
        effectiveDate: revisionForm.effectiveDate,
        revisionReason: revisionForm.revisionReason
      });
      alert("Salary history record added successfully.");
      setShowRevisionModal(false);
      setRevisionForm({
        salary: "",
        currency: "INR",
        effectiveDate: new Date().toISOString().split("T")[0],
        revisionReason: "ANNUAL_REVIEW"
      });
      // Refresh drawer
      const details = await api.getEmployeeById(selectedEmployee.id);
      setSelectedEmployee(details.data);
      fetchEmployees();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleOpenEditModal = () => {
    setEditForm({
      employeeCode: selectedEmployee.employeeCode,
      firstName: selectedEmployee.firstName,
      lastName: selectedEmployee.lastName,
      email: selectedEmployee.email,
      gender: selectedEmployee.gender,
      department: selectedEmployee.department,
      designation: selectedEmployee.designation,
      employmentType: selectedEmployee.employmentType,
      employmentStatus: selectedEmployee.employmentStatus,
      joiningDate: selectedEmployee.joiningDate,
      country: selectedEmployee.country,
      workLocation: selectedEmployee.workLocation,
      managerId: selectedEmployee.managerId || ""
    });
    setErrorMsg("");
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const payload = { ...editForm };
      if (payload.managerId === "") {
        payload.managerId = null;
      } else {
        payload.managerId = parseInt(payload.managerId, 10);
      }
      await api.updateEmployee(selectedEmployee.id, payload);
      alert("Employee details updated successfully.");
      setShowEditModal(false);
      // Refresh drawer
      const details = await api.getEmployeeById(selectedEmployee.id);
      setSelectedEmployee(details.data);
      fetchEmployees();
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const formatLakhs = (val) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)}L`;
    }
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="employees-tab" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Search and Filters */}
      <div className="filters-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "12px", color: "#9ca3af" }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: "36px", minWidth: "240px" }}
            placeholder="Search code, name, email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            id="search-employee"
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={filters.country}
            onChange={e => { setFilters({ ...filters, country: e.target.value }); setPage(1); }}
            id="list-filter-country"
          >
            <option value="">All Countries</option>
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={filters.employmentStatus}
            onChange={e => { setFilters({ ...filters, employmentStatus: e.target.value }); setPage(1); }}
            id="list-filter-status"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Loading employee records...</div>
        ) : (
          <table className="data-table" id="employees-data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} onClick={() => handleOpenDrawer(emp)}>
                  <td style={{ fontWeight: 600 }}>{emp.employeeCode}</td>
                  <td>{`${emp.firstName} ${emp.lastName}`}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>
                    <span className={`badge ${(emp.employmentStatus || "").toLowerCase()}`}>
                      {emp.employmentStatus}
                    </span>
                  </td>
                  <td>{`${emp.workLocation}, ${emp.country}`}</td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>
                    No employee records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <span style={{ fontSize: "14px", color: "#9ca3af" }}>
          Showing {employees.length} of {total} employees
        </span>

        <div className="pagination-buttons">
          <button
            className="btn btn-outline"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            id="btn-prev-page"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>
          <button
            className="btn btn-outline"
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            id="btn-next-page"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Details Slide-out Drawer */}
      {showDrawer && selectedEmployee && (
        <>
          <div className="drawer-overlay" onClick={() => setShowDrawer(false)}></div>
          <div className="drawer" id="employee-detail-drawer">
            <div className="drawer-header">
              <div>
                <h2>{`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}</h2>
                <p style={{ color: "#9ca3af", fontSize: "14px", marginTop: "2px" }}>
                  {selectedEmployee.designation} &bull; {selectedEmployee.employeeCode}
                </p>
              </div>
              <X className="modal-close" onClick={() => setShowDrawer(false)} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn" onClick={handleOpenEditModal} id="drawer-edit-emp">
                  <Edit2 size={14} />
                  <span>Edit Details</span>
                </button>
                <button
                  className="btn btn-outline btn-danger"
                  style={{ border: "none" }}
                  onClick={() => handleDelete(selectedEmployee.id)}
                  id="drawer-deactivate-emp"
                >
                  <Trash2 size={14} />
                  <span>Deactivate</span>
                </button>
              </div>

              <div className="info-section" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>Email</span>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{selectedEmployee.email}</p>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>Gender</span>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{selectedEmployee.gender}</p>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>Department</span>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{selectedEmployee.department}</p>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>Employment Type</span>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{selectedEmployee.employmentType.replace("_", " ")}</p>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>Country</span>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{selectedEmployee.country}</p>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>Work Location</span>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{selectedEmployee.workLocation}</p>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>Joining Date</span>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{new Date(selectedEmployee.joiningDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>Manager ID</span>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{selectedEmployee.managerId || "None"}</p>
                </div>
              </div>

              {/* Salary Revision Timeline */}
              <div style={{ marginTop: "24px", borderTop: "1px solid #2e303a", paddingTop: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px" }}>
                    <History size={16} className="kpi-icon" />
                    <span>Salary & Revision History</span>
                  </h3>
                  <button
                    className="btn btn-outline"
                    style={{ padding: "6px 12px", fontSize: "12px" }}
                    onClick={() => { setErrorMsg(""); setShowRevisionModal(true); }}
                    id="btn-add-revision"
                  >
                    <Plus size={14} />
                    <span>Revise</span>
                  </button>
                </div>

                <div className="timeline">
                  {selectedEmployee.salaryHistory?.sort((a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate)).map((history, idx) => (
                    <div className="timeline-item" key={history.id}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <span className="timeline-date">{new Date(history.effectiveDate).toLocaleDateString()}</span>
                        <span className="timeline-title" style={{ fontSize: "15px", color: "#10b981" }}>
                          {`${history.currency} ${parseFloat(history.salary).toLocaleString()}`}
                        </span>
                        <span className="timeline-desc" style={{ textTransform: "lowercase" }}>
                          {history.revisionReason.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add Salary Revision Modal */}
      {showRevisionModal && (
        <div className="modal-overlay">
          <div className="modal-content" id="modal-salary-revision">
            <div className="modal-header">
              <h3>New Salary Revision</h3>
              <X className="modal-close" onClick={() => setShowRevisionModal(false)} />
            </div>

            {errorMsg && (
              <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "8px", borderRadius: "6px" }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddRevisionSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
                <div className="filter-group">
                  <label className="filter-label">New Salary</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={revisionForm.salary}
                    onChange={e => setRevisionForm({ ...revisionForm, salary: e.target.value })}
                    required
                    id="revision-salary"
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">Currency</label>
                  <select
                    className="filter-select"
                    value={revisionForm.currency}
                    onChange={e => setRevisionForm({ ...revisionForm, currency: e.target.value })}
                    required
                    id="revision-currency"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Effective Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={revisionForm.effectiveDate}
                    onChange={e => setRevisionForm({ ...revisionForm, effectiveDate: e.target.value })}
                    required
                    id="revision-effective-date"
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">Revision Reason</label>
                  <select
                    className="filter-select"
                    value={revisionForm.revisionReason}
                    onChange={e => setRevisionForm({ ...revisionForm, revisionReason: e.target.value })}
                    required
                    id="revision-reason"
                  >
                    <option value="ANNUAL_REVIEW">Annual Review</option>
                    <option value="PROMOTION">Promotion</option>
                    <option value="MARKET_ADJUSTMENT">Market Adjustment</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowRevisionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn" id="btn-save-revision">
                  Save Revision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Details Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "600px" }} id="modal-edit-employee">
            <div className="modal-header">
              <h3>Edit Employee Details</h3>
              <X className="modal-close" onClick={() => setShowEditModal(false)} />
            </div>

            {errorMsg && (
              <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "8px", borderRadius: "6px" }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleEditSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div className="filter-group">
                  <label className="filter-label">First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.firstName}
                    onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                    required
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">Last Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.lastName}
                    onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                    required
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">Gender</label>
                  <select
                    className="filter-select"
                    value={editForm.gender}
                    onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                    required
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.department}
                    onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                    required
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">Designation</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.designation}
                    onChange={e => setEditForm({ ...editForm, designation: e.target.value })}
                    required
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">Country</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.country}
                    onChange={e => setEditForm({ ...editForm, country: e.target.value })}
                    required
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">Work Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.workLocation}
                    onChange={e => setEditForm({ ...editForm, workLocation: e.target.value })}
                    required
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">Employment Status</label>
                  <select
                    className="filter-select"
                    value={editForm.employmentStatus}
                    onChange={e => setEditForm({ ...editForm, employmentStatus: e.target.value })}
                    required
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Manager ID</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editForm.managerId}
                    onChange={e => setEditForm({ ...editForm, managerId: e.target.value })}
                    placeholder="None"
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn" id="btn-save-edit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
