import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/zh-cn';

// Localization
dayjs.locale('zh-cn');
// Set default timezone to UTC+8 (only effective for timezone used in dayjs.tz())
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Shanghai');

// Wrapper for dayjs.tz function
const dayjsWrapper = function (...args: any[]) {
  return (dayjs as any)(...args).tz();
};

// Add all properties and methods from dayjs to dayjsWrapper
Object.assign(dayjsWrapper, dayjs);

export default dayjsWrapper as typeof dayjs;
