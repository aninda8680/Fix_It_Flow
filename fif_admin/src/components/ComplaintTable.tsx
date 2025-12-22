import API from "../api/adminApi";

export default function ComplaintTable({ complaints, refresh }: any) {
  const updateStatus = async (id: string, status: string) => {
    await API.patch(`/complaints/admin/${id}/status`, { status });
    refresh();
  };

  return (
    <div className="overflow-x-auto bg-zinc-900 rounded-xl">
      <table className="w-full text-left">
        <thead className="bg-zinc-800">
          <tr>
            <th className="p-4">User</th>
            <th className="p-4">Issue</th>
            <th className="p-4">Images</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((c: any) => (
            <tr key={c._id} className="border-t border-zinc-700">
              <td className="p-4">{c.user?.email}</td>
              <td className="p-4">{c.issueType || "AI Pending"}</td>
              <td className="p-4 flex gap-2">
                {c.images.map((img: any) => (
                  <img
                    key={img.url}
                    src={img.url}
                    className="w-16 h-16 rounded object-cover"
                  />
                ))}
              </td>
              <td className="p-4">
                <select
                  value={c.status}
                  onChange={(e) => updateStatus(c._id, e.target.value)}
                  className="bg-black border border-zinc-700 p-2 rounded"
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
