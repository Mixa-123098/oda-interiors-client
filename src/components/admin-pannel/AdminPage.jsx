import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import authStore from "../../store/authStore";
import Header from "../Header";
import PagesHeader from "../Pages/PagesHeader";
import CreateProject from "./CreateProject";
import UsersStatus from "./UsersStatus";
import ProjectsEdit from "./ProjectsEdit";
import LanguagesManager from "./LanguagesManager";
import InquiriesManager from "./InquiriesManager";
import Footer from "../Footer";
import CropModalForm from "./CropModalForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { useTranslation } from "react-i18next";
import Loader from "../../loader/Loader";

const ALL_TABS = [
  {
    key: "inquiries",
    labelKey: "editPage.inquiries.tab",
    Component: InquiriesManager,
    roles: ["admin", "moderator"],
  },
  {
    key: "createProject",
    labelKey: "editPage.createNewProject.open_close",
    Component: CreateProject,
    roles: ["admin", "moderator"],
  },
  {
    key: "usersList",
    labelKey: "editPage.usersList.open_close",
    Component: UsersStatus,
    roles: ["admin"],
  },
  {
    key: "projectsEdit",
    labelKey: "editPage.editProject.open_close",
    Component: ProjectsEdit,
    roles: ["admin", "moderator"],
  },
  {
    key: "languages",
    labelKey: "editPage.languages.title",
    Component: LanguagesManager,
    roles: ["admin"],
  },
  {
    key: "changePassword",
    labelKey: "editPage.changePassword.open_close",
    Component: ChangePasswordForm,
    roles: ["admin", "moderator"],
  },
];

const AdminPage = observer(() => {
  const { t } = useTranslation();

  const { isReady, mustChangePassword, user } = authStore;
  const role = user?.role;
  const hasPanelAccess = role === "admin" || role === "moderator";
  const navigate = useNavigate();

  const tabs = ALL_TABS.filter((tab) => tab.roles.includes(role)).map(
    (tab) => ({ ...tab, label: t(tab.labelKey) })
  );

  const [activeTab, setActiveTab] = useState(() => tabs[0]?.key);

  // Non-staff normally have nowhere to go in the admin panel — but if they
  // were just password-reset, they still need to land here long enough to
  // change it, so the redirect is held off until that's resolved.
  useEffect(() => {
    if (isReady && !hasPanelAccess && !mustChangePassword) {
      navigate("/");
    }
  }, [navigate, isReady, hasPanelAccess, mustChangePassword]);

  if (!isReady) {
    return <Loader />;
  }

  if (mustChangePassword) {
    return (
      <>
        <Header fontColor="#000000" invert="invert(0%)" rep={true} />
        <PagesHeader title={t("editPage.changePassword.title")} showTitle />
        <div className="container mt-5 mb-5">
          <p className="text-muted">{t("editPage.changePassword.forcedHint")}</p>
          <ChangePasswordForm
            onSuccess={() => {
              if (!hasPanelAccess) navigate("/");
            }}
          />
        </div>
        <Footer settings={{ color: "black", bgColor: "white", shadow: true }} />
      </>
    );
  }

  if (!hasPanelAccess) {
    return <Loader />;
  }

  const ActiveComponent = (
    tabs.find((tab) => tab.key === activeTab) || tabs[0]
  ).Component;

  return (
    <>
      <Header fontColor="#000000" invert="invert(0%)" rep={true} />
      <PagesHeader title={t("editPage.adminPanel")} showTitle />

      <div className="container mt-5">
        <ul className="nav nav-tabs admin-tabs flex-wrap">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab.key}>
              <button
                type="button"
                className={`nav-link${activeTab === tab.key ? " active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="admin-tab-content">
          <ActiveComponent />
        </div>
      </div>

      <CropModalForm />
      <Footer settings={{ color: "black", bgColor: "white", shadow: true }} />
    </>
  );
});

export default AdminPage;
