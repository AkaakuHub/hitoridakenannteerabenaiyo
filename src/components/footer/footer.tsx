import React from "react";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type Props = {
  themeName: string;
};

const Footer: React.FC<Props> = ({
  themeName
}) => {
  return (
    <>
      <AppBar component="footer" position="static" sx={{ backgroundColor: '#000000' }}
        style={{
          height: 'auto',
          textAlign: 'center',
          alignItems: 'center',
          padding: '0.5em',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption">
              ※本サイトはファンメイドであり、公式とは一切関係ありません。
              <br />
              現在{themeName}のテーマで表示しています。
              <br />
              ヘッダーをクリックしてみてね！
            </Typography>
          </Box>
        </Container>
      </AppBar>
    </>
  );
};

export default Footer;