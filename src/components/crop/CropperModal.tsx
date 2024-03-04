import { Button, Modal, Slider } from "@mui/material";
import React from "react";
import Cropper, { Area, MediaSize } from "react-easy-crop";

import { ASPECT_RATIO, CROP_WIDTH } from "./CropPage";

import styles from "./cropmodal.module.scss";

type Props = {
  crop: {
    x: number;
    y: number;
  };
  setCrop: (crop: { x: number; y: number }) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  open: boolean;
  onClose: () => void;
  imgSrc: string;
  showCroppedImage: () => void;
  onMediaLoaded: (mediaSize: MediaSize) => void;
  minZoom: number;
};
const CropperModal: React.FC<Props> = ({
  crop,
  setCrop,
  onCropComplete,
  setZoom,
  zoom,
  open,
  onClose,
  imgSrc,
  showCroppedImage,
  onMediaLoaded,
  minZoom
}) => {
  return (
    <Modal open={open} onClose={onClose} className={styles.root}>
      <div className={styles["modal"]}>
        <div className={styles["crop-container"]}>
          <div className={styles["crop-space"]}>
            <Cropper
              image={imgSrc}
              crop={crop}
              zoom={zoom}
              minZoom={minZoom}
              maxZoom={minZoom + 3}
              aspect={ASPECT_RATIO}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              cropSize={{
                width: CROP_WIDTH,
                height: CROP_WIDTH / ASPECT_RATIO
              }}
              classes={{
                containerClassName: `${styles["container"]}`,
                cropAreaClassName: `${styles["crop-area"]}`,
                mediaClassName: `${styles["media"]}`
              }}
              onMediaLoaded={onMediaLoaded}
              showGrid={false}
            />
          </div>
        </div>
        <div className={styles["controls"]}>
          <Slider
            min={minZoom}
            value={zoom}
            max={minZoom + 4}
            step={0.05}
            onChange={(e, value) => {
              if (typeof value === "number") {
                setZoom(value);
              }
            }}
            className={styles["zoom-range"]}
          />
        </div>
        <div className={styles["buttons"]}>
          <Button className={styles["close"]} onClick={onClose}>
            戻る
          </Button>
          <Button
            className={styles["ok"]}
            onClick={() => {
              onClose();
              showCroppedImage();
            }}
          >
            決定
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default CropperModal;
