import { useEffect, useState } from "react";
import API from "../api/adminApi";
import ComplaintTable from "../components/ComplaintTable";

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    const res = await API.get("/complaints/admin/all");
    setComplaints(res.data.complaints);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <ComplaintTable complaints={complaints} refresh={fetchComplaints} />
      </div>
    </div>
  );
}
