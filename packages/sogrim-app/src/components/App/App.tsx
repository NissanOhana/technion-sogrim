import { ThemeProvider } from "@mui/material";
import jwtDecode from "jwt-decode";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useStore } from "../../hooks/useStore";
import { DARK_MODE_THEME, LIGHT_MODE_THEME } from "../../themes/constants";
import { getAppTheme } from "../../themes/theme";
import { GoogleClinetSession as GoogleClientSession } from "../../types/auth-types";
import { Footer } from "../Footer/Footer";
import GoogleAuth from "../GoogleAuth/GoogleAuth";
import { AnonymousApp } from "./AnonymousApp";
import { UserApp } from "./UserApp";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const AppComp: React.FC = () => {
  const [mode] = useState<typeof LIGHT_MODE_THEME | typeof DARK_MODE_THEME>(
    LIGHT_MODE_THEME
  );

  const {
    uiStore: { setUserDisplay, goToMainPage },
  } = useStore();
  const { isAuthenticated, googleSession, userAuthToken } = useAuth();

  useEffect(() => {
    if (googleSession === GoogleClientSession.DONE) {
      goToMainPage();
      if (userAuthToken) {
        setUserDisplay(jwtDecode(userAuthToken));
      }
    }
  }, [isAuthenticated, googleSession, userAuthToken, setUserDisplay]);

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  // Create rtl cache
  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [rtlPlugin],
  });

  return (
    <ThemeProvider theme={theme}>
      <CacheProvider value={cacheRtl}>
        <GoogleAuth />
        {isAuthenticated ? <UserApp /> : <AnonymousApp />}
        <Footer />
      </CacheProvider>
    </ThemeProvider>
  );
};

export const App = observer(AppComp);
