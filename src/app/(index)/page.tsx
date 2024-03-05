/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import GlobalStyle from "@/lib/GlobalStyle";

import { useEffect, useState } from 'react';
import { Input, Button } from '@mui/material';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import DownloadIcon from '@mui/icons-material/Download';

import Header from '@/components/header/header';
import Footer from "@/components/footer/footer";

import 'react-image-crop/dist/ReactCrop.css'

import { queryType, offsetType } from '@/types';

import styles from './style.module.scss';
import clsx from 'clsx';

// import { SelectPicture } from '@/components/SelectPicture';
import CropApp from '@/components/crop/App';

const fontList: string[] = [
  "azuki",
  "Zen Old Mincho500",
  "Zen Old Mincho900",
  "Zen Kurenaido400",
  "Zen Kaku Gothic New400",
  "f_feltpen04",
  "sayonara",
  "Cherry Bomb One400",
  "Slackside One400",// 以下英語
  "Walter Turncoat400",
  "Pinyon Script400",
  "Pacifico400",
];

export default function Page() {
  const [queryData, setQueryData] = useState<queryType>({
    "department": "普通科",
    "name": "",
    "affiliation": "スクールアイドル同好会",
    "faceImageBase64": "",
    "fontName": "",
  });

  const [offsetData, setOffsetData] = useState<offsetType>({
    "x": 0,
    "y": 0,
    "spacing": 0,
    "size": 0,
  })

  const [faceImageBase64, setFaceImageBase64] = useState<string>("");

  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

  const [fontName, setFontName] = useState<string>(fontList[0]);

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchData = async () => {
    setIsFetching(true);
    const response = await fetch('/api/drawCanvas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queryData: queryData,
        faceImageBase64: faceImageBase64,
        fontName: fontName,
        offsetData: offsetData,
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
      <GlobalStyle />
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
          maxHeight: "6em",
          borderRadius: 5,
        }}>
          <div
            className={styles["description"]}
          >
            虹ヶ咲学園の学生証&quot;風&quot;の画像を生成します。
          </div>
        </Card>
        <Card sx={{
          minWidth: 275,
          maxWidth: 600,
          borderRadius: 5,
        }}>
          <div
            className={styles["card-title"]}
          >
            1.アイコンを選択
          </div>
          <CropApp
            setFaceImageBase64={setFaceImageBase64}
          />
        </Card>
        <Card sx={{
          minWidth: 300,
          maxWidth: 1000,
          borderRadius: 5,
        }}>
          <div
            className={styles["card-title"]}
          >
            2.情報を入力
          </div>
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

              {/** offsetを設定 */}
              <div className={styles["select-container"]}
              >
                <span>サイズ:</span>
                <Input
                  type="number"
                  placeholder="サイズを入力"
                  value={offsetData.size}
                  onChange={(e) => {
                    const newOffsetData = { ...offsetData, "size": Number(e.target.value) };
                    setOffsetData(newOffsetData);
                  }}
                />
              </div>
              <br />
              <div className={styles["select-container"]}
              >
                <span>横位置:</span>
                <Input
                  type="number"
                  placeholder="横位置を入力"
                  value={offsetData.x}
                  onChange={(e) => {
                    const newOffsetData = { ...offsetData, "x": Number(e.target.value) };
                    setOffsetData(newOffsetData);
                  }}
                />
              </div>
              <br />
              <div className={styles["select-container"]}
              >
                <span>縦位置:</span>
                <Input
                  type="number"
                  placeholder="縦位置を入力"
                  value={offsetData.y}
                  onChange={(e) => {
                    const newOffsetData = { ...offsetData, "y": Number(e.target.value) };
                    setOffsetData(newOffsetData);
                  }}
                />
              </div>
              <br />
              <div className={styles["select-container"]}
              >
                <span>文字間隔:</span>
                <Input
                  type="number"
                  placeholder="文字間隔を入力"
                  value={offsetData.spacing}
                  onChange={(e) => {
                    const newOffsetData = { ...offsetData, "spacing": Number(e.target.value) };
                    setOffsetData(newOffsetData);
                  }}
                />
              </div>
              <br />

              所属のフォントを選択:
              <Select
                value={fontName}
                onChange={(e) => setFontName(e.target.value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {fontList.map((font, index) => (
                  <MenuItem key={index} value={font}>
                    <img src={`/font-preview/${font}.png`} alt={font} width="200" height="50"
                      className={styles["font-preview"]}
                    />
                  </MenuItem>
                ))}
              </Select>
            </CardContent>
            <CardActions>
              <div
                className={styles["button-container"]}
              >
                <Button onClick={() => fetchData()}
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
          <div className={styles["result-container"]}
          >
            {resultImageUrl ? (
              <>
                <img src={resultImageUrl} alt="Generated Image"
                  className={clsx(styles["generated-image"], isFetching && styles["image-dark"])}
                />
                <a href={resultImageUrl} download="nijigasaki_card.png">
                  <Button variant="contained" color='success'
                  >
                    <DownloadIcon />
                    画像をダウンロード</Button>
                </a>
              </>
            ) : (
              <div
                className={styles["dummy-result-image"]}
              >
              </div>
            )
            }
          </div>
        </Card>
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
