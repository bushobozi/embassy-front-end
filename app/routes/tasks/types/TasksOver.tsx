export interface TasksOverview {
    total: number;
    byStatus: {
        pending: number;
        inProgress: number;
        completed: number;
    };
    byPriority: {
        low: number;
        medium: number;
        high: number;
    };
    urgent: number;
    overdue: number;
}