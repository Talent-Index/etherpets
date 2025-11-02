const ExportService = require('../services/exportService');

class ExportController {
  // Export pet report as PDF
  static async exportPetReport(req, res) {
    try {
      const { petId } = req.params;

      const pdfBuffer = await ExportService.generatePetReport(petId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=pet-report-${petId}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error generating PDF report',
        error: error.message,
      });
    }
  }

  // Export user data as JSON
  static async exportUserData(req, res) {
    try {
      const { walletAddress } = req.params;

      const jsonData = await ExportService.exportUserData(walletAddress);

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=user-data-${walletAddress}.json`);
      res.send(jsonData);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error exporting user data',
        error: error.message,
      });
    }
  }

  // Export activity as CSV
  static async exportActivityCSV(req, res) {
    try {
      const { walletAddress } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required',
        });
      }

      const csvData = await ExportService.generateCSVReport(walletAddress, startDate, endDate);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=activity-${startDate}-to-${endDate}.csv`);
      res.send(csvData);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error generating CSV report',
        error: error.message,
      });
    }
  }
}

module.exports = ExportController;