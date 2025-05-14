import { generateReportEntity } from './generateReportEntity.js';

export class pmMonthlyReportController {
    async getMonthlyReport(theMonth){
        const reportEntity = new generateReportEntity();
        const report = await reportEntity.getMonthlyReport(theMonth);

        return report;
    }
}