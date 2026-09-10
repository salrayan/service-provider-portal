import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const [statsResponse, providersResponse] =
        await Promise.all([
          api.get("/admin/dashboard"),
          api.get(
            `/admin/providers?search=${search}&status=${status}`
          ),
        ]);

      setStats(statsResponse.data);
      setProviders(providersResponse.data.providers);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [search, status]);

  const updateStatus = async (id, newStatus) => {
    let rejectionRemarks = "";

    if (newStatus === "rejected") {
      rejectionRemarks = window.prompt(
        "Enter rejection remarks:"
      );

      if (!rejectionRemarks) return;
    }

    try {
      await api.put(`/admin/providers/${id}/status`, {
        status: newStatus,
        rejectionRemarks,
      });

      loadDashboard();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update application"
      );
    }
  };

  

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage service provider applications</p>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      <main className="admin-content">

        <div className="stats-grid">
          <StatCard
            title="Total Providers"
            value={stats.total || 0}
          />

          <StatCard
            title="Pending"
            value={stats.pending || 0}
          />

          <StatCard
            title="Approved"
            value={stats.approved || 0}
          />

          <StatCard
            title="Rejected"
            value={stats.rejected || 0}
          />
        </div>

        <div className="provider-section">

          <div className="section-header">
            <div>
              <h2>Provider Applications</h2>
              <p>Review and manage applications</p>
            </div>

            <div className="filters">
              <input
                type="text"
                placeholder="Search provider..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {providers.length === 0 ? (
            <div className="empty">
              No providers found.
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Category</th>
                    <th>Experience</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {providers.map((provider) => (
                    <tr key={provider._id}>
                      <td>
                        <strong>
                          {provider.userId?.name}
                        </strong>
                      </td>

                      <td>
                        {provider.userId?.email}
                      </td>

                      <td>
                        {provider.serviceCategories
                          ?.join(", ") || "-"}
                      </td>

                      <td>
                        {provider.experience ?? 0} years
                      </td>

                      <td>
                        {provider.serviceLocation?.city ||
                          "-"}
                      </td>

                      <td>
                        <span
                          className={`status ${provider.applicationStatus}`}
                        >
                          {provider.applicationStatus}
                        </span>
                      </td>

                     <td>
  <div className="action-buttons">

   <button
  className="view-btn"
  onClick={() =>
    navigate(`/admin/providers/${provider._id}`)
  }
>
  View
</button>

    {provider.applicationStatus ===
      "pending" && (
      <>
        <button
          className="approve-btn"
          onClick={() =>
            updateStatus(
              provider._id,
              "approved"
            )
          }
        >
          Approve
        </button>

        <button
          className="reject-btn"
          onClick={() =>
            updateStatus(
              provider._id,
              "rejected"
            )
          }
        >
          Reject
        </button>
      </>
    )}

    {provider.applicationStatus ===
      "approved" && (
      <span className="approved-text">
        Approved ✓
      </span>
    )}

    {provider.applicationStatus ===
      "rejected" && (
      <span className="rejected-text">
        Rejected
      </span>
    )}

  </div>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

export default AdminDashboard;