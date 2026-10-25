import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import authStore from "../../store/authStore";
import { API_URL } from "../../config/api";

// The signed-in staff member's own account: what they sign in with and their
// role. Username and email can be edited here (confirmed with the current
// password); the role only by an admin. The password is never shown - only
// its hash is stored.
const MyAccount = observer(() => {
  const { t } = useTranslation();
  const { user } = authStore;
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  if (!user) return null;

  const roleLabels = {
    admin: t("editPage.usersList.roleAdmin"),
    moderator: t("editPage.usersList.roleModerator"),
    user: t("editPage.usersList.roleUser"),
  };
  const rows = [
    [t("editPage.account.username"), user.username],
    [t("editPage.account.email"), user.email || "—"],
    [t("editPage.account.role"), roleLabels[user.role] || user.role],
  ];

  const errorTexts = {
    invalid_current_password: t("editPage.changePassword.wrongCurrent"),
    invalid_username: t("editPage.account.invalidUsername"),
    username_taken: t("editPage.account.usernameTaken"),
    invalid_email: t("editPage.usersList.invalidEmail"),
    email_taken: t("editPage.usersList.emailTaken"),
  };

  const startEditing = () => {
    setUsername(user.username);
    setEmail(user.email || "");
    setCurrentPassword("");
    setStatus("idle");
    setErrorMessage("");
    setEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    try {
      const response = await fetch(`${API_URL}/me`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, currentPassword }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(errorTexts[data.error] || t("editPage.account.error"));
      }
      authStore.setUser(data);
      setCurrentPassword("");
      setEditing(false);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  };

  const submitting = status === "submitting";

  return (
    <div className="container mt-4 mb-4">
      <h1>{t("editPage.account.title")}</h1>

      {status === "success" && (
        <div className="alert alert-success mt-3" role="alert" style={{ maxWidth: 640 }}>
          {t("editPage.account.saved")}
        </div>
      )}

      {editing ? (
        <form onSubmit={handleSubmit} className="mt-4" style={{ maxWidth: 420 }}>
          {status === "error" && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <div className="mb-3">
            <label className="form-label" htmlFor="account-username">
              {t("editPage.account.username")}
            </label>
            <input
              id="account-username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={submitting}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="account-email">
              {t("editPage.account.email")}
            </label>
            <input
              id="account-email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={submitting}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="account-password">
              {t("editPage.account.currentPassword")}
            </label>
            <input
              id="account-password"
              type="password"
              className="form-control"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              disabled={submitting}
              required
            />
          </div>
          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-dark d-flex align-items-center gap-2"
              disabled={submitting}
            >
              {submitting && (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              {t("editPage.account.save")}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setEditing(false)}
              disabled={submitting}
            >
              {t("editPage.account.cancel")}
            </button>
          </div>
        </form>
      ) : (
        <>
          <dl className="row mt-4" style={{ maxWidth: 640 }}>
            {rows.map(([label, value]) => (
              <React.Fragment key={label}>
                <dt className="col-sm-4 text-muted fw-normal">{label}</dt>
                <dd className="col-sm-8">{value}</dd>
              </React.Fragment>
            ))}
          </dl>
          <button type="button" className="btn btn-dark" onClick={startEditing}>
            {t("editPage.account.edit")}
          </button>
        </>
      )}

      <p className="text-muted small mt-4">{t("editPage.account.passwordHint")}</p>
    </div>
  );
});

export default MyAccount;
