import React, { useState, useMemo, useEffect } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import {
  Button,
  ButtonBase,
  Avatar,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  AppBar,
  IconButton,
  Toolbar,
  Stack,
  Tabs,
  Tab,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { useDropzone } from "react-dropzone";
import { Label, PUBLISH_QDN_RESOURCE } from "./actions/PUBLISH_QDN_RESOURCE";
import { ShowAction, Transition } from "./ShowAction";
import { ContextMenuPinnedFiles } from "./ContextMenuPinnedFiles";
import { useModal } from "./useModal";
import {
  getFileSystemQManagerFromDB,
  saveFileSystemQManagerToDB,
} from "./storage";
import { SelectedFile } from "./File";
import { FileSystemBreadcrumbs } from "./FileSystemBreadcrumbs";
import { Spacer } from "./components/Spacer";
import FolderIcon from "@mui/icons-material/Folder";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  base64ToUint8Array,
  handleImportClick,
  objectToBase64,
  uint8ArrayToObject,
} from "./utils";
const initialFileSystem = [
  {
    type: "folder",
    name: "Root",
    children: [],
  },
];



const SortableItem = ({
  item,
  onClick,
  removeFile,
  removeDirectory,
  rename,
  fileSystem,
  moveNode,
  currentPath,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.name + item.type,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "10px",
    marginBottom: "5px",
    borderRadius: "4px",
    cursor: "grab",
  };

  return (
    <ContextMenuPinnedFiles
      rename={rename}
      type={item?.type}
      removeFile={removeFile}
      removeDirectory={removeDirectory}
      fileSystem={fileSystem}
      currentPath={currentPath}
      moveNode={moveNode}
      item={item}
    >
      <ButtonBase
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        sx={{
          ...style,
        }}
        onClick={() => onClick()}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "10px",
            width: "100px",
          }}
        >
          <Avatar
            sx={{
              height: "40px",
              width: "40px",
              alignSelf: "center",
              backgroundColor: "#1E1E20",
            }}
          >
            {item.type === "folder" ? (
              <FolderIcon sx={{ color: "white" }} />
            ) : (
              <AttachFileIcon sx={{ color: "white" }} />
            )}
          </Avatar>
          <Typography
            sx={{
              wordBreak: "break-word",
              textWrap: "wrap",
              fontSize: "16px",
            }}
          >
            {item.name}
          </Typography>
        </Box>
      </ButtonBase>
    </ContextMenuPinnedFiles>
  );
};

export const Manager = ({ myAddress, groups }) => {
  const [fileSystemPublic, setFileSystemPublic] = useState(null);
  const [fileSystemPrivate, setFileSystemPrivate] = useState(null);
  const [fileSystemGroup, setFileSystemGroup] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

const [mode, setMode] = useState('public')

const [fileSystem, setFileSystem] = useMemo(() => {
  if (mode === 'public') {
      return [fileSystemPublic, setFileSystemPublic];
  } else if (mode === 'group') {
      if (selectedGroup) {
          const selectedGroupState = fileSystemGroup[selectedGroup] || initialFileSystem;
          const setSelectedGroupState = (newState) => {
              setFileSystemGroup((prev) => ({
                  ...(prev || {}),
                  [selectedGroup]: newState,
              }));
          };
          return [selectedGroupState, setSelectedGroupState];
      }
      return [fileSystemGroup, setFileSystemGroup];
  } else {
      return [fileSystemPrivate, setFileSystemPrivate];
  }
}, [mode, fileSystemPublic, fileSystemPrivate, fileSystemGroup, selectedGroup]);

  const { isShow, onCancel, onOk, show, type } = useModal();
  const [newDirName, setNewDirName] = useState("");
  const [newName, setNewName] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [currentPath, setCurrentPath] = useState(["Root"]);
  const [isOpenPublish, setIsOpenPublish] = useState(false);
  const currentFolder = useMemo(() => {
    if (!fileSystem) return "";
    let folder = fileSystem[0];
    for (const segment of currentPath.slice(1)) {
      folder = folder.children.find(
        (child) => child.name === segment && child.type === "folder"
      );
    }
    return folder;
  }, [currentPath, fileSystem]);

  useEffect(()=> {
    if(!selectedGroup && groups?.length > 0){
      setSelectedGroup(groups[0]?.groupId)
    }
  }, [groups])

  const handleNavigate = (folderName) => {
    setCurrentPath((prev) => [...prev, folderName]);
  };

  const handleBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath((prev) => prev.slice(0, -1));
    }
  };

  useEffect(() => {
    if(!myAddress?.address) return
    const fetchFileSystem = async () => {
      const data = await getFileSystemQManagerFromDB(myAddress?.address);
      if (data?.private && data?.public){
        setFileSystemPublic(data?.public)
        setFileSystemPrivate(data?.private)
        setFileSystemGroup(data?.group || initialFileSystem)
      } else {
        setFileSystemPublic(initialFileSystem);
        setFileSystemPrivate(initialFileSystem)
        setFileSystemGroup(initialFileSystem)

      }
    };
    fetchFileSystem();
  }, [myAddress?.address]);

  useEffect(() => {
    if (fileSystemPublic && fileSystemPrivate && myAddress?.address) {
      saveFileSystemQManagerToDB({public: fileSystemPublic, private: fileSystemPrivate, group: fileSystemGroup}, myAddress?.address);
    }
  }, [fileSystemPublic , fileSystemPrivate, fileSystemGroup, myAddress?.address]);

  const addDirectoryToCurrent = (directoryName) => {
    if (!directoryName || currentPath.length === 0) return false;

    const updatedFileSystem = JSON.parse(JSON.stringify(fileSystem)); // Deep copy to avoid state mutation
    const targetFolder = currentPath[currentPath.length - 1]; // Current directory
    const parents = currentPath.slice(0, -1); // Parent directories

    let currentNodes = updatedFileSystem;

    // Traverse the parent directories
    for (const parent of parents) {
      const parentNode = currentNodes.find(
        (node) => node.name === parent && node.type === "folder"
      );
      if (!parentNode) return false; // Parent folder not found
      currentNodes = parentNode.children; // Move deeper into the tree
    }

    // Find the current directory
    const currentFolderNode = currentNodes.find(
      (node) => node.name === targetFolder && node.type === "folder"
    );
    if (currentFolderNode) {
      currentFolderNode.children = currentFolderNode.children || [];

      // Ensure unique directory name
      const existingNames = currentFolderNode.children
        .filter((child) => child.type === "folder") // Only check against other folders
        .map((child) => child.name);
      const uniqueDirectoryName = ensureUniqueName(
        directoryName,
        existingNames
      );

      // Add the new directory
      currentFolderNode.children.push({
        type: "folder",
        name: uniqueDirectoryName,
        children: [],
      });

      setFileSystem(updatedFileSystem); // Update the state
      return true;
    }

    return false; // Current directory not found
  };

  const addNodeByPath = (
    pathArray = currentPath,
    newNode,
    nodes = fileSystem
  ) => {
    if (pathArray.length === 0) return false;

    const updatedFileSystem = JSON.parse(JSON.stringify(nodes)); // Deep copy to avoid mutating state
    const target = pathArray[pathArray.length - 1]; // Last item is the target directory
    const parents = pathArray.slice(0, -1); // All but the last item are parent directories

    let currentNodes = updatedFileSystem;

    // Traverse through the parent directories
    for (const parent of parents) {
      const parentNode = currentNodes.find(
        (node) => node.name === parent && node.type === "folder"
      );
      if (!parentNode) return false; // Parent folder not found
      currentNodes = parentNode.children; // Move deeper into the tree
    }

    // Add the new node to the target directory
    const targetNode = currentNodes.find(
      (node) => node.name === target && node.type === "folder"
    );
    if (targetNode) {
      targetNode.children = targetNode.children || [];

      // Ensure unique name for the new node based on type
      const existingNames = targetNode.children
        .filter((child) => child.type === newNode.type) // Only check for conflicts within the same type
        .map((child) => child.name);

      newNode.name = ensureUniqueName(newNode.name, existingNames);

      targetNode.children.push(newNode);
      setFileSystem(updatedFileSystem); // Update the state
      return true;
    }

    return false; // Target directory not found
  };

  const removeByNodePath = async (
    pathArray = currentPath,
    filename,
    nodes = fileSystem
  ) => {
    if (pathArray.length === 0) return false;
    try {
      await show("delete-file");
      const updatedFileSystem = JSON.parse(JSON.stringify(nodes)); // Deep copy to avoid mutating state
      const targetFolder = pathArray[pathArray.length - 1]; // Last item in the path is the target folder
      const parents = pathArray.slice(0, -1); // All but the last item are parent directories

      let currentNodes = updatedFileSystem;

      // Traverse through the parent directories
      for (const parent of parents) {
        const parentNode = currentNodes.find(
          (node) => node.name === parent && node.type === "folder"
        );
        if (!parentNode) return false; // Parent folder not found
        currentNodes = parentNode.children; // Move deeper into the tree
      }

      // Find the target folder
      const targetFolderNode = currentNodes.find(
        (node) => node.name === targetFolder && node.type === "folder"
      );
      if (!targetFolderNode || !targetFolderNode.children) return false; // Target folder not found or has no children

      // Find and remove the file
      const fileIndex = targetFolderNode.children.findIndex(
        (child) => child.name === filename && child.type === "file"
      );
      if (fileIndex !== -1) {
        targetFolderNode.children.splice(fileIndex, 1); // Remove the file from the children array
        setFileSystem(updatedFileSystem); // Update the state
        return true;
      }

      return false; // File not found
    } catch (error) {}
  };

  // Helper function to ensure unique filenames
  const ensureUniqueName = (name, existingNames) => {
    if (!existingNames.includes(name)) return name;

    const nameParts = name.split(".");
    const extension = nameParts.length > 1 ? `.${nameParts.pop()}` : ""; // Extract extension
    let baseName = nameParts.join(".");

    let copyNumber = 1;
    let newName = `${baseName}-copy${extension}`;
    while (existingNames.includes(newName)) {
      copyNumber++;
      newName = `${baseName}-copy${copyNumber}${extension}`;
    }

    return newName;
  };

  const renameByPath = async (item) => {
    try {
      const pathArray = currentPath; // Get the current path
      const oldName = item.name; // Original name of the item
      setNewName(oldName);
      const newNameInput = await show("rename"); // Prompt user for the new name
      const type = item.type; // Type of the item (file or folder)

      // Ensure the new name is not empty
      if (!newNameInput || newNameInput.trim() === "") return false;

      let newName = newNameInput.trim(); // Trim spaces
      const updatedFileSystem = JSON.parse(JSON.stringify(fileSystem)); // Deep copy to avoid state mutation
      const targetFolder = pathArray[pathArray.length - 1]; // Current directory
      const parents = pathArray.slice(0, -1); // Parent directories

      let currentNodes = updatedFileSystem;

      // Traverse through parent directories
      for (const parent of parents) {
        const parentNode = currentNodes.find(
          (node) => node.name === parent && node.type === "folder"
        );
        if (!parentNode) return false; // Parent folder not found
        currentNodes = parentNode.children; // Move deeper into the tree
      }

      // Find the target folder
      const currentFolderNode = currentNodes.find(
        (node) => node.name === targetFolder && node.type === "folder"
      );
      if (!currentFolderNode || !currentFolderNode.children) return false; // Current directory not found or empty

      // Check for conflicts with the new name within the same type
      const existingNames = currentFolderNode.children
        .filter((child) => child.type === type)
        .map((child) => child.name);

      // Ensure a unique name if there is a conflict
      if (existingNames.includes(newName)) {
        let copyIndex = 1;
        const baseName = newName.replace(/(-copy\d*)?$/, ""); // Remove any existing "-copy" suffix
        while (existingNames.includes(newName)) {
          newName = `${baseName}-copy${copyIndex}`;
          copyIndex++;
        }
      }

      // Find the target node by name and type
      const targetNode = currentFolderNode.children.find(
        (child) => child.name === oldName && child.type === type
      );
      if (targetNode) {
        targetNode.name = newName; // Update the name
        setFileSystem(updatedFileSystem); // Update the state
        return true;
      }

      return false; // File or folder not found
    } catch (error) {
      console.log("error", error);
    } finally {
      setNewName("");
    }
  };

  const updateByPath = async (item) => {
    try {
      const pathArray = currentPath; // Get the current path
      const name = item.name; // Original name of the item
      const type = item.type; // Type of the item (file or folder)
  
      const updatedFileSystem = JSON.parse(JSON.stringify(fileSystem)); // Deep copy to avoid state mutation
      const targetFolder = pathArray[pathArray.length - 1]; // Current directory
      const parents = pathArray.slice(0, -1); // Parent directories
  
      let currentNodes = updatedFileSystem;
  
      // Traverse through parent directories
      for (const parent of parents) {
        const parentNode = currentNodes.find(
          (node) => node.name === parent && node.type === "folder"
        );
        if (!parentNode) {
          console.error("Parent folder not found");
          return false; // Parent folder not found
        }
        currentNodes = parentNode.children; // Move deeper into the tree
      }
  
      // Find the target folder
      const currentFolderNode = currentNodes.find(
        (node) => node.name === targetFolder && node.type === "folder"
      );
      if (!currentFolderNode || !currentFolderNode.children) {
        console.error("Current directory not found or empty");
        return false; // Current directory not found or empty
      }
  
      // Find the target node by name and type
      const targetNodeIndex = currentFolderNode.children.findIndex(
        (child) => child.name === name && child.type === type
      );
  
      if (targetNodeIndex !== -1) {
        // Update the node in the file system
        currentFolderNode.children[targetNodeIndex] = { ...currentFolderNode.children[targetNodeIndex], ...item };
  
        setFileSystem(updatedFileSystem); // Update the state
        return true;
      }
  
      console.error("File or folder not found");
      return false; // File or folder not found
    } catch (error) {
      console.error("Error updating file system:", error);
      return false;
    }
  };
  

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeIndex = currentFolder.children.findIndex(
      (item) => item.name + item.type === active.id
    );
    const overIndex = currentFolder.children.findIndex(
      (item) => item.name + item.type === over.id
    );

    const updatedChildren = arrayMove(
      currentFolder.children,
      activeIndex,
      overIndex
    );

    setFileSystem((prev) => {
      const updateFolder = (folder) => {
        if (folder.name === currentFolder.name) {
          return { ...folder, children: updatedChildren };
        }
        if (folder.children) {
          return { ...folder, children: folder.children.map(updateFolder) };
        }
        return folder;
      };
      return prev.map(updateFolder);
    });
  };

  const deleteFolderInCurrent = async (folderName) => {
    if (!folderName || currentPath.length === 0) return false;
    try {
      await show("delete-directory");
      const updatedFileSystem = JSON.parse(JSON.stringify(fileSystem)); // Deep copy to avoid state mutation
      const targetFolder = currentPath[currentPath.length - 1]; // Current directory
      const parents = currentPath.slice(0, -1); // Parent directories

      let currentNodes = updatedFileSystem;

      // Traverse the parent directories
      for (const parent of parents) {
        const parentNode = currentNodes.find(
          (node) => node.name === parent && node.type === "folder"
        );
        if (!parentNode) return false; // Parent folder not found
        currentNodes = parentNode.children; // Move deeper into the tree
      }

      // Find the current directory
      const currentFolderNode = currentNodes.find(
        (node) => node.name === targetFolder && node.type === "folder"
      );
      if (!currentFolderNode || !currentFolderNode.children) return false; // Current directory not found or empty

      // Find and remove the folder by name
      const folderIndex = currentFolderNode.children.findIndex(
        (child) => child.name === folderName && child.type === "folder"
      );
      if (folderIndex !== -1) {
        currentFolderNode.children.splice(folderIndex, 1); // Remove the folder
        setFileSystem(updatedFileSystem); // Update the state
        return true;
      }

      return false; // Folder not found
    } catch (error) {}
  };

  const traverseToFolder = (pathArray, nodes) => {
    let currentNodes = nodes;

    for (const dir of pathArray) {
      if (!currentNodes || !Array.isArray(currentNodes)) {
        console.error(`Invalid currentNodes for dir: ${dir}`);
        return null;
      }

      const folder = currentNodes.find(
        (node) => node.name === dir && node.type === "folder"
      );

      if (!folder) {
        console.error(`Folder not found: ${dir}`);
        return null; // Folder not found
      }

      currentNodes = folder.children;
    }

    return currentNodes; // Returns the children array of the target folder
  };

  const moveNodeByPath = (
    nodeName,
    nodeType,
    sourcePathArray,
    targetPathArray
  ) => {

    if (!nodeName || !nodeType || sourcePathArray.length === 0) {
      console.error("Invalid parameters");
      return false;
    }

    const updatedFileSystem = JSON.parse(JSON.stringify(fileSystem));

    // Updated traverseToFolder function (as above)
    const traverseToFolder = (pathArray, nodes) => {
      let currentNodes = nodes;
      let folder = null;

      for (const dir of pathArray) {
        folder = currentNodes.find(
          (node) => node.name === dir && node.type === "folder"
        );
        if (!folder) {
          console.error(`Folder not found: ${dir}`);
          return null;
        }
        currentNodes = folder.children;
      }

      return folder;
    };

    // Locate the source folder (where the node currently resides)
    const sourceFolder = traverseToFolder(sourcePathArray, updatedFileSystem);
    if (!sourceFolder || !sourceFolder.children) {
      console.error("Source folder not found");
      return false;
    }


    // Locate the target folder
    const targetFolder =
      targetPathArray.length > 0
        ? traverseToFolder(targetPathArray, updatedFileSystem)
        : { children: updatedFileSystem };

    if (!targetFolder || !targetFolder.children) {
      console.error("Target folder not found");
      return false;
    }


    // Find and remove the node from the source folder
    const nodeIndex = sourceFolder.children.findIndex(
      (node) => node.name === nodeName && node.type === nodeType
    );


    if (nodeIndex === -1) {
      console.error("Node not found in source folder");
      return false;
    }

    const [nodeToMove] = sourceFolder.children.splice(nodeIndex, 1);


    // Check for naming conflicts in the target folder
    const existingNames = targetFolder.children
      .filter((node) => node.type === nodeType)
      .map((node) => node.name);

    nodeToMove.name = ensureUniqueName(nodeToMove.name, existingNames);

    // Add the node to the target folder
    targetFolder.children.push(nodeToMove);


    // Update the state
    setFileSystem(updatedFileSystem);
    return true;
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Set a distance to avoid triggering drag on small movements
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10, // Also apply to touch
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!fileSystem) return null;


 
  return (
    <Box sx={{ padding: "8px" }}>
         <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={mode} onChange={async (_, newValue)=> {
setCurrentPath(['Root'])
setMode(newValue)
      }} centered>
        <Tab label="public" value="public" />
        <Tab label="private" value="private" />
        <Tab label="groups" value="group" />
      </Tabs>
    </Box>
    <Spacer height="20px" />
        <Box sx={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center'
        }}>
        <Typography sx={{
          fontSize: '20'
        }}>Q-Manager</Typography>
     
        
        </Box>
        {mode === 'group' && (
            <Box sx={{
              paddingLeft: '20px',
            }}>
            <Label>Select group</Label>
          <Select
            size="small"
            labelId="label-manager-groups"
            id="id-manager-groups"
            value={selectedGroup}
            displayEmpty
            onChange={(e) =>
            {
              if(!selectedGroup && groups?.length > 0 && !e.target.value) {
                setCurrentPath(['Root'])
                setSelectedGroup(groups[0]?.groupId)
                return
              }
              setCurrentPath(['Root'])
              setSelectedGroup(e.target.value)
            }
            }
            sx={{
              width: "300px",
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: "#333333", // Background of the dropdown
                  color: "#ffffff", // Text color
                },
              },
            }}
          >
            
            {groups?.map((group) => {
              return (
                <MenuItem key={group.groupId} value={group.groupId}>
                  {group?.groupName}
                </MenuItem>
              );
            })}
          </Select>
            </Box>
          )}
          {mode === 'group' && !selectedGroup ? (
            <>
            </>
          ) : (
            <>
                <Stack
        direction="row"
        spacing={2}
        sx={{
          position: "fixed",
          bottom: "0px",
          right: "0px",
          height: '60px',
          left: '0px',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingLeft: '20px',
          paddingBottom: '10px',
          backgroundColor: 'rgb(39, 40, 44)',
          zIndex: 5,
          width: '100%'
        }}
      >
        {/* Add Folder Button */}
        <ButtonBase
          onClick={async () => {
            try {
              await show("export-data");
            } catch (error) {}
          }}
          sx={{
            gap: '5px',
            background: '#4444',
            padding: '5px',
            borderRadius: '5px',
          }}
        >
          <SaveAltIcon sx={{fontSize: '28px'}} />
          <Typography variant="body2">
            Save data
          </Typography>
        </ButtonBase>
        <ButtonBase
          onClick={async () => {
            try {
              const dirname = await show("new-directory");
              addDirectoryToCurrent(dirname);
            } catch (error) {
            } finally {
              setNewDirName("");
            }
          }}
          sx={{
            gap: '5px',
            background: '#4444',
            padding: '5px',
            borderRadius: '5px',
          }}
        >
          <CreateNewFolderIcon sx={{fontSize: '28px'}} />
          <Typography variant="body2">
            +Folder
          </Typography>
        </ButtonBase>

        {/* Add File Button */}
        <ButtonBase
          onClick={() => {
            setIsOpenPublish(true);
          }}
          sx={{
            gap: '5px',
            background: '#4444',
    padding: '5px',
    borderRadius: '5px',
          }}
        >
          <InsertDriveFileIcon sx={{fontSize: '28px'}} />
          <Typography variant="body2">
            +File
          </Typography>
        </ButtonBase>
      </Stack>
      <Box
        sx={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
          padding: '10px'
        }}
      >
        {/* <Button
          variant="contained"
          disabled={currentPath.length <= 1}
          onClick={handleBack}
          size="small"
        >
          Back
        </Button> */}
        <FileSystemBreadcrumbs
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
        />
      </Box>
      <Spacer height="5px" />
      <AppsContainer
        sx={{
          gap: "0px",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={(mode === 'group' ? currentFolder?.children?.filter((item)=> item.type === 'folder' || (item.type === 'file' && item?.group === selectedGroup )) : currentFolder?.children)?.map((item) => item.name + item.type)}
          >
            {(mode === 'group' ? currentFolder?.children?.filter((item)=> item.type === 'folder' || (item.type === 'file' && item?.group === selectedGroup) ) : currentFolder?.children)?.map((item) => (
              <SortableItem
                key={item.name + item.type}
                item={item}
                fileSystem={fileSystem}
                currentPath={currentPath}
                moveNode={moveNodeByPath}
                rename={() => {
                  renameByPath(item);
                }}
                removeFile={() => {
                  removeByNodePath(undefined, item.name, undefined);
                }}
                removeDirectory={() => {
                  deleteFolderInCurrent(item.name);
                }}
                onClick={() => {
                  if (item.type === "folder") {
                    handleNavigate(item.name);
                  } else if (item.type === "file") {
                    setSelectedFile(item);
                  }
                }}
              />
            ))}
          </SortableContext>
        </DndContext>
      </AppsContainer>
            </>
          )}
  
 
      {isOpenPublish && (
        <ShowAction
          myName={myAddress?.name?.name}
          addNodeByPath={addNodeByPath}
          handleClose={() => setIsOpenPublish(false)}
          selectedAction={{
            action: "PUBLISH_QDN_RESOURCE",
          }}
          mode={mode}
          groups={groups}
          selectedGroup={selectedGroup}
        />
      )}
      {isShow && (
        <Dialog
          open={isShow}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: {
              backgroundColor: "rgb(39, 40, 44)",
              color: "#27282c !important",
            },
          }}
        >
          {type === "delete-directory" && (
            <>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete this directory
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => onOk(newDirName)}
                  autoFocus
                >
                  Confirm
                </Button>
              </DialogActions>
            </>
          )}
          {type === "delete-file" && (
            <>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete this file
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => onOk(newDirName)}
                  autoFocus
                >
                  Confirm
                </Button>
              </DialogActions>
            </>
          )}

          {type === "new-directory" && (
            <>
              <DialogContent>
                <Label>Directory name</Label>
                <input
                style={{
                  maxWidth: '100%'
                }}
                  type="text"
                  className="custom-input"
                  value={newDirName}
                  onChange={(e) => setNewDirName(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  disabled={!newDirName}
                  variant="contained"
                  onClick={() => onOk(newDirName)}
                  autoFocus
                >
                  Save
                </Button>
              </DialogActions>
            </>
          )}

          {type === "rename" && (
            <>
              <DialogContent>
                <Label>Rename</Label>
                <input
                style={{
                  maxWidth: '100%'
                }}
                  type="text"
                  className="custom-input"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  disabled={!newName}
                  variant="contained"
                  onClick={() => onOk(newName)}
                  autoFocus
                >
                  Save
                </Button>
              </DialogActions>
            </>
          )}
          {type === "export-data" && (
            <>
              <DialogContent>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>

              
                <Button
                variant="contained"
                  onClick={async () => {
                    try {
                      const data64 = await objectToBase64({public: fileSystemPublic, private: fileSystemPrivate, group: fileSystemGroup});

                      const encryptedData = await qortalRequest({
                        action: "ENCRYPT_DATA",
                        data64,
                      });

                      const blob = new Blob([encryptedData], {
                        type: "text/plain",
                      });
                      const timestamp = new Date()
                        .toISOString()
                        .replace(/:/g, "-"); // Safe timestamp for filenames
                      const filename = `q-manager-backup-filesystem-${myAddress?.address}-${timestamp}.txt`;
                      await qortalRequest({
                        action: "SAVE_FILE",
                        filename,
                        blob,
                      });
                    } catch (error) {}
                  }}
                >
                  Export filesystem data to local disk
                </Button>
                <Button
                variant="contained"
                  onClick={async () => {
                    try {
                      const fileContent = await handleImportClick();
                      const decryptedData = await qortalRequest({
                        action: "DECRYPT_DATA",
                        encryptedData: fileContent,
                      });
                      const decryptToUnit8ArraySubject =
                        base64ToUint8Array(decryptedData);
                      const responseData = uint8ArrayToObject(
                        decryptToUnit8ArraySubject
                      );
                      if(responseData?.public && responseData?.private){
                        setFileSystemPublic(responseData?.public)
                        setFileSystemPrivate(responseData?.private)
                      }
                    } catch (error) {
                      console.log("error", error);
                    }
                  }}
                >
                  Import filesystem
                </Button>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={onCancel}>
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      )}

      {selectedFile && (
        <SelectedFile
        groups={groups}
        mode={mode}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          updateByPath={updateByPath}
          selectedGroup={selectedGroup}
        />
      )}
    </Box>
  );
};

export const AppsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "90%",
  justifyContent: "space-evenly",
  gap: "10px",
  flexWrap: "wrap",
  alignItems: "flex-start",
  alignSelf: "center",
  paddingBottom: '50px'
}));
