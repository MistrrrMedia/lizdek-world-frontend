export interface Show {
    id: string;
    venue: string;
    city: string;
    state_province: string;
    country: string;
    ticket_link?: string;
    show_date: string;
}

export interface CreateShowData {
    venue: string;
    city: string;
    state_province: string;
    country: string;
    ticket_link?: string;
    show_date: string;
} 