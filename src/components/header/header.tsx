"use client";

import react from 'react';
import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import styles from "./style.module.scss";

type Props = {
  themeColor: string;
  changeThemeColor: () => void;
}

const Header: React.FC<Props> = ({
  themeColor,
  changeThemeColor
}) => {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static"
        sx={{
          bgcolor: themeColor
        }}
        onClick={() => {
          changeThemeColor();
        }}
        style={{
          color: "black",
          userSelect: "none",
          cursor: "pointer"
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}
          >
            虹ヶ咲学園 学生証ジェネレーター
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;