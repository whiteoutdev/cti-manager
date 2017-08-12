class Utils {
    public clone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }
}

export default new Utils();
