import React, { useState } from 'react';
import axios from 'axios';
import './generate-reports.css';
import { toast } from 'react-toastify';

const GenerateReports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportUrl, setReportUrl] = useState('');

  const handleGenerateReport = async () => {
    try {
      const response = await axios.post(
        'http://10.19.20.135:6500/api/generate-report',
        {
          startDate,
          endDate,
        },
        { responseType: 'blob' } // Ensure the response is treated as a blob
      );

      if (response) {
        toast.success('Report generated successfully');
        
        // Create a URL for the ZIP file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setReportUrl(url);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Error while generating report');
    }
  };

  return (
    <div className="generate-reports-container">
      <h3>Generate Report</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerateReport();
        }}
      >
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>
        <button type="submit">Generate Report</button>
      </form>
      {reportUrl && (
        <a href={reportUrl} download="reports.zip">
          Download Reports
        </a>
      )}
    </div>
  );
};

export default GenerateReports;
