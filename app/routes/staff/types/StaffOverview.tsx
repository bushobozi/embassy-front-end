export interface StaffOverview {
    total: number;
    byStatus: {
        active: number;
        inactive: number;
        onLeave: number;
        retired: number;
    };
    byGender: {
        male?: number;
        female?: number;
        other?: number;
    };
    byDepartment: {
        [departmentName: string]: number;
    };
    transferred: number;
}