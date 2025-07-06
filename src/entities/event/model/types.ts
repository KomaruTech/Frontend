// @entities/event/index.ts (or similar path where your Event interface is defined)

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    endDate?: string; // Optional if it's not always present
    time: string;
    endTime: string;
    type: string;
    address?: string; // Optional if it can be missing
    creator: string;
    keywords: string[];
    // Add the new properties:
    rawTimeStart: string;
    rawTimeEnd: string;
    localTimeStart: string;
    localTimeEnd: string;
}