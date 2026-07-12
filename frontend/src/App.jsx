import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardTab from "./components/DashboardTab";
import EmployeesTab from "./components/EmployeesTab";
import NewEmployeeTab from "./components/NewEmployeeTab";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "employees":
        return <EmployeesTab />;
      case "new-employee":
        return <NewEmployeeTab onEmployeeCreated={() => setActiveTab("employees")} />;
      default:
        return <DashboardTab />;
    }
  };

  const getHeaderDetails = () => {
    switch (activeTab) {
      case "dashboard":
        return {
          title: "Payroll Analytics Dashboard",
          subtitle: "Real-time summary, country breakdown, and salary distribution."
        };
      case "employees":
        return {
          title: "Employee Management",
          subtitle: "Search, filter, view details, and manage salary histories."
        };
      case "new-employee":
        return {
          title: "Register Employee",
          subtitle: "Add a new employee to the system and record their starting salary."
        };
      default:
        return {
          title: "ACME Salary Management",
          subtitle: "Enterprise payroll metrics and employee administration."
        };
    }
  };

  const header = getHeaderDetails();

  return (
    <>
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Workspace */}
      <main className="main-content" id="app-main-content">
        <header className="app-header" id="app-header">
          <div className="header-title">
            <h1>{header.title}</h1>
            <p>{header.subtitle}</p>
          </div>
          <div style={{ fontSize: "14px", color: "hsl(var(--text-secondary))", fontWeight: 500 }}>
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </div>
        </header>

        {/* Tab Content Router */}
        <div className="tab-viewport" id="tab-viewport">
          {renderContent()}
        </div>
      </main>
    </>
  );
}
