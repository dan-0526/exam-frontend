export interface Res<T = unknown> {
    message: string;
    code: number;
    data: T;
}