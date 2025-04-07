
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import ProfileSidebar from "@/components/dashboard/ProfileSidebar";
import DashboardTabs from "@/components/dashboard/DashboardTabs";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-220px)] bg-neutral-900 py-8">
        <div className="mindful-container">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <ProfileSidebar />

            {/* Main Content */}
            <div className="flex-1">
              <DashboardTabs />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
