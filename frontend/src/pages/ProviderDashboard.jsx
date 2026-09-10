import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ProviderDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    phone: "",
    serviceCategories: "",
    skills: "",
    experience: "",
    city: "",
    state: "",
    pincode: "",
  });

  const loadProfile = async () => {
    try {
      const response = await api.get("/providers/profile");

      const data = response.data;

      setProfile(data);

      setFormData({
        phone: data.phone || "",
        serviceCategories:
          data.serviceCategories?.join(", ") || "",
        skills: data.skills?.join(", ") || "",
        experience: data.experience || "",
        city: data.serviceLocation?.city || "",
        state: data.serviceLocation?.state || "",
        pincode: data.serviceLocation?.pincode || "",
      });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        setError("Unable to load your profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const payload = {
        phone: formData.phone,

        serviceCategories: formData.serviceCategories
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        skills: formData.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        experience: Number(formData.experience),

        serviceLocation: {
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
      };

      await api.put("/providers/profile", payload);

      setMessage("Profile saved successfully.");
      loadProfile();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save profile"
      );
    }
  };

  const submitApplication = async () => {
    try {
      setMessage("");
      setError("");

      await api.post("/providers/submit");

      setMessage("Application submitted successfully.");
      loadProfile();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit application"
      );
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const status = profile?.applicationStatus || "draft";

  return (
    <div className="dashboard">
      <header className="topbar">
        <div>
          <h2>Service Provider Portal</h2>
          <p>Complete your profile to apply</p>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="status-card">
          <div>
            <h3>Application Status</h3>
            <p>
              {status === "draft" &&
                "Complete your profile and submit your application."}

              {status === "pending" &&
                "Your application is being reviewed."}

              {status === "approved" &&
                "Congratulations! Your application has been approved."}

              {status === "rejected" &&
                "Your application was rejected. Please check the remarks."}
            </p>
          </div>

          <span className={`status ${status}`}>
            {status.toUpperCase()}
          </span>
        </div>

        {profile?.rejectionRemarks && (
          <div className="rejection">
            <strong>Rejection Remarks:</strong>
            <p>{profile.rejectionRemarks}</p>
          </div>
        )}

        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}

        <div className="profile-card">
          <h2>My Profile</h2>
          <p className="section-description">
            Add your professional information and service
            location.
          </p>

          <form onSubmit={saveProfile}>
            <div className="form-grid">
              <div>
                <label>Phone Number</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  required
                  disabled={status === "approved"}
                />
              </div>

              <div>
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  placeholder="2"
                  required
                  disabled={status === "approved"}
                />
              </div>

              <div className="full-width">
                <label>Service Categories</label>
                <input
                  name="serviceCategories"
                  value={formData.serviceCategories}
                  onChange={handleChange}
                  placeholder="Cleaning, Electrical, Plumbing"
                  required
                  disabled={status === "approved"}
                />
                <small>
                  Separate multiple categories with commas.
                </small>
              </div>

              <div className="full-width">
                <label>Skills</label>
                <input
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Deep Cleaning, Wiring, Plumbing"
                  required
                  disabled={status === "approved"}
                />
                <small>
                  Separate multiple skills with commas.
                </small>
              </div>

              <div>
                <label>City</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Bengaluru"
                  required
                  disabled={status === "approved"}
                />
              </div>

              <div>
                <label>State</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Karnataka"
                  required
                  disabled={status === "approved"}
                />
              </div>

              <div>
                <label>Pincode</label>
                <input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="560001"
                  required
                  disabled={status === "approved"}
                />
              </div>
            </div>

            {status !== "approved" && (
              <div className="button-row">
                <button type="submit">
                  Save Profile
                </button>

                <button
                  type="button"
                  className="submit-btn"
                  onClick={submitApplication}
                >
                  Submit Application
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="profile-card">
          <h2>Verification Documents</h2>

          <p className="section-description">
            Upload your profile photo and verification
            documents.
          </p>

          <DocumentUpload
            onSuccess={(msg) => {
              setMessage(msg);
              loadProfile();
            }}
            onError={setError}
            disabled={status === "approved"}
          />

          <div className="documents-list">
            <p>
              ID Proof:{" "}
              {profile?.documents?.idProof
                ? "Uploaded ✓"
                : "Not uploaded"}
            </p>

            <p>
              Address Proof:{" "}
              {profile?.documents?.addressProof
                ? "Uploaded ✓"
                : "Not uploaded"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function DocumentUpload({
  onSuccess,
  onError,
  disabled,
}) {
  const [files, setFiles] = useState({});

  const handleUpload = async () => {
    try {
      if (
        !files.profilePhoto &&
        !files.idProof &&
        !files.addressProof
      ) {
        onError("Please select at least one file.");
        return;
      }

      const data = new FormData();

      if (files.profilePhoto) {
        data.append("profilePhoto", files.profilePhoto);
      }

      if (files.idProof) {
        data.append("idProof", files.idProof);
      }

      if (files.addressProof) {
        data.append("addressProof", files.addressProof);
      }

      await api.post("/providers/documents", data);

      onSuccess("Documents uploaded successfully.");
      setFiles({});
    } catch (err) {
      onError(
        err.response?.data?.message ||
          "Upload failed"
      );
    }
  };

  return (
    <div className="upload-area">
      <div>
        <label>Profile Photo</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          disabled={disabled}
          onChange={(e) =>
            setFiles({
              ...files,
              profilePhoto: e.target.files[0],
            })
          }
        />
      </div>

      <div>
        <label>ID Proof</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          disabled={disabled}
          onChange={(e) =>
            setFiles({
              ...files,
              idProof: e.target.files[0],
            })
          }
        />
      </div>

      <div>
        <label>Address Proof</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          disabled={disabled}
          onChange={(e) =>
            setFiles({
              ...files,
              addressProof: e.target.files[0],
            })
          }
        />
      </div>

      {!disabled && (
        <button
          type="button"
          onClick={handleUpload}
        >
          Upload Documents
        </button>
      )}
    </div>
  );
}

export default ProviderDashboard;