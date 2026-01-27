import { Departure, Settings } from '@/types/route';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface PrintReportProps {
  departures: Departure[];
  settings: Settings;
  grandTotal: {
    distance: number;
    fuelConsumption: number;
    totalCost: number;
  };
}

export function PrintReport({ departures, settings, grandTotal }: PrintReportProps) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const calculatedDepartures = departures.filter(d => d.distance !== null);
    
    const html = `
      <!DOCTYPE html>
      <html lang="ro">
      <head>
        <meta charset="UTF-8">
        <title>Raport Estimare Fonduri Rută</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @page { size: A4; margin: 10mm; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 16px;
            color: #1a1a2e;
            line-height: 1.3;
            font-size: 11px;
          }
          .header {
            text-align: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #0f766e;
          }
          .header h1 {
            color: #0f766e;
            font-size: 16px;
            margin-bottom: 2px;
          }
          .header .date {
            color: #64748b;
            font-size: 10px;
          }
          .settings-section {
            background: #f8fafc;
            padding: 10px 12px;
            border-radius: 4px;
            margin-bottom: 12px;
          }
          .settings-section h2 {
            font-size: 11px;
            color: #475569;
            margin-bottom: 6px;
          }
          .settings-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }
          .setting-item { text-align: center; }
          .setting-item .label {
            font-size: 9px;
            color: #64748b;
            text-transform: uppercase;
          }
          .setting-item .value {
            font-size: 12px;
            font-weight: 600;
            color: #1e293b;
          }
          .departure-card {
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            margin-bottom: 8px;
            overflow: hidden;
          }
          .departure-header {
            background: linear-gradient(135deg, #0f766e, #14b8a6);
            color: white;
            padding: 6px 10px;
            font-weight: 600;
            font-size: 11px;
          }
          .departure-body { padding: 10px; }
          .route-info { margin-bottom: 6px; }
          .route-info .label {
            font-size: 9px;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 1px;
          }
          .route-info .value {
            font-size: 10px;
            color: #1e293b;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            background: #f8fafc;
            padding: 8px;
            border-radius: 4px;
          }
          .stat-item { text-align: center; }
          .stat-item .value {
            font-size: 14px;
            font-weight: 700;
            color: #0f766e;
          }
          .stat-item .unit {
            font-size: 9px;
            color: #64748b;
          }
          .grand-total {
            background: linear-gradient(135deg, #0f766e, #14b8a6);
            color: white;
            padding: 12px;
            border-radius: 4px;
            margin-top: 12px;
          }
          .grand-total h2 {
            text-align: center;
            margin-bottom: 10px;
            font-size: 13px;
          }
          .grand-total .stats-grid {
            background: rgba(255, 255, 255, 0.1);
          }
          .grand-total .stat-item .value { color: white; }
          .grand-total .stat-item .unit { color: rgba(255, 255, 255, 0.8); }
          .footer {
            text-align: center;
            margin-top: 12px;
            padding-top: 8px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 9px;
          }
          @media print {
            body { padding: 0; font-size: 10px; }
            .header { margin-bottom: 8px; padding-bottom: 4px; }
            .header h1 { font-size: 14px; }
            .header .date { font-size: 9px; }
            .settings-section { padding: 8px 10px; margin-bottom: 8px; }
            .settings-section h2 { font-size: 10px; margin-bottom: 4px; }
            .settings-grid { gap: 6px; }
            .setting-item .label { font-size: 8px; }
            .setting-item .value { font-size: 11px; }
            .departure-card { margin-bottom: 6px; }
            .departure-header { padding: 4px 8px; font-size: 10px; }
            .departure-body { padding: 6px; }
            .route-info { margin-bottom: 4px; }
            .route-info .label { font-size: 8px; }
            .route-info .value { font-size: 9px; }
            .stats-grid { gap: 6px; padding: 6px; }
            .stat-item .value { font-size: 12px; }
            .stat-item .unit { font-size: 8px; }
            .grand-total { padding: 8px; margin-top: 8px; }
            .grand-total h2 { margin-bottom: 6px; font-size: 11px; }
            .footer { margin-top: 8px; padding-top: 4px; font-size: 8px; }
            .departure-card { break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Raport Estimare Fonduri Rută</h1>
          <p class="date">Generat la: ${new Date().toLocaleDateString('ro-RO', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>

        <div class="settings-section">
          <h2>Setări Calcul</h2>
          <div class="settings-grid">
            <div class="setting-item">
              <div class="label">Tip Combustibil</div>
              <div class="value">${settings.fuelType}</div>
            </div>
            <div class="setting-item">
              <div class="label">Preț Combustibil</div>
              <div class="value">${settings.fuelPrice.toFixed(2)} RON/L</div>
            </div>
            <div class="setting-item">
              <div class="label">Consum Mediu</div>
              <div class="value">${settings.averageConsumption} L/100km</div>
            </div>
          </div>
        </div>

        ${calculatedDepartures.map(departure => `
          <div class="departure-card">
            <div class="departure-header">${departure.name}</div>
            <div class="departure-body">
              <div class="route-info">
                <div class="label">Adresă Plecare</div>
                <div class="value">${departure.startAddress.value || '-'}</div>
              </div>
              ${departure.intermediateStops.length > 0 ? `
                <div class="route-info">
                  <div class="label">Opriri Intermediare</div>
                  <div class="value">${departure.intermediateStops.map(s => s.value).filter(Boolean).join(' → ') || '-'}</div>
                </div>
              ` : ''}
              <div class="route-info">
                <div class="label">Adresă Întoarcere</div>
                <div class="value">${departure.returnAddress.value || '-'}</div>
              </div>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="value">${departure.distance?.toFixed(1) || '0'}</div>
                  <div class="unit">km</div>
                </div>
                <div class="stat-item">
                  <div class="value">${departure.fuelConsumption?.toFixed(1) || '0'}</div>
                  <div class="unit">litri</div>
                </div>
                <div class="stat-item">
                  <div class="value">${departure.totalCost?.toFixed(0) || '0'}</div>
                  <div class="unit">RON</div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}

        <div class="grand-total">
          <h2>Total General</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="value">${grandTotal.distance.toFixed(1)}</div>
              <div class="unit">km total</div>
            </div>
            <div class="stat-item">
              <div class="value">${grandTotal.fuelConsumption.toFixed(1)}</div>
              <div class="unit">litri total</div>
            </div>
            <div class="stat-item">
              <div class="value">${grandTotal.totalCost.toFixed(0)}</div>
              <div class="unit">RON total</div>
            </div>
          </div>
        </div>

        <div class="footer">
          Estimator Fonduri Rută © ${new Date().getFullYear()}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const hasCalculatedDepartures = departures.some(d => d.distance !== null);

  return (
    <Button
      onClick={handlePrint}
      disabled={!hasCalculatedDepartures}
      variant="outline"
      className="gap-2"
    >
      <Printer className="h-4 w-4" />
      Printează Raport
    </Button>
  );
}
