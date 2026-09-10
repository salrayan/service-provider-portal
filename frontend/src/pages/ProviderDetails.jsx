import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ProviderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProvider = async () => {
    try {
      const response = await api.get(`/admin/providers/${id}`);
      setProvider(response.data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load provider"
      );
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProvider();
  }, [id]);

  const updateStatus = async (status) => {
    let rejectionRemarks = "";

    if (status === "rejected") {
      rejectionRemarks = window.prompt(
        "Please enter the rejection reason:"
      );

      if (!rejectionRemarks) {
        return;
      }
    }

    try {
      await api.put(`/admin/providers/${id}/status`, {
        status,
        rejectionRemarks,
      });

      await loadProvider();

      alert(
        status === "approved"
          ? "Application approved successfully."
          : "Application rejected successfully."
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update application"
      );
    }
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return null;

    const fileName = filePath.split("\\").pop().split("/").pop();

    return `http://localhost:5000/uploads/${fileName}`;
  };

  if (loading) {
    return (
      <div className="loading">
        Loading provider details...
      </div>
    );
  }

  if (!provider) {
    return null;
  }

  const profilePhoto = getFileUrl(
    provider.profilePhoto
  );

  const idProof = getFileUrl(
    provider.documents?.idProof
  );

  const addressProof = getFileUrl(
    provider.documents?.addressProof
  );

  return (
    <div className="details-page">

      <header className="details-header">
        <div>
          <button
            className="back-btn"
            onClick={() => navigate("/admin")}
          >
            ← Back to Dashboard
          </button>

          <h1>Provider Details</h1>
          <p>Review service provider information</p>
        </div>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </header>

      <main className="details-content">

        {/* Profile Header */}

        <section className="provider-profile-header">

          <div className="profile-photo">

            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Provider"
              />
            ) : (
              <span>
                {provider.userId?.name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </span>
            )}

          </div>

          <div className="provider-main-info">

            <h2>{provider.userId?.name}</h2>

            <p>
              {provider.userId?.email}
            </p>

            <span
              className={`status ${provider.applicationStatus}`}
            >
              {provider.applicationStatus}
            </span>

          </div>

        </section>

        {/* Personal Information */}

        <section className="details-card">

          <div className="card-title">
            <h2>Personal Information</h2>
          </div>

          <div className="details-grid">

            <DetailItem
              label="Full Name"
              value={provider.userId?.name}
            />

            <DetailItem
              label="Email"
              value={provider.userId?.email}
            />

            <DetailItem
              label="Phone"
              value={provider.phone}
            />

            <DetailItem
              label="Experience"
              value={`${provider.experience || 0} years`}
            />

          </div>

        </section>

        {/* Professional Information */}

        <section className="details-card">

          <div className="card-title">
            <h2>Professional Information</h2>
          </div>

          <div className="info-block">

            <h4>Service Categories</h4>

            <div className="tags">

              {provider.serviceCategories?.length ? (
                provider.serviceCategories.map(
                  (category, index) => (
                    <span key={index}>
                      {category}
                    </span>
                  )
                )
              ) : (
                <p>No categories added</p>
              )}

            </div>

          </div>

          <div className="info-block">

            <h4>Skills</h4>

            <div className="tags">

              {provider.skills?.length ? (
                provider.skills.map(
                  (skill, index) => (
                    <span key={index}>
                      {skill}
                    </span>
                  )
                )
              ) : (
                <p>No skills added</p>
              )}

            </div>

          </div>

        </section>

        {/* Location */}

        <section className="details-card">

          <div className="card-title">
            <h2>Service Location</h2>
          </div>

          <div className="details-grid">

            <DetailItem
              label="City"
              value={provider.serviceLocation?.city}
            />

            <DetailItem
              label="State"
              value={provider.serviceLocation?.state}
            />

            <DetailItem
              label="Pincode"
              value={provider.serviceLocation?.pincode}
            />

          </div>

        </section>

        {/* Documents */}

        <section className="details-card">

          <div className="card-title">

            <div>
              <h2>Verification Documents</h2>
              <p>
                Review the documents uploaded by the provider.
              </p>
            </div>

          </div>

          <div className="documents-grid">

            <DocumentCard
              title="Profile Photo"
              fileUrl={profilePhoto}
              image={true}
            />

            <DocumentCard
              title="ID Proof"
              fileUrl={idProof}
            />

            <DocumentCard
              title="Address Proof"
              fileUrl={addressProof}
            />

          </div>

        </section>

        {/* Rejection Remarks */}

        {provider.rejectionRemarks && (
          <section className="rejection-card">

            <h3>Rejection Remarks</h3>

            <p>
              {provider.rejectionRemarks}
            </p>

          </section>
        )}

        {/* Admin Actions */}

        {provider.applicationStatus === "pending" && (

          <section className="action-card">

            <div>
              <h2>Application Review</h2>

              <p>
                Review all information and documents before
                making a decision.
              </p>
            </div>

            <div className="review-buttons">

              <button
                className="approve-large"
                onClick={() =>
                  updateStatus("approved")
                }
              >
                ✓ Approve Application
              </button>

              <button
                className="reject-large"
                onClick={() =>
                  updateStatus("rejected")
                }
              >
                ✕ Reject Application
              </button>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">

      <span>{label}</span>

      <strong>
        {value || "Not provided"}
      </strong>

    </div>
  );
}

function DocumentCard({
  title,
  fileUrl,
  image = false,
}) {
  return (
    <div className="document-card">

      <div className="document-preview">

        {fileUrl && image ? (
          <img
            src={fileUrl}
            alt={title}
          />
        ) : fileUrl ? (
          <div className="file-icon">
            📄
          </div>
        ) : (
          <div className="file-icon empty-file">
            —
          </div>
        )}

      </div>

      <div className="document-info">

        <h4>{title}</h4>

        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="view-document"
          >
            View Document →
          </a>
        ) : (
          <span className="not-uploaded">
            Not uploaded
          </span>
        )}

      </div>

    </div>
  );
}

export default ProviderDetails;