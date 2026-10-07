import React, { useRef, useState } from 'react';
import TemplateModern from './TemplateModern';
import TemplateATS from './TemplateATS';
import TemplateExecutive from './TemplateExecutive';
import { Download, Printer, Check } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const CVPreview = ({ data, template = 'modern', fileName = 'CV_HireFit' }) => {
  const containerRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!containerRef.current) return;
    setDownloading(true);

    const element = containerRef.current.querySelector('.cv-sheet');
    const opt = {
      margin: 8,
      filename: `${fileName.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF export error:', err);
      // Fallback to print dialog
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderTemplate = () => {
    switch (template) {
      case 'minimal':
        return <TemplateATS data={data} />;
      case 'executive':
        return <TemplateExecutive data={data} />;
      case 'modern':
      default:
        return <TemplateModern data={data} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div className="no-print cv-preview-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ minHeight: 38, flex: '1 1 auto' }}
          onClick={handlePrint}
        >
          <Printer size={14} /> Print
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          style={{ minHeight: 38, flex: '2 1 auto' }}
          onClick={handleDownloadPDF}
          disabled={downloading}
        >
          {downloading ? (
            <>
              <div className="spinner" style={{ width: 14, height: 14 }} />
              Exporting PDF...
            </>
          ) : (
            <>
              <Download size={14} /> Download PDF
            </>
          )}
        </button>
      </div>

      <div className="cv-document-container" ref={containerRef}>
        {renderTemplate()}
      </div>
    </div>

  );
};

export default CVPreview;
