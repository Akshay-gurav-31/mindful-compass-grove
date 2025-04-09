
import MainLayout from "@/components/layout/MainLayout";
import DoctorDashboardLayout from "@/components/dashboard/DoctorDashboardLayout";

const DoctorDashboard = () => {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-220px)] bg-neutral-900 py-8">
        <div className="mindful-container">
          <DoctorDashboardLayout />
        </div>
      </div>
    </MainLayout>
  );
};

export default DoctorDashboard;
