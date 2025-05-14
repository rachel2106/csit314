
import { generateReportEntity } from './generateReportEntity.js';

export class pmDailyReportController {
    async getDailyReport (dailyData){
        const reportEntity = new generateReportEntity();
        const report = await reportEntity.getDailyReport(dailyData);

        return report;
    }
}