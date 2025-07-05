export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    endDate?: string;
    time: string;
    endTime: string;
    type?: string;
    address?: string;
    creator?: string;
    keywords?: string[];
}
