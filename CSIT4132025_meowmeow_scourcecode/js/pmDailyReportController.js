
import { generateReportEntity } from './generateReportEntity.js';

export class pmDailyReportController {
    async getDailyReport (dailyDate){
        const reportEntity = new generateReportEntity();
        const reportList = await reportEntity.getDailyReport(dailyDate);

        return reportList;
    }
}