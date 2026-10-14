import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { API_URL } from "../../config/api";
import languagesStore from "../../store/languagesStore";
import TranslationsEditor from "./TranslationsEditor";
import { DEFAULT_LANG, localizePath, toUrlCode } from "../../lib/lang";

// Server error codes that mean the code itself is the problem.
const codeErrorKey = (error) =>
  ({
    language_exists: "editPage.languages.codeExists",
    code_reserved: "editPage.languages.reservedCode",
    cannot_change_default: "editPage.languages.defaultLocked",
  })[error];

const LanguagesManager = () => {
  const { t } = useTranslation();
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [editingLang, setEditingLang] = useState(null);
  const [editingMeta, setEditingMeta] = useState(null); // code of the row whose code/name is being edited
  const [metaCode, setMetaCode] = useState("");
  const [metaName, setMetaName] = useState("");
  const [metaStatus, setMetaStatus] = useState("idle"); // idle | submitting | error
  const [metaError, setMetaError] = useState("");

  const loadLanguages = () => {
    setLoading(true);
    fetch(`${API_URL}/languages`)
      .then((response) => response.json())
      .then((data) => setLanguages(data))
      .catch((error) => console.error("Error fetching languages:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLanguages();
  }, []);

  const handleAddLanguage = async (e) => {
    e.preventDefault();
    const trimmedCode = code.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!/^[a-z]{2,3}$/.test(trimmedCode)) {
      setStatus("error");
      setErrorMessage(t("editPage.languages.invalidCode"));
      return;
    }
    if (!trimmedName) {
      setStatus("error");
      setErrorMessage(t("editPage.languages.missingName"));
      return;
    }

    setStatus("submitting");
    setErrorMessage("");
    try {
      const sourceResponse = await fetch(`${API_URL}/languages/ua/translations`);
      const sourceContent = await sourceResponse.json();

      const response = await fetch(`${API_URL}/languages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmedCode, name: trimmedName, sourceContent }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "request_failed");
      }

      const data = await response.json();
      setStatus("success");
      setName("");
      setCode("");
      if (data.failed_project_ids && data.failed_project_ids.length > 0) {
        setErrorMessage(
          t("editPage.languages.backfillWarning", {
            translated: data.projects_translated,
            total: data.projects_total,
            ids: data.failed_project_ids.join(", "),
          })
        );
      }
      loadLanguages();
      languagesStore.refresh();
    } catch (error) {
      console.error("Error adding language:", error);
      setStatus("error");
      setErrorMessage(
        error.message === "language_exists"
          ? t("editPage.languages.languageExists")
          : error.message === "code_reserved"
          ? t("editPage.languages.reservedCode")
          : t("editPage.languages.addFailed")
      );
    }
  };

  const handleDelete = async (langCode) => {
    if (!window.confirm(t("editPage.languages.deleteConfirm", { code: langCode }))) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}/languages/${langCode}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "delete_failed");
      }
      loadLanguages();
      languagesStore.refresh();
    } catch (error) {
      console.error("Error deleting language:", error);
      alert(
        error.message === "cannot_delete_last_language"
          ? t("editPage.languages.cannotDeleteLast")
          : error.message === "cannot_delete_default"
          ? t("editPage.languages.defaultLocked")
          : t("editPage.languages.deleteFailed")
      );
    }
  };

  const startEditingMeta = (lang) => {
    setEditingMeta(lang.code);
    setMetaCode(lang.code);
    setMetaName(lang.name);
    setMetaStatus("idle");
    setMetaError("");
  };

  const cancelEditingMeta = () => {
    setEditingMeta(null);
    setMetaStatus("idle");
    setMetaError("");
  };

  const handleSaveMeta = async (oldCode) => {
    const trimmedCode = metaCode.trim().toLowerCase();
    const trimmedName = metaName.trim();

    if (!/^[a-z]{2,3}$/.test(trimmedCode)) {
      setMetaStatus("error");
      setMetaError(t("editPage.languages.invalidCode"));
      return;
    }
    if (!trimmedName) {
      setMetaStatus("error");
      setMetaError(t("editPage.languages.missingName"));
      return;
    }

    setMetaStatus("submitting");
    setMetaError("");
    try {
      const response = await fetch(`${API_URL}/languages/${oldCode}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmedCode, name: trimmedName }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "request_failed");
      }

      setEditingMeta(null);
      setMetaStatus("idle");
      loadLanguages();
      languagesStore.refresh();
    } catch (error) {
      console.error("Error updating language:", error);
      setMetaStatus("error");
      setMetaError(
        codeErrorKey(error.message)
          ? t(codeErrorKey(error.message))
          : t("editPage.languages.saveMetaFailed")
      );
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">{t("editPage.languages.title")}</h2>

      {loading ? (
        <p>{t("editPage.languages.loading")}</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>{t("editPage.languages.code")}</th>
              <th>{t("editPage.languages.name")}</th>
              <th>{t("editPage.languages.address")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {languages.map((lang) => (
              <React.Fragment key={lang.code}>
                <tr>
                  {editingMeta === lang.code ? (
                    <>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={metaCode}
                          onChange={(e) => setMetaCode(e.target.value)}
                          disabled={
                            metaStatus === "submitting" || lang.code === DEFAULT_LANG
                          }
                          style={{ maxWidth: 90 }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={metaName}
                          onChange={(e) => setMetaName(e.target.value)}
                          disabled={metaStatus === "submitting"}
                        />
                      </td>
                      <td className="small text-muted">
                        {lang.code === DEFAULT_LANG
                          ? t("editPage.languages.defaultLocked")
                          : t("editPage.languages.codeChangeWarning")}
                      </td>
                      <td className="d-flex gap-2">
                        <button
                          className="btn btn-dark btn-sm"
                          onClick={() => handleSaveMeta(lang.code)}
                          disabled={metaStatus === "submitting"}
                        >
                          {metaStatus === "submitting"
                            ? t("editPage.languages.saving")
                            : t("editPage.languages.save")}
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={cancelEditingMeta}
                          disabled={metaStatus === "submitting"}
                        >
                          {t("editPage.languages.cancel")}
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{lang.code.toUpperCase()}</td>
                      <td>{lang.name}</td>
                      <td>
                        <a
                          href={localizePath("/", lang.code)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {lang.code === DEFAULT_LANG ? "/" : `/${toUrlCode(lang.code)}/`}
                        </a>
                      </td>
                      <td className="d-flex gap-2">
                        <button
                          className="btn btn-outline-dark btn-sm"
                          onClick={() => startEditingMeta(lang)}
                        >
                          {t("editPage.languages.edit")}
                        </button>
                        <button
                          className="btn btn-outline-dark btn-sm"
                          onClick={() =>
                            setEditingLang((prev) =>
                              prev === lang.code ? null : lang.code
                            )
                          }
                        >
                          {editingLang === lang.code
                            ? t("editPage.languages.close")
                            : t("editPage.languages.editTranslations")}
                        </button>
                        {lang.code !== DEFAULT_LANG && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(lang.code)}
                          >
                            {t("editPage.languages.delete")}
                          </button>
                        )}
                      </td>
                    </>
                  )}
                </tr>
                {editingMeta === lang.code && metaStatus === "error" && (
                  <tr>
                    <td colSpan={4}>
                      <div className="alert alert-danger py-1 small mb-0" role="alert">
                        {metaError}
                      </div>
                    </td>
                  </tr>
                )}
                {editingLang === lang.code && (
                  <tr>
                    <td colSpan={4}>
                      <TranslationsEditor
                        langCode={lang.code}
                        otherLanguages={languages.filter((l) => l.code !== lang.code)}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      <p className="text-muted small">{t("editPage.languages.addressHint")}</p>

      <h4 className="mt-5">{t("editPage.languages.addNew")}</h4>
      <p className="text-muted small">{t("editPage.languages.addNewHint")}</p>

      {status === "success" && (
        <div className="alert alert-success" role="alert">
          {t("editPage.languages.addSuccess")}
        </div>
      )}
      {status === "success" && errorMessage && (
        <div className="alert alert-warning" role="alert">
          {errorMessage}
        </div>
      )}
      {status === "error" && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleAddLanguage} className="row g-2 align-items-center">
        <div className="col-auto">
          <input
            type="text"
            className="form-control"
            placeholder={t("editPage.languages.namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === "submitting"}
          />
        </div>
        <div className="col-auto">
          <input
            type="text"
            className="form-control"
            placeholder={t("editPage.languages.codePlaceholder")}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={status === "submitting"}
            style={{ maxWidth: 120 }}
          />
        </div>
        <div className="col-auto">
          <button
            type="submit"
            className="btn btn-dark d-flex align-items-center gap-2"
            disabled={status === "submitting"}
          >
            {status === "submitting" && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            {status === "submitting"
              ? t("editPage.languages.translating")
              : t("editPage.languages.addSubmit")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LanguagesManager;
