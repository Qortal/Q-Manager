import React, { useState, useRef } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Modal, Typography, styled } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
const CustomStyledMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        padding: theme.spacing(1),
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
    },
    '& .MuiMenuItem-root': {
        fontSize: '14px',
        color: '#444',
        transition: '0.3s background-color',
        '&:hover': {
            backgroundColor: '#f0f0f0',
        },
    },
}));

export const ContextMenuPinnedFiles = ({ children, removeFile, removeDirectory, type, rename, fileSystem, 
moveNode, currentPath, item }) => {
    const [menuPosition, setMenuPosition] = useState(null);
    const longPressTimeout = useRef(null);
    const maxHoldTimeout = useRef(null);
    const preventClick = useRef(false);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [targetPath, setTargetPath] = useState([]);
    const startTouchPosition = useRef({ x: 0, y: 0 }); // Track initial touch position
    const handleContextMenu = (event) => {
        event.preventDefault();
        event.stopPropagation();
        preventClick.current = true;
        setMenuPosition({
            mouseX: event.clientX,
            mouseY: event.clientY,
        });
    };

    const handleTouchStart = (event) => {

        const { clientX, clientY } = event.touches[0];
        startTouchPosition.current = { x: clientX, y: clientY };

        longPressTimeout.current = setTimeout(() => {
            preventClick.current = true;
          
            event.stopPropagation();
            setMenuPosition({
                mouseX: clientX,
                mouseY: clientY,
            });
        }, 500);

        // Set a maximum hold duration (e.g., 1.5 seconds)
        maxHoldTimeout.current = setTimeout(() => {
            clearTimeout(longPressTimeout.current);
        }, 1500);
    };

    const handleTouchMove = (event) => {

        const { clientX, clientY } = event.touches[0];
        const { x, y } = startTouchPosition.current;

        // Determine if the touch has moved beyond a small threshold (e.g., 10px)
        const movedEnough = Math.abs(clientX - x) > 10 || Math.abs(clientY - y) > 10;

        if (movedEnough) {
            clearTimeout(longPressTimeout.current);
            clearTimeout(maxHoldTimeout.current);
        }
    };

    const handleTouchEnd = (event) => {

        clearTimeout(longPressTimeout.current);
        clearTimeout(maxHoldTimeout.current);
        if (preventClick.current) {
            event.preventDefault();
            event.stopPropagation();
            preventClick.current = false;
        }
    };

    const handleClose = (e) => {

        e.preventDefault();
        e.stopPropagation();
        setMenuPosition(null);
    };

    const renderDirectoryTree = (directories, currentPathParam = []) => {
        return directories.filter((fd)=> fd?.type === 'folder').map((dir) => {
          // Construct the fullPath by including the current directory or file name
          const fullPath = [...currentPathParam, dir.name];
          const currentFullPath = [...currentPathParam, item.name];

          // Determine if the current item is the selected one
          const isSelected = fullPath.join("/") === targetPath.join("/");
          const isCurrentDir = fullPath.join("/") === currentPath.join("/");
          const isHoveredDir = fullPath.join("/") === currentFullPath.join("/");
        //   const isItSelf = dir?.type === 'folder' && dir.name ===
          if(dir.type !== "folder" ) return null
      
          return (
            <Box key={fullPath.join("/")} sx={{ mb: 1 }}>
              {/* Render the current directory or file */}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    if(isCurrentDir || isHoveredDir) return
                    setTargetPath(fullPath)
                  }}
                  sx={{
                    backgroundColor: (isCurrentDir || isHoveredDir) ? 'inherit' : isSelected ? "#1976d2" : "inherit",
                    color: (isCurrentDir || isHoveredDir) ? 'inherit' : isSelected ? "#ffffff" : "inherit",
                    "&:hover": {
                      backgroundColor: (isCurrentDir || isHoveredDir) ? 'inherit' :  "#1976d2",
                      color: (isCurrentDir || isHoveredDir) ? 'inherit' : "#ffffff" 
                    },
                    cursor: (isCurrentDir || isHoveredDir) ? 'default' : 'pointer'
                  }}
                >
                    {dir.type === "folder" && (
                        <>
                         <ListItemIcon>
                    
                           <FolderIcon sx={{ color: isSelected ? "#ffffff" : "inherit" }} />
                   
                       </ListItemIcon>
                       <ListItemText
                         primary={dir.name}
                         primaryTypographyProps={{
                           fontWeight: isSelected ? "bold" : "normal",
                         }}
                       />
                       </>
                    )}
                 
                </ListItemButton>
              </ListItem>
              {/* Recursively render children if it's a folder */}
              {dir.type === "folder" && dir.children && dir.children.length > 0 && (
                <Box sx={{ pl: 4 }}>
                  {renderDirectoryTree(dir.children, fullPath)}
                </Box>
              )}
            </Box>
          );
        });
      };
      
      
      
      
      
      
      
      
      
      
      

      const openMoveModal = () => {
        setShowMoveModal(true);
        setMenuPosition(null); // Close the context menu
      };
    
      const closeMoveModal = () => {
        setShowMoveModal(false);
      };

      const handleMove = () => {
        if (targetPath.length > 0) {
          moveNode("name", "type", ["current", "path"], targetPath); // Replace with your logic
          closeMoveModal();
        }
      };

    return (
        <div
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'none' }}
        >
            {children}
            <CustomStyledMenu
                disableAutoFocusItem
                open={!!menuPosition}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    menuPosition
                        ? { top: menuPosition.mouseY, left: menuPosition.mouseX }
                        : undefined
                }
                onClick={(e) => {
                    e.stopPropagation();
                }}
            > 
            {type === 'file' && (
                <MenuItem onClick={(e) => {
                    handleClose(e);
                    removeFile()
                }}>
                    <ListItemIcon sx={{ minWidth: '32px' }}>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" sx={{ fontSize: '14px' }}>
                        remove file
                    </Typography>
                </MenuItem>
            )}
            {type === 'folder' && (
                <MenuItem onClick={(e) => {
                    handleClose(e);
                    removeDirectory()
                }}>
                    <ListItemIcon sx={{ minWidth: '32px' }}>
                        <PushPinIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" sx={{ fontSize: '14px' }}>
                        remove directory
                    </Typography>
                </MenuItem>
                
            )}
                 <MenuItem onClick={(e) => {
                    handleClose(e);
                    rename()
                }}>
                    <ListItemIcon sx={{ minWidth: '32px' }}>
                        <DriveFileRenameOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" sx={{ fontSize: '14px' }}>
                    rename
                    </Typography>
                </MenuItem>
                <MenuItem
           onClick={() =>
            openMoveModal()
          }
        >
          <ListItemIcon sx={{ minWidth: "32px" }}>
            <DriveFileMoveIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" sx={{ fontSize: "14px" }}>
            Move
          </Typography>
        </MenuItem>
            </CustomStyledMenu>

            <Modal open={showMoveModal} onClose={closeMoveModal}>
        <Box
          sx={{
            width: 400,
            maxWidth: '95%',
            margin: "auto",
            marginTop: "10%",
            backgroundColor: "#27282c",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            overflow: 'auto',
            maxHeight: '80vh'
          }}
        >
          <Typography variant="h6" component="h2">
            Select Target Folder
          </Typography>
          {renderDirectoryTree(fileSystem)}
          <Box mt={2} sx={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}>
            <button onClick={()=> {


              if(!targetPath || targetPath?.length === 0) return
                moveNode(
                    item.name,
                   item.type,
                  currentPath,
                    targetPath // Pass the selected targetPath
                  )
            }}>Move Here</button>
            <button onClick={closeMoveModal}>Cancel</button>
          </Box>
        </Box>
      </Modal>
        </div>
    );
};
