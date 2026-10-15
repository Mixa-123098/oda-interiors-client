import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import authStore from "../../store/authStore";

// The signed-in staff member's own account: what they sign in with and their
// role. The password is never shown - only its hash is stored.
const MyAccount = observer(() => {
  const { t } = useTranslation();
  const { user } = authStore;
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

  return (
    <div className="container mt-4 mb-4">
      <h1>{t("editPage.account.title")}</h1>
      <dl className="row mt-4" style={{ maxWidth: 640 }}>
        {rows.map(([label, value]) => (
          <React.Fragment key={label}>
            <dt className="col-sm-4 text-muted fw-normal">{label}</dt>
            <dd className="col-sm-8">{value}</dd>
          </React.Fragment>
        ))}
      </dl>
      <p className="text-muted small">{t("editPage.account.hint")}</p>
    </div>
  );
});

export default MyAccount;
