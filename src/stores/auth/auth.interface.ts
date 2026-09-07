export type TUser = {
    _id: string;
    name: string;
    phone: string;
};

export type TAuthStore = {
    user: TUser | null;
    login: (data: { phone: string; name: string; }) => void;
    logout: () => void;
};
