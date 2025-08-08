import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import ExcelChart from "./ExcelChart";
import { uploadChartType, uploadFileHistory } from "../lib/api";
import { useLocation } from "react-router-dom";


const UserHome = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xAxisColumn, setXAxisColumn] = useState("");
  const [yAxisColumn, setYAxisColumn] = useState("");
  const [chartType, setChartType] = useState("select");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const location = useLocation();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reanalyzeUrl = params.get("reanalyzeUrl");
    if (reanalyzeUrl) {
      fetchAndParseFile(reanalyzeUrl);
    }
  }, [location.search]);

  const fetchAndParseFile = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();

      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      setParsedData(jsonData);

      if (jsonData.length > 0) {
        const cols = Object.keys(jsonData[0]);
        setColumns(cols);
        setXAxisColumn("");
        setYAxisColumn("");
        setChartType("select");
      }
    } catch (err) {
      console.error("Failed to parse file for reanalysis:", err);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setUploadSuccess(false);
    setUploadError(null);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await uploadFileHistory(formData);
      const data = res.data;

      setUploadSuccess(true);

      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        setParsedData(jsonData);

        if (jsonData.length > 0) {
          const cols = Object.keys(jsonData[0]);
          setColumns(cols);
          setXAxisColumn("");
          setYAxisColumn("");
          setChartType("select");
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    } catch (err) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const generateChartData = () => {
    if (!parsedData || parsedData.length === 0 || columns.length === 0) return null;

    if (chartType === "pie") {
      if (!yAxisColumn) return null;

      const yData = parsedData.map((row) => Number(row[yAxisColumn]));
      const labels = parsedData.map((_, i) => `Row ${i + 1}`);

      return {
        labels,
        datasets: [
          {
            label: yAxisColumn,
            data: yData,
            backgroundColor: ["#66b3ff", "#99ff99", "#ffcc99", "#ff9999", "#c2c2f0"],
          },
        ],
      };
    }

    if (chartType === "select") return null;

    if (!xAxisColumn || !yAxisColumn) return null;

    const xData = parsedData.map((row) => row[xAxisColumn]);
    const yData = parsedData.map((row) => Number(row[yAxisColumn]));

    return {
      labels: xData,
      datasets: [
        {
          label: `${yAxisColumn} vs ${xAxisColumn}`,
          data: yData,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          fill: chartType === "line",
        },
      ],
    };
  };

  const chartData = generateChartData();

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Upload Excel File</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileSelect}
        className="text-gray-400"
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleFileUpload}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      {uploadError && <p className="text-red-400 mt-2">{uploadError}</p>}

      {columns.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-4 items-center">
          {chartType !== "pie" && (
            <div>
              <label className="block text-sm font-semibold">X-Axis</label>
              <select
                className="border rounded px-2 py-1 text-black"
                value={xAxisColumn}
                onChange={(e) => setXAxisColumn(e.target.value)}
              >
                <option value="">Select Column</option>
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold">Y-Axis</label>
            <select
              className="border rounded px-2 py-1 text-black"
              value={yAxisColumn}
              onChange={(e) => setYAxisColumn(e.target.value)}
            >
              <option value="">Select Column</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold">Chart Type</label>
            <select
              className="border rounded px-2 py-1 text-black"
              value={chartType}
              onChange={(e) => {
                const selectedType = e.target.value;
                setChartType(selectedType);

                if (selectedType !== "select") {
                  uploadChartType(selectedType);
                }
              }}
            >
              <option value="select">Select</option>
              <option onClick={() => uploadChartType("bar")} value="bar">Bar</option>
              <option onClick={() => uploadChartType("line")} value="line">Line</option>
              <option onClick={() => uploadChartType("pie")} value="pie">Pie</option>
            </select>
          </div>
        </div>
      )}

      {chartData && (
        <div id="chart-container" className="mt-8 bg-white p-4 rounded-lg">
          <ExcelChart chartType={chartType} chartData={chartData} />
        </div>
      )}
    </div>
  );
};

export default UserHome;
