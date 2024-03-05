/* eslint-disable @next/next/no-img-element */
import React, { useState, FC } from "react";
import ImageUploading, { ImageListType, ImageType } from "react-images-uploading";
import Cropper, { Area } from "react-easy-crop";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { cropImage } from "./cropUtils";
import FileUploadIcon from '@mui/icons-material/FileUpload';

import styles from "./style.module.scss";

interface ImageUploadingButtonProps {
  value: ImageListType;
  onChange: (image: ImageListType) => void;
  [x: string]: any;
}

const ImageUploadingButton: FC<ImageUploadingButtonProps> = ({ value, onChange, ...props }) => {
  return (
    <ImageUploading value={value} onChange={onChange}>
      {({ onImageUpload, onImageUpdate }) => (
        <Button
          color="primary"
          onClick={value ? onImageUpload : () => onImageUpdate(0)}
          {...props}
        >
          <FileUploadIcon />
          画像を選択
        </Button>
      )}
    </ImageUploading>
  );
};

interface ImageCropperProps {
  open: boolean;
  image: string;
  onComplete: (image: Promise<string>) => void;
  containerStyle: React.CSSProperties;
  [x: string]: any;
}

const ImageCropper: FC<ImageCropperProps> = ({
  open,
  image,
  onComplete,
  containerStyle,
  ...props
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>画像をクロップ</DialogTitle>
      <DialogContent>
        <div style={containerStyle}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={596 / 777}
            onCropChange={setCrop}
            onCropComplete={(_, croppedAreaPixels) => {
              setCroppedAreaPixels(croppedAreaPixels);
            }}
            onZoomChange={setZoom}
            {...props}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() =>
            onComplete(cropImage(image, croppedAreaPixels ?? {}, console.log))
          }
        >
          決定
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface Props {
  setFaceImageBase64: (image: string) => void;
};

const App: FC<Props> = ({
  setFaceImageBase64,
}) => {
  const [image, setImage] = useState<ImageListType>([]);
  const [croppedImage, setCroppedImage] = useState<string>("/no-image.png");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className={styles["root"]}>
      <ImageCropper
        open={dialogOpen}
        image={image.length > 0 ? image[0].dataURL as string : ''}
        onComplete={(imagePromise) => {
          imagePromise.then((image) => {
            if (image === null || image === '') return;
            setCroppedImage(image); // base64で入ってる、ラッキー
            setFaceImageBase64(image);
            setDialogOpen(false);
          });
        }}
        containerStyle={{
          position: "relative",
          width: "100%",
          height: 300,
          background: "#333",
        }}
      />
      <img src={croppedImage} alt="Cropped image" className={styles["cropped-image"]} />
      <ImageUploadingButton
        value={image}
        onChange={(newImage) => {
          setDialogOpen(true);
          setImage(newImage);
        }}
      />
    </div>
  );
}

export default App;
