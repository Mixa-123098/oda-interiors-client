import React, { useState, useEffect, useMemo } from "react";
import { API_URL } from "../../config/api";

// Nested translation JSON (editPage.usersList.resetPassword: "...") is
// flattened to dot-path -> string pairs for editing, then rebuilt into the
// original nested shape on save. A flat list is far simpler to search and
// edit than a recursive tree UI, and works for any key structure without
// hardcoding sections.
const flatten = (obj, prefix = "") => {
  const result = {};
  for (const [key, value] of Object.entries(obj || {})) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flatten(value, path));
    } else {
      result[path] = value;
    }
  }
  return result;
};

const unflatten = (flat) => {
  const result = {};
  for (const [path, value] of Object.entries(flat)) {
    const keys = path.split(".");
    let current = result;
    keys.forEach((key, i) => {
      if (i === keys.length - 1) {
        current[key] = value;
      } else {
        current[key] = current[key] || {};
        current = current[key];
      }
    });
  }
  return result;
};

const TranslationsEditor = ({ langCode, otherLanguages = [] }) => {
  const [entries, setEntries] = useState(null); // { path: value } | null while loading
  const [originalEntries, setOriginalEntries] = useState(null); // snapshot as loaded, used to detect what changed
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | saving | success | error
  const [applyLangs, setApplyLangs] = useState(new Set()); // other language codes to also update

  useEffect(() => {
    setStatus("loading");
    fetch(`${API_URL}/languages/${langCode}/translations`)
      .then((response) => {
        if (!response.ok) throw new Error("load_failed");
        return response.json();
      })
      .then((data) => {
        const flat = flatten(data);
        setEntries(flat);
        setOriginalEntries(flat);
        setApplyLangs(new Set());
        setStatus("idle");
      })
      .catch((error) => {
        console.error("Error loading translations:", error);
        setStatus("error");
      });
  }, [langCode]);

  const handleChange = (path, value) => {
    setEntries((prev) => ({ ...prev, [path]: value }));
  };

  const toggleApplyLang = (lang) => {
    setApplyLangs((prev) => {
      const next = new Set(prev);
      if (next.has(lang)) {
        next.delete(lang);
      } else {
        next.add(lang);
      }
      return next;
    });
  };

  const changedPaths = useMemo(() => {
    if (!entries || !originalEntries) return [];
    return Object.keys(entries).filter(
      (path) => entries[path] !== originalEntries[path]
    );
  }, [entries, originalEntries]);

  const handleSave = async () => {
    setStatus("saving");
    try {
      const response = await fetch(
        `${API_URL}/languages/${langCode}/translations`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ translations: unflatten(entries) }),
        }
      );
      if (!response.ok) throw new Error("save_failed");

      if (changedPaths.length > 0 && applyLangs.size > 0) {
        const bulkResponse = await fetch(
          `${API_URL}/languages/translations/translations_update`,
          {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              changes: changedPaths.map((path) => ({
                path,
                value: entries[path],
              })),
              langs: Array.from(applyLangs),
            }),
          }
        );
        if (!bulkResponse.ok) throw new Error("bulk_save_failed");
      }

      setOriginalEntries(entries);
      setApplyLangs(new Set());
      setStatus("success");
    } catch (error) {
      console.error("Error saving translations:", error);
      setStatus("error");
    }
  };

  const changedPathSet = useMemo(() => new Set(changedPaths), [changedPaths]);

  // A path already changed stays visible even if the edit made it stop
  // matching the search text - otherwise the row you're editing vanishes
  // out from under you mid-keystroke.
  const filteredPaths = useMemo(() => {
    if (!entries) return [];
    const q = search.trim().toLowerCase();
    return Object.keys(entries)
      .filter(
        (path) =>
          changedPathSet.has(path) ||
          !q ||
          path.toLowerCase().includes(q) ||
          String(entries[path]).toLowerCase().includes(q)
      )
      .sort();
  }, [entries, search, changedPathSet]);

  if (status === "loading" || !entries) {
    return <p>Завантаження...</p>;
  }

  return (
    <div className="border rounded p-3 mt-2">
      {status === "success" && (
        <div className="alert alert-success py-1 small" role="alert">
          Збережено
        </div>
      )}
      {status === "error" && (
        <div className="alert alert-danger py-1 small" role="alert">
          Не вдалося зберегти
        </div>
      )}

      <div className="d-flex align-items-center gap-2 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Пошук за ключем або текстом..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-dark d-flex align-items-center gap-2 flex-shrink-0"
          onClick={handleSave}
          disabled={status === "saving"}
        >
          {status === "saving" && (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          Зберегти переклади
        </button>
      </div>

      {changedPaths.length > 0 && otherLanguages.length > 0 && (
        <div className="border rounded p-2 mb-2 bg-light">
          <div className="small text-muted mb-1">
            Змінено {changedPaths.length} ключ(ів). Застосувати ті самі значення
            і до інших мов:
          </div>
          {otherLanguages.map((lang) => (
            <div className="form-check form-check-inline" key={lang.code}>
              <input
                type="checkbox"
                className="form-check-input"
                id={`apply-lang-${lang.code}`}
                checked={applyLangs.has(lang.code)}
                onChange={() => toggleApplyLang(lang.code)}
              />
              <label
                className="form-check-label"
                htmlFor={`apply-lang-${lang.code}`}
              >
                {lang.code.toUpperCase()} — {lang.name}
              </label>
            </div>
          ))}
        </div>
      )}

      <div className="text-muted small mb-2">
        {filteredPaths.length} з {Object.keys(entries).length} рядків
      </div>

      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        {filteredPaths.map((path) => (
          <div
            className="row g-2 align-items-center mb-1 py-1"
            key={path}
            style={
              changedPathSet.has(path)
                ? { backgroundColor: "#fff3cd", borderRadius: 4 }
                : undefined
            }
          >
            <div className="col-4">
              <code className="small">{path}</code>
            </div>
            <div className="col-8">
              <input
                type="text"
                className="form-control form-control-sm"
                value={entries[path] ?? ""}
                onChange={(e) => handleChange(path, e.target.value)}
              />
            </div>
          </div>
        ))}
        {filteredPaths.length === 0 && (
          <p className="text-muted">Нічого не знайдено</p>
        )}
      </div>
    </div>
  );
};

export default TranslationsEditor;
