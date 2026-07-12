import React from "react";
import { LayoutDashboard, Users, UserPlus, LogOut } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="sidebar" id="app-sidebar">
      <div>
        <div className="logo-container">
          <div className="logo-icon">A</div>
          <span className="logo-text">ACME Payroll</span>
        </div>

        <div className="nav-links">
          <div
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
            id="nav-dashboard"
          >
            <LayoutDashboard />
            <span>Dashboard</span>
          </div>

          <div
            className={`nav-item ${activeTab === "employees" ? "active" : ""}`}
            onClick={() => setActiveTab("employees")}
            id="nav-employees"
          >
            <Users />
            <span>Employees</span>
          </div>

          <div
            className={`nav-item ${activeTab === "new-employee" ? "active" : ""}`}
            onClick={() => setActiveTab("new-employee")}
            id="nav-new-employee"
          >
            <UserPlus />
            <span>New Employee</span>
          </div>
        </div>
      </div>

      <div className="user-profile">
        <div className="user-avatar">HM</div>
        <div className="user-info">
          <span className="user-name">HR Manager</span>
          <span className="user-role">Administrator</span>
        </div>
      </div>
    </div>
  );
}
