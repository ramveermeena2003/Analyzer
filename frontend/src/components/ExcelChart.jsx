// ExcelChart.jsx
import React, { useRef } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
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

  // Common PNG export function
  const getChartImage = () => {
    const chart = chartRef.current;
    if (!chart) return null;

    return chart.toBase64Image(); // returns PNG base64
  };

  const handleDownloadPNG = () => {
    const imgURL = getChartImage();
    if (!imgURL) return;

    const link = document.createElement("a");
    link.href = imgURL;
    link.download = "chart.png";
    link.click();
  };

  const handleDownloadPDF = () => {
    const imgURL = getChartImage();
    if (!imgURL) return;

    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgURL, "PNG", 10, 10, pdfWidth - 20, pdfHeight - 20);
    pdf.save("chart.pdf");
  };

  // Pie chart vibrant colors
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
      {chartType === "bar" && <Bar ref={chartRef} {...chartProps} />}
      {chartType === "line" && <Line ref={chartRef} {...chartProps} />}
      {chartType === "pie" && <Pie ref={chartRef} {...chartProps} />}

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
