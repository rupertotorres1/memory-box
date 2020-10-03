import React, { ElementType } from "react";
import { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { Provider as AuthProvider } from "next-auth/client";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../components/theme";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function App({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <AuthProvider session={pageProps.session}>
      <SWRConfig value={{ fetcher }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </SWRConfig>
    </AuthProvider>
  );
}
