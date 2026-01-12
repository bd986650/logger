export type LogType = 'INFO' | 'ERROR';

export type ParsedLine = {
  logType: LogType;
  userId?: string;
};

export type FinalStats = {
  totalLines: number;
  errorLines: number;
  topUsers: Array<{ userId: string; errors: number }>;
};