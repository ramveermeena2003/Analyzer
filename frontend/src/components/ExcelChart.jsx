// ExcelChart.jsx
import React, { useRef } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ExcelChart = ({ chartType, chartData }) => {
  const chartRef = useRef(null);

  const handleDownloadPNG = () => {
    const chart = chartRef.current;
    if (!chart) return;

    const url = chart.toBase64Image();
    const link = document.createElement("a");
    link.href = url;
    link.download = "chart.png";
    link.click();
  };

  // const handleDownloadPDF = async () => {
  //   const chartCanvas = chartRef.current.canvas;
  //   const canvas = await html2canvas(chartCanvas);
  //   const imgData = canvas.toDataURL("image/png");

  //   const pdf = new jsPDF();
  //   const imgProps = pdf.getImageProperties(imgData);
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //   pdf.save("chart.pdf");
  // };

  const handleDownloadPDF = async () => {
  const chartWrapper = document.getElementById("chart-container");
  if (!chartWrapper) return;

  // Clone node without Tailwind styles
  const clonedNode = chartWrapper.cloneNode(true);

  // Create a clean container
  const tempContainer = document.createElement("div");
  tempContainer.style.position = "fixed";
  tempContainer.style.top = "-10000px";
  tempContainer.style.left = "-10000px";
  tempContainer.style.background = "#ffffff"; // ✅ safe background
  tempContainer.style.color = "#000000";      // ✅ safe text color
  tempContainer.style.fontFamily = "Arial, sans-serif"; // ✅ safe font
  tempContainer.appendChild(clonedNode);
  document.body.appendChild(tempContainer);

  try {
    const canvas = await html2canvas(tempContainer, {
      useCORS: true, // in case external fonts/images are used
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("chart.pdf");
  } catch (err) {
    console.error("PDF export failed:", err);
  } finally {
    // Clean up the cloned DOM
    document.body.removeChild(tempContainer);
  }
};




  // Add more vibrant colors for pie charts if missing
  const pieColors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
    "#9966FF", "#FF9F40", "#8DFF33", "#FF33F6",
    "#00CED1", "#E6E6FA", "#FFD700", "#40E0D0"
  ];

  const enhancedChartData = {
    ...chartData,
    datasets: chartData.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor:
        chartType === "pie"
          ? pieColors.slice(0, chartData.labels.length)
          : dataset.backgroundColor || "#36A2EB",
      borderColor:
        chartType !== "pie"
          ? dataset.borderColor || "#000000"
          : undefined,
      borderWidth: chartType !== "pie" ? 1 : 0,
    })),
  };

  const chartProps = {
    data: enhancedChartData,
    ref: chartRef,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Excel Chart" },
      },
    },
  };

  return (
    <div className="space-y-4 h-[400px]">
      {chartType === "bar" && <Bar {...chartProps} />}
      {chartType === "line" && <Line {...chartProps} />}
      {chartType === "pie" && <Pie {...chartProps} />}

      <div className="flex gap-4 mt-4">
        <button className="btn btn-outline" onClick={handleDownloadPNG}>
          Download PNG
        </button>
        <button className="btn btn-outline" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ExcelChart;
