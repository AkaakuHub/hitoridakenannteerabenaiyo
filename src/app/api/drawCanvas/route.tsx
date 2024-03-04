/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import fs from 'fs'
import path from 'path'

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import { loadGoogleFont } from '@/lib/font';

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const department: string = requestBody.department;
    const name: string = requestBody.name;
    const affiliation: string = requestBody.affiliation;
    const faceImageBase64: string = requestBody.faceImageBase64;
    console.log(department, name, affiliation, faceImageBase64.length);

    // まずは、フォントをローカル優先で読み込む
    // memo: vercelだとfsで書き込めないからあらかじめ選択肢を用意する必要がある
    let fontArrayBuffer1: ArrayBuffer;
    let fontArrayBuffer2: ArrayBuffer;

    const fontArrayBuffer1Path = path.join(process.cwd(), "public/Zen Old Mincho900.dat");
    try {
      const result = fs.readFileSync(fontArrayBuffer1Path);
      fontArrayBuffer1 = result.buffer;
    } catch (error: any) {
      console.error('Error:', error);
      fontArrayBuffer1 = await loadGoogleFont({
        family: 'Zen Old Mincho',
        weight: 900,
      });
    }
    const fontArrayBuffer2Path = path.join(process.cwd(), "public/Zen Old Mincho500.dat");
    try {
      const result = fs.readFileSync(fontArrayBuffer2Path);
      fontArrayBuffer2 = result.buffer;
    } catch (error: any) {
      console.error('Error:', error);
      fontArrayBuffer2 = await loadGoogleFont({
        family: 'Zen Old Mincho',
        weight: 500,
      });
    }

    // ./card.pngをarrayBufferに変換して読み込む
    const cardImagePath = path.join(process.cwd(), "public/card.png");
    const cardImageArrayBuffer = fs.readFileSync(cardImagePath).buffer;

    // memo: 普通のJSXと違って、1つのdivに{}は1つだけ
    // satoriのドキュメントより、srcはarrayBufferを渡す。<-いや、base64でも出来る
    /**
     * z-indexはない
     */
    return new ImageResponse(
      (<>
        <img src={cardImageArrayBuffer} width={2000} height={1272}
        />
        <div
          style={{
            fontFamily: 'ZenOldMincho500',
            fontSize: '85px',
            position: 'absolute',
            color: '#000',
            top: '450px',
            left: '370px',
          }}
        >
          {department}
        </div>
        <div
          style={{
            fontFamily: 'ZenOldMincho900',
            fontSize: '115px',
            position: 'absolute',
            color: '#000',
            top: '590px',
            left: '370px',
            // letterSpacing: '10px',
          }}
        >
          {name}
        </div>
        <div
          style={{// affiliationだけはstyleもカスタム可能
            fontFamily: 'ZenOldMincho500',
            fontSize: '80px',
            position: 'absolute',
            color: '#000',
            top: '810px',
            left: '370px',
            letterSpacing: '-5px',
          }}
        >
          {affiliation}
        </div>
        <img src={faceImageBase64} width={596} height={777}
          style={{
            position: 'absolute',
            top: '414px',
            left: '1312px',
          }}
        />
      </>
      ),
      {
        width: 2000,
        height: 1272,
        fonts: [
          {
            name: 'ZenOldMincho900',// 名前
            data: fontArrayBuffer1,
            style: 'normal',
            weight: 900,
          },
          {
            name: 'ZenOldMincho500',// 学科
            data: fontArrayBuffer2,
            style: 'normal',
            weight: 500,
          },
        ]
      }
    );
  }
  catch (error: any) {
    console.error('Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
