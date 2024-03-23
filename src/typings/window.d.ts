declare global {
    interface Window {
        EXAM_CONFIG: {
            BASEURL: string;
            TOKEN: string;
            USER: {
                username: string;
                name: string;
                role: string;
            };
        };
    }
}

export default global;