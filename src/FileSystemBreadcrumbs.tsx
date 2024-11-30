import React from "react";
import { Typography, Breadcrumbs, Link } from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export const FileSystemBreadcrumbs = ({ currentPath, setCurrentPath }) => {
  const handleClick = (index) => {
    // Update the path to the selected directory
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  return (
    <Breadcrumbs         separator={<NavigateNextIcon fontSize="small" />}
    aria-label="breadcrumb">
      {currentPath.map((dir, index) => {
        const isLast = index === currentPath.length - 1;
        return isLast ? (
          <Typography sx={{
            fontSize: '16px'
          }} key={index} fontWeight="bold">
            {dir}
          </Typography>
        ) : (
          <Link
            key={index}
            component="button"
            variant="body1"
            underline="hover"
            color="inherit"
            onClick={() => handleClick(index)}
          >
            {dir}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};