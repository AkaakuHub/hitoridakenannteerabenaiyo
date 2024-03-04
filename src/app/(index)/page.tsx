/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from 'react';
import { Input, Button } from '@mui/material';
import { TextField, MenuItem } from "@mui/material";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import DownloadIcon from '@mui/icons-material/Download';

import Header from '@/components/header/header';
import Footer from "@/components/footer/footer";

import 'react-image-crop/dist/ReactCrop.css'

import { queryType } from '@/types';

import styles from './style.module.scss';

// import { SelectPicture } from '@/components/SelectPicture';
import CropPage from '@/components/crop/CropPage';

export default function Page() {
  const [queryData, setQueryData] = useState<queryType>({
    "department": "普通科",
    "name": "",
    "affiliation": "スクールアイドル同好会"
  });
  const [faceImageBase64, setFaceImageBase64] = useState<string>("");

  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchData = async (input: queryType) => {
    setIsFetching(true);
    const response = await fetch('/api/drawCanvas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        department: input.department,
        name: input.name,
        affiliation: input.affiliation,
        faceImageBase64: faceImageBase64
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch image data');
      setIsFetching(false);
      return;
    }

    if (resultImageUrl) {
      URL.revokeObjectURL(resultImageUrl);
    }
    // return new ImageResponseでかえってくるからblobで受け取る
    // createObjectURLはdocumentないで生成されるから寿命の問題はない
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setResultImageUrl(url);
    setIsFetching(false);
  }

  // const selectBox = [
  //   { label: "label1", value: "value1" },
  //   { label: "label2", value: "value2" },
  //   { label: "label3", value: "value3" }
  // ];

  const [themeColors, setThemeColors] = useState<string[]>(["", ""]);
  const [themeName, setThemeName] = useState<string>("");

  const changeThemeColor = () => {
    const nijigasakiColors1: string[] = ["#ED7D95", "#E7D600", "#01B7ED", "#91A0F5", "#eB8654", "#A664A0", "#F36C71", "#84C36E", "#9CA5B9", "#37B484", "#A99E98", "#F8C8C4"];
    const nijigasakiColors2: string[] = ["#FEBACB", "#F5FCA4", "#B2DFEE", "#B0CCFB", "#FFD597", "#E1D1F6", "#FFAFAF", "#D3FAD3", "#D6E1E3", "#C0EDDE", "#DAD9D2", "#FCDEDC"];
    const nijigasakiNames: string[] = ["歩夢", "かすみ", "しずく", "果林", "愛", "彼方", "せつ菜", "エマ", "璃奈", "栞子", "ミア", "嵐珠"];

    const randomIndex = Math.floor(Math.random() * nijigasakiColors1.length);
    const randomColor1: string = nijigasakiColors1[randomIndex];
    const randomColor2: string = nijigasakiColors2[randomIndex];
    setThemeColors([randomColor1, randomColor2]);
    setThemeName(nijigasakiNames[randomIndex]);
  }

  useEffect(() => {
    changeThemeColor();
  }, []);

  return (
    <>
      <Header
        themeColor={themeColors[1]}
        changeThemeColor={changeThemeColor}
      />
      <div
        className={styles["root"]}
        style={{
          background: `linear-gradient(135deg, ${themeColors[0]}, ${themeColors[1]})`
        }}
      >
        <Card sx={{
          minWidth: 275,
          maxWidth: 600,
          maxHeight: "4em",
          borderRadius: 5,
        }}>
          <div
            className={styles["description"]}
          >
            虹ヶ咲学園の学生証&quot;風&quot;の画像を生成します。
          </div>
        </Card>
        <Card sx={{
          minWidth: 300,
          maxWidth: 1000,
          borderRadius: 5,
        }}>
          <div
            className={styles["input-container"]}
          >
            <CardContent>
              <div className={styles["select-container"]}
              >
                <span>学科:</span>
                <Input
                  type="text"
                  placeholder="所属を入力"
                  value={queryData.department}
                  onChange={(e) => {
                    const newQueryData = { ...queryData, "department": e.target.value };
                    setQueryData(newQueryData);
                  }}
                />
              </div>
              <br />
              <div className={styles["select-container"]}
              >
                <span>名前:</span>
                <Input
                  type="text"
                  placeholder="名前を入力"
                  value={queryData.name}
                  onChange={(e) => {
                    const newQueryData = { ...queryData, "name": e.target.value };
                    setQueryData(newQueryData);
                  }}
                />
              </div>
              <br />
              <div className={styles["select-container"]}
              >
                <span>所属:</span>
                <Input
                  type="text"
                  placeholder="所属を入力"
                  value={queryData.affiliation}
                  onChange={(e) => {
                    const newQueryData = { ...queryData, "affiliation": e.target.value };
                    setQueryData(newQueryData);
                  }}
                />
              </div>
              <br />

              {
                faceImageBase64 === "" && (
                  <div>アイコン画像を選択してください。</div>
                )
              }
            </CardContent>
            <CardActions>
              <div
                className={styles["button-container"]}
              >
                <Button onClick={() => fetchData(queryData)}
                  disabled={faceImageBase64 === "" || isFetching}
                  variant='contained'
                  size='large'
                >画像を作成</Button>
                {isFetching ?
                  <Box sx={{ display: 'flex' }} className={styles["loading-icon-container"]}
                  >
                    <CircularProgress />
                  </Box> : null}
              </div>
            </CardActions>
          </div>
        </Card>
        <Card sx={{
          minWidth: 275,
          maxWidth: 600,
          borderRadius: 5,
        }}>
          <CropPage
            setFaceImageBase64={setFaceImageBase64}
          />
        </Card>
        {resultImageUrl && (
          <Card sx={{
            minWidth: 275,
            maxWidth: 600,
            borderRadius: 5,
          }}>
            <div className={styles["result-container"]}
            >
              <img src={resultImageUrl} alt="Generated Image"
                className={styles["generated-image"]}
              />
              <a href={resultImageUrl} download="nijigasaki_card.png">
                <Button variant="contained" color='success'
                >
                  <DownloadIcon />
                  画像をダウンロード</Button>
              </a>
            </div>
          </Card>
        )}
      </div >
      <div className={styles["footer-container"]}
      >
        <Footer
          themeName={themeName}
        />
      </div>
    </>
  );
}