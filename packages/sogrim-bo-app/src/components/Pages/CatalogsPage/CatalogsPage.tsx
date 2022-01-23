import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import React from "react";
import { SingleCatalogSearch } from "./SingleCatalogSearch";

interface CatalogPageProps {}

const CatalogPageComp: React.FC<CatalogPageProps> = () => {
  return (
    <div style={{ width: "80%", display: "flex" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 1,
          gap: 3,
          justifyContent: "center",
          textAlign: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <SingleCatalogSearch />
      </Box>
    </div>
  );
};

export const CatalogsPage = observer(CatalogPageComp);
