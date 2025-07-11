import React, { useEffect, useState } from "react";
import { getFileHistory, deleteFileHistory } from "../lib/api";
import { Trash2, BarChart, Eye, Download } from "lucide-react";
import * as XLSX from "xlsx";

const UserHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewData, setViewData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewFileName, setViewFileName] = useState("");

  const fetchHistory = async () => {
    try {
      const data = await getFileHistory();
      setHistory(data.reverse());
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await deleteFileHistory(fileId);
      setHistory((prev) => prev.filter((item) => item._id !== fileId));
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handleReanalyze = (fileUrl) => {
  const encodedUrl = encodeURIComponent(fileUrl);
  window.location.href = `/user-dashboard?reanalyzeUrl=${encodedUrl}`;
};

  const handleView = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const buffer = await response.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setViewFileName(fileName);
      setViewData(jsonData);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to view file", err);
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName.endsWith(".xlsx") || fileName.endsWith(".xls")
        ? fileName
        : `${fileName}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-16">📁 Uploaded Files History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p>No uploaded files history.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {history.map((file) => (
            <div
              key={file._id}
              className="relative bg-white text-black border border-gray-300 rounded-lg p-4 shadow-sm group hover:shadow-lg hover:border-green-600 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="bg-green-600 p-2 rounded-md">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
                    alt="Excel Icon"
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <p className="font-semibold truncate max-w-[180px]">{file.fileName}</p>
                  <p className="text-xs text-gray-400">
                    Uploaded at:{" "}
                    {new Date(file.uploadedAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>

              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleView(file.fileUrl, file.fileName)}
                  className="bg-green-600 p-1 rounded hover:bg-green-700"
                  title="View File"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleReanalyze(file.fileUrl)}
                  className="bg-blue-600 p-1 rounded hover:bg-blue-700 text-white"
                  title="Reanalyze"
                >
                  <BarChart size={16} />
                </button>
                <button
                  onClick={() => handleDownload(file.fileUrl, file.fileName)}
                  className="bg-yellow-500 p-1 rounded hover:bg-yellow-600"
                  title="Download"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => handleDelete(file._id)}
                  className="bg-red-600 p-1 rounded hover:bg-red-700 text-white"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-white text-black p-4 max-h-[80vh] overflow-auto rounded-lg w-full max-w-4xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{viewFileName}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-red-500 font-bold"
              >
                Close
              </button>
            </div>

            {viewData.length === 0 ? (
              <p>No data found in file.</p>
            ) : (
              <div className="overflow-auto">
                <table className="min-w-full text-sm border border-gray-300 shadow-inner">
                  <thead className="bg-green-200">
                    <tr>
                      {Object.keys(viewData[0]).map((col) => (
                        <th
                          key={col}
                          className="px-3 py-2 border border-gray-300 text-black font-semibold text-left"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {viewData.map((row, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}
                      >
                        {Object.values(row).map((val, j) => (
                          <td
                            key={j}
                            className="px-3 py-2 border border-gray-300 text-black"
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHistory;
