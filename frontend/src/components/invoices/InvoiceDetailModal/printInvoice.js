import toast from 'react-hot-toast';
import { numberToWords } from './numberToWords';

// Opens a print window with an A4 tax-invoice layout for the given invoice.
export const createPrintHandler = (invoice) => {
  const handlePrint = () => {
    if (!invoice) return;

    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) {
      toast.error('Please allow popups to print / download PDF.');
      return;
    }

    const firmName = invoice.firm?.firmName || 'CHARTERED ACCOUNTANTS FIRM';
    const firmAddress = invoice.firm?.address || 'PNTC, vejalpur, Ahmedabad Gujarat';
    const firmGstin = invoice.firm?.gstNumber || '24ABCDE1234F1Z5';
    const firmEmail = invoice.firm?.email || 'codelix@gmail.com';
    const firmPhone = invoice.firm?.phone || '9825621601';

    const clientName = invoice.client?.companyName || invoice.client?.clientName || 'Sharma & co.';
    const clientEmail = invoice.client?.email || 'sharma@gmail.com';
    const clientGstin = invoice.client?.gstNumber || '09AAACH7409R1ZZ';
    const clientPan = invoice.client?.panNumber || 'NOXDJ4514L';

    const itemsRows = (invoice.items || [])
      .map(
        (item, idx) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${idx + 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
            <strong style="color: #0f172a;">${item.description}</strong>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #475569;">${item.sacCode || '998231'}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: bold;">${item.quantity || 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #334155;">₹${Number(item.unitPrice || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #0f172a;">₹${Number(item.amount || 0).toLocaleString('en-IN')}</td>
        </tr>
      `
      )
      .join('');

    const subTotal = Number(invoice.subTotal || 0).toLocaleString('en-IN');
    const cgst = Number(invoice.cgstAmount || 0).toLocaleString('en-IN');
    const sgst = Number(invoice.sgstAmount || 0).toLocaleString('en-IN');
    const igst = Number(invoice.igstAmount || 0).toLocaleString('en-IN');
    const totalAmount = Number(invoice.totalAmount || 0).toLocaleString('en-IN');
    const paidAmount = Number(invoice.paidAmount || 0).toLocaleString('en-IN');
    const balanceAmount = Number(invoice.balanceAmount || 0).toLocaleString('en-IN');
    const amountInWordsStr = numberToWords(invoice.totalAmount || 0);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${invoice.invoiceNumber} - Original Tax Invoice</title>
          <style>
            @page { size: A4; margin: 12mm; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; margin: 0; padding: 25px; font-size: 13px; background: #ffffff; }
            .bill-card { border: 2px solid #1e3a8a; padding: 25px; border-radius: 12px; background: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-bottom: 2px solid #1e3a8a; padding-bottom: 15px; }
            .firm-title { font-size: 24px; font-weight: 900; color: #1e3a8a; text-transform: uppercase; margin: 0; letter-spacing: -0.5px; }
            .inv-title { font-size: 26px; font-weight: 900; color: #1d4ed8; text-align: right; text-transform: uppercase; margin: 0; }
            .details-box { width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; }
            .details-box td { padding: 14px; vertical-align: top; width: 50%; background: #f8fafc; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th { background: #1e3a8a; color: #ffffff; text-transform: uppercase; font-size: 11px; padding: 11px 10px; letter-spacing: 0.5px; }
            .summary-container { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
            .words-box { width: 55%; background: #f1f5f9; padding: 12px 15px; border-radius: 8px; border-left: 4px solid #1d4ed8; font-size: 12px; }
            .totals-table { width: 40%; border-collapse: collapse; }
            .totals-table td { padding: 6px 10px; }
            .grand-total { background: #eff6ff; font-weight: 900; font-size: 15px; color: #1e3a8a; border-top: 2px solid #1d4ed8; border-bottom: 2px solid #1d4ed8; }
            .footer-section { width: 100%; margin-top: 30px; border-top: 1px solid #cbd5e1; pt: 15px; font-size: 11px; color: #64748b; }
            .sign-box { text-align: right; margin-top: 30px; }
            .sign-line { display: inline-block; width: 220px; border-top: 1.5px solid #475569; margin-top: 45px; pt: 6px; font-weight: bold; text-align: center; color: #1e293b; }
            @media print {
              body { padding: 0; }
              .bill-card { border: none; box-shadow: none; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="bill-card">
            <table class="header-table">
              <tr>
                <td style="vertical-align: top;">
                  <h1 class="firm-title">${firmName}</h1>
                  <p style="margin: 4px 0 2px 0; color: #475569; font-weight: 500;">${firmAddress}</p>
                  <p style="margin: 2px 0; color: #334155;">Firm GSTIN: <strong style="color: #0f172a;">${firmGstin}</strong></p>
                  <p style="margin: 2px 0; color: #334155;">Email: <strong>${firmEmail}</strong> ${firmPhone ? `| Phone: <strong>${firmPhone}</strong>` : ''}</p>
                </td>
                <td style="vertical-align: top; text-align: right;">
                  <h2 class="inv-title">${invoice.invoiceType === 'PROFORMA' ? 'PROFORMA INVOICE' : 'TAX INVOICE'}</h2>
                  <p style="font-size: 16px; font-weight: 900; margin: 4px 0; color: #0f172a;">${invoice.invoiceNumber}</p>
                  <p style="margin: 2px 0; color: #475569;">Issue Date: <strong>${new Date(invoice.issueDate).toLocaleDateString('en-IN')}</strong></p>
                  <p style="margin: 2px 0; color: #b91c1c;">Due Date: <strong>${new Date(invoice.dueDate).toLocaleDateString('en-IN')}</strong></p>
                </td>
              </tr>
            </table>

            <table class="details-box">
              <tr>
                <td style="border-right: 1px solid #cbd5e1;">
                  <span style="font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">BILLED TO (CLIENT):</span>
                  <p style="font-size: 15px; font-weight: 900; color: #0f172a; margin: 5px 0 3px 0;">${clientName}</p>
                  <p style="margin: 2px 0; color: #475569;">Email: ${clientEmail}</p>
                  <p style="margin: 2px 0; color: #334155;">Client GSTIN: <strong style="color: #0f172a;">${clientGstin}</strong></p>
                  <p style="margin: 2px 0; color: #334155;">PAN: <strong style="color: #0f172a;">${clientPan}</strong></p>
                </td>
                <td>
                  <span style="font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">SUPPLY DETAILS:</span>
                  <p style="margin: 5px 0 3px 0; color: #334155;">Place of Supply: <strong>${invoice.placeOfSupply || '24-GUJARAT'}</strong></p>
                  <p style="margin: 2px 0; color: #334155;">GST Type: <strong>${invoice.isInterState ? 'Inter-State (IGST)' : 'Intra-State (CGST + SGST)'}</strong></p>
                  <p style="margin: 2px 0; color: #334155;">Payment Status: <strong style="color: ${invoice.status === 'PAID' ? '#16a34a' : '#b91c1c'}; text-transform: uppercase;">${invoice.status}</strong></p>
                </td>
              </tr>
            </table>

            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 6%;">#</th>
                  <th style="width: 44%; text-align: left;">DESCRIPTION OF SERVICES</th>
                  <th style="width: 14%;">SAC CODE</th>
                  <th style="width: 8%;">QTY</th>
                  <th style="width: 14%; text-align: right;">RATE (₹)</th>
                  <th style="width: 14%; text-align: right;">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <div class="summary-container">
              <div class="words-box">
                <span style="font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase;">AMOUNT IN WORDS:</span>
                <p style="font-size: 13px; font-weight: 800; color: #1e3a8a; margin: 4px 0 0 0;">${amountInWordsStr}</p>
              </div>

              <table class="totals-table">
                <tr>
                  <td style="color: #475569;">Subtotal:</td>
                  <td style="text-align: right; font-weight: bold; color: #0f172a;">₹${subTotal}</td>
                </tr>
                ${
                  !invoice.isInterState
                    ? `
                  <tr>
                    <td style="color: #475569;">CGST (9%):</td>
                    <td style="text-align: right; font-weight: bold; color: #1d4ed8;">+₹${cgst}</td>
                  </tr>
                  <tr>
                    <td style="color: #475569;">SGST (9%):</td>
                    <td style="text-align: right; font-weight: bold; color: #1d4ed8;">+₹${sgst}</td>
                  </tr>
                `
                    : `
                  <tr>
                    <td style="color: #475569;">IGST (18%):</td>
                    <td style="text-align: right; font-weight: bold; color: #1d4ed8;">+₹${igst}</td>
                  </tr>
                `
                }
                <tr class="grand-total">
                  <td>Total Amount:</td>
                  <td style="text-align: right;">₹${totalAmount}</td>
                </tr>
                <tr>
                  <td style="color: #475569;">Paid Amount:</td>
                  <td style="text-align: right; font-weight: bold; color: #16a34a;">₹${paidAmount}</td>
                </tr>
                <tr>
                  <td style="color: #b91c1c; font-weight: bold;">Outstanding Balance:</td>
                  <td style="text-align: right; font-weight: bold; color: #b91c1c;">₹${balanceAmount}</td>
                </tr>
              </table>
            </div>

            <div class="footer-section">
              <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                  <p style="font-weight: bold; color: #0f172a; margin: 0 0 4px 0;">Terms & Conditions:</p>
                  <ol style="margin: 0; padding-left: 18px; color: #64748b; line-height: 1.6;">
                    <li>Payment is due within 15 days of invoice date.</li>
                    <li>Please quote invoice number on all payments and bank transfers.</li>
                    <li>This is an official computer generated Tax Invoice issued by Chartered Accountants Firm.</li>
                  </ol>
                </div>
                <div class="sign-box">
                  <p style="margin: 0; font-weight: bold; color: #0f172a;">For ${firmName}</p>
                  <div class="sign-line">Authorised Signatory</div>
                </div>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return handlePrint;
};
