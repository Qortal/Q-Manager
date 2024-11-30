import React, { useState } from "react";
import { Box, ButtonBase, CircularProgress, MenuItem, Select, styled } from "@mui/material";
import { DisplayCode } from "../components/DisplayCode";
import { DisplayCodeResponse } from "../components/DisplayCodeResponse";

import beautify from "js-beautify";
import Button from "../components/Button";
import { useDropzone } from "react-dropzone";
import { services } from "../constants";

export const Label = styled("label")(
  ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 14px;
    display: block;
    margin-bottom: 4px;
    font-weight: 400;
    `
);

export const formatResponse = (code) => {
  return beautify.js(code, {
    indent_size: 2, // Number of spaces for indentation
    space_in_empty_paren: true, // Add spaces inside parentheses
  });
};
export const PUBLISH_MULTIPLE_QDN_RESOURCES = () => {
  const [requestData, setRequestData] = useState({
    service: "DOCUMENT",
    identifier: "test-identifier",
  });

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const fileSelected = acceptedFiles[0];
      if (fileSelected) {
        setFile(fileSelected);
      }
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(
    formatResponse(`{
    "type": "PUBLISH_MULTIPLE_QDN_RESOURCES",
    "timestamp": 1697286687406,
    "reference": "3jU9WpEPAvu9iL3cMfVd2AUmn9AijJRzkGCxVtXfpuUFZubM8AFDcbk5XA9m5AhPfsbMDFkSDzPJnkjeLA5GA59E",
    "fee": "0.01000000",
    "signature": "3QJ1EUvX3rskVNaP3RWvJwb9DsGgHPvneWqBWS62PCcuCj5N4Ei9Tr4nFj4nQeMqMU2qNkVD3Sb59e7iUWkawH3s",
    "txGroupId": 0,
    "approvalStatus": "NOT_REQUIRED",
    "creatorAddress": "Qhxphh7g5iNtxAyLLpPMZzp4X85yf2tVam",
    "voterPublicKey": "C5spuNU1BAHZDEkxF3wnrAPRDuNrVceaDJ6tDKitenko",
    "pollName": "A test poll 3",
    "optionIndex": 1
  }`)
  );

  const codePollName = `
await qortalRequest({
  action: "PUBLISH_MULTIPLE_QDN_RESOURCES",
  service: "${requestData?.service}",
  identifier: "${requestData?.identifier}", // optional 
  data64: ${requestData?.data64 ? `"${requestData?.data64}"` : "empty"}, // base64 string. Remove this param if you are putting in a FILE object 
  file: ${file ? 'FILE OBJECT' : "empty"} // File Object. Remove this param if you are putting in a base64 string.
});
`.trim();

  const executeQortalRequest = async () => {
    try {
      setIsLoading(true);
      let account = await qortalRequest({
        action: "PUBLISH_MULTIPLE_QDN_RESOURCES",
        service: requestData?.service,
        identifier: requestData?.identifier,
        file,
        data64: requestData?.data64
      });

      setResponseData(formatResponse(JSON.stringify(account)));
    } catch (error) {
      setResponseData(formatResponse(JSON.stringify(error)));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e) => {
    setRequestData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  return (
    <div
      style={{
        padding: "10px",
      }}
    >
      <div className="card">
        <div className="message-row">
          <Label>Service</Label>
          <Select
            size="small"
            labelId="label-select-category"
            id="id-select-category"
            value={requestData?.service}
            displayEmpty
            onChange={(e) => setRequestData((prev)=> {
              return {
                ...prev,
                service: e.target.value
              }
            })}
            sx={{
              width: '300px'
            }}
          >
            <MenuItem value={0}>
              <em>No service selected</em>
            </MenuItem>
            {services?.map((service) => {
              return (
                <MenuItem key={service.name} value={service.name}>
                  {`${service.name} - max ${service.sizeLabel}`} 
                </MenuItem>
              );
            })}
          </Select>
          <Label>Index option</Label>
          <input
            type="text"
            className="custom-input"
            placeholder="identifier"
            value={requestData.identifier}
            name="identifier"
            onChange={handleChange}
          />
          <button {...getRootProps()} style={{
            width: '150px'
          }}>
            <input {...getInputProps()} />
            Select file
          </button>
          {file && (
            <ButtonBase sx={{
              width: '150px'
            }} onClick={()=> {
              setFile(null)
            }}>Remove file</ButtonBase>
          )}
          <Label>Base64 string</Label>
          <input
            type="text"
            className="custom-input"
            name="data64"
          value={requestData?.data64}
          onChange={handleChange}
        />
          <Button
            name="Publish"
            bgColor="#309ed1"
            onClick={executeQortalRequest}
          />
        </div>
      </div>
      <Box
        sx={{
          display: "flex",
          gap: "20px",
        }}
      >
        <Box
          sx={{
            width: "50%",
          }}
        >
          <h3>Request</h3>
          <DisplayCode codeBlock={codePollName} language="javascript" />
        </Box>
        <Box
          sx={{
            width: "50%",
          }}
        >
          <h3>Response</h3>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <DisplayCodeResponse
              codeBlock={responseData}
              language="javascript"
            />
          )}
        </Box>
      </Box>
    </div>
  );
};
