import React, { useState, useEffect, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import fileStore from "../../store/cropImgStore";
import { useTranslation } from "react-i18next";

const CropImg = ({ fileDataUrl, handleFileChange }) => {
  const { t } = useTranslation();

  const image = fileDataUrl;

  const [cropData, setCropData] = useState("#");
  const cropperRef = useRef(null);

  // Cropper.js measures its container's size once, when it initializes —
  // if that happens while the Bootstrap modal is still mid fade-in
  // transition, it locks in whatever tiny/wrong size the container had at
  // that instant (this is what made the cropper render at ~200x100px
  // instead of filling the panel). Resizing once the modal's own
  // shown.bs.modal event fires (transition fully done) fixes it.
  useEffect(() => {
    const modalEl = document.getElementById("exampleModal");
    const handleShown = () => {
      cropperRef.current?.cropper?.resize?.();
    };
    modalEl?.addEventListener("shown.bs.modal", handleShown);
    // Cropper may already exist and the modal may already be shown by the
    // time this effect runs (e.g. cropping a second photo without closing
    // the modal) — resize immediately too, not just on the next transition.
    const resizeTimer = setTimeout(handleShown, 50);
    return () => {
      modalEl?.removeEventListener("shown.bs.modal", handleShown);
      clearTimeout(resizeTimer);
    };
  }, [image]);

  const getCropData = () => {
    if (cropperRef.current?.cropper) {
      const croppedImg = cropperRef.current.cropper
        .getCroppedCanvas()
        .toDataURL();
      setCropData(croppedImg);
      fileStore.setCroppedImg(croppedImg);

      handleFileChange(fileStore.croppedImg, fileStore.fileName);
    }
  };

  return (
    <div>
      <div className="container-fluid d-flex flex-wrap justify-content-between gap-4">
        <div className="flex-grow-1" style={{ minWidth: 320 }}>
          <h5>{t("editPage.cropImages.preview")}</h5>
          <Cropper
            ref={cropperRef}
            style={{ width: "100%", height: "min(500px, 55vh)" }}
            zoomTo={0.5}
            initialAspectRatio={4 / 3}
            src={image}
            viewMode={1}
            minCropBoxHeight={100}
            minCropBoxWidth={75}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            guides={true}
          />
        </div>

        <div
          className="d-flex flex-column align-items-center"
          style={{ minWidth: 320, flex: "0 0 320px" }}
        >
          <h5>{t("editPage.cropImages.croppedImage")}</h5>
          <div>
            {cropData === "#" ? (
              <div>{t("editPage.cropImages.noCroppedImage")}</div>
            ) : (
              <img style={{ maxWidth: "100%" }} src={cropData} alt="cropped" />
            )}
          </div>
        </div>
      </div>

      <div className="container d-flex justify-content-center mt-4 mb-2">
        <button onClick={getCropData} className="col-5 btn btn-dark p-1">
          <h3>{t("editPage.cropImages.cropImage")}</h3>
        </button>
      </div>
    </div>
  );
};

export default CropImg;
