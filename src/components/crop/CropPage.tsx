// ありがとう https://zenn.dev/kyosuke_14/articles/e892bffc0357da

/* eslint-disable @next/next/no-img-element */
import React, { useState, useCallback } from "react";
import { Area, MediaSize } from "react-easy-crop";

import CropperModal from "./CropperModal";
import { Button } from "@mui/material";

import styles from "./croppage.module.scss";

import getCroppedImg from "./getCroppedImg";
export const ASPECT_RATIO = 596 / 777;
export const CROP_WIDTH = 596;

type Props = {
  setFaceImageBase64: (faceImageBase64: string) => void;
};

const CropPage: React.FC<Props> = ({
  setFaceImageBase64
}) => {
  /** Cropモーダルの開閉 */
  const [isOpen, setIsOpen] = useState(false);

  /** アップロードした画像URL */
  const [imgSrc, setImgSrc] = useState("");

  /** 画像の拡大縮小倍率 */
  const [zoom, setZoom] = useState(1);
  /** 画像拡大縮小の最小値 */
  const [minZoom, setMinZoom] = useState(1);

  /** 切り取る領域の情報 */
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  /** 切り取る領域の情報 */
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  /** 切り取ったあとの画像URL */
  const [croppedImgSrc, setCroppedImgSrc] = useState("");

  /**
   * ファイルアップロード後
   * 画像ファイルのURLをセットしモーダルを表示する
   */
  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          if (reader.result) {
            setImgSrc(reader.result.toString() || "");
            setIsOpen(true);
          }
        });
        reader.readAsDataURL(e.target.files[0]);
      }
    },
    []
  );
  /**
   * Cropper側で画像データ読み込み完了
   * Zoomの最小値をセットしZoomの値も更新
   */
  const onMediaLoaded = useCallback((mediaSize: MediaSize) => {
    const { width, height } = mediaSize;
    const mediaAspectRadio = width / height;
    if (mediaAspectRadio > ASPECT_RATIO) {
      // 縦幅に合わせてZoomを指定
      const result = CROP_WIDTH / ASPECT_RATIO / height;
      setZoom(result);
      setMinZoom(result);
      return;
    }
    // 横幅に合わせてZoomを指定
    const result = CROP_WIDTH / width;
    setZoom(result);
    setMinZoom(result);
  }, []);

  /**
   * 切り取り完了後、切り取り領域の情報をセット
   */
  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  async function blobUrlToBase64(blobUrl: string): Promise<string | ArrayBuffer | null> {
    // Blob URLからレスポンスを取得
    const response = await fetch(blobUrl);

    // レスポンスからBlobデータを取得
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * 切り取り後の画像を生成し画面に表示
   */
  const showCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedImage = await getCroppedImg(imgSrc, croppedAreaPixels);
      setCroppedImgSrc(croppedImage);
      // このblobのURLをbase64に変換して、setFaceImageBase64で親コンポーネントに渡す
      blobUrlToBase64(croppedImage).then(base64 => {
        setFaceImageBase64(base64 as string);
      });
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, imgSrc, setFaceImageBase64]);

  return (
    <div className={styles["root"]}>
      <div className={styles["img-container"]}
        style={{
          width: `${CROP_WIDTH}px`,
          height: `${CROP_WIDTH / ASPECT_RATIO}px`
        }}
      >
        {croppedImgSrc ? (
          <img src={croppedImgSrc} alt="Cropped" className={styles["img"]} />
        ) : (
          <img src="/no-image.png" alt="Original" className={styles["img"]} />
        )}
      </div>
      <CropperModal
        crop={crop}
        setCrop={setCrop}
        zoom={zoom}
        setZoom={setZoom}
        onCropComplete={onCropComplete}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        imgSrc={imgSrc}
        showCroppedImage={showCroppedImage}
        onMediaLoaded={onMediaLoaded}
        minZoom={minZoom}
      />
      <div className={styles["file-upload-container"]}>
        <Button variant="contained" component="label" className={styles["button"]}>
          アイコン画像を選択
          <input type="file" hidden onChange={onFileChange} />
        </Button>
      </div>
    </div>
  );
};
export default CropPage;