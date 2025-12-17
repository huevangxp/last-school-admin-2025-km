export const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString();
};

export const formatDateTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
};

export const hiddenId = (id: any) => {
    return id.slice(0, 3) + "*****" + id.slice(-3);
};