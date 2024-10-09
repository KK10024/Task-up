export interface taskCreateDTO {
    title: string;
    sub_title: string;
    content: string;
    user_id: string;
}

export interface taskUpdateDTO {
    title?: string;
    sub_title?: string; 
    content?: string;
    user_id: string;
}