export interface Comment {
    body: string;
    place_id: string;
    owner: boolean | undefined;
    _id: string // MongoDB id from Mongoose
}