import { Box, ButtonBase, Chip, Stack } from "@mui/material";
import React, { useMemo } from "react";
import { actions, categories } from "./constants";

export const ShowCategories = ({ selectedCategory, setSelectedAction }) => {
  const actionsToShow = useMemo(() => {
    if (selectedCategory === 0) {
      return categories?.map((category) => {
        return {
          category,
          actions: Object.keys(actions)
            .filter((action) => {
              const actionCategory = actions[action].category;
              if (actionCategory === category) return true;
              return false;
            })
            .map((key) => {
              return {
                ...actions[key],
                action: key,
              };
            }),
        };
      });
    }
    return [
      {
        category: selectedCategory,
        actions: Object.keys(actions)
          .filter((action) => {
            const actionCategory = actions[action].category;
            if (actionCategory === selectedCategory) return true;
            return false;
          })
          .map((key) => {
            return {
              ...actions[key],
              action: key,
            };
          }),
      },
    ];


  }, [selectedCategory, actions, categories]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {actionsToShow?.map((category) => {
        return (
          <>
            <div className="row">{category?.category}</div>
            <Stack
              direction="row"
              sx={{
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              {category?.actions?.map((action) => {
                return (
                  <ButtonBase key={action.action} onClick={()=> {
                    setSelectedAction(action)
                  }}>
                    <Chip label={action.action} variant="outlined" />
                  </ButtonBase>
                );
              })}
            </Stack>
          </>
        );
      })}
    </Box>
  );
};
