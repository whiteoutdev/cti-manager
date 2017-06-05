export default class AbstractModel {
    public serialiseToDatabase(): any {
        return this;
    }

    public serialiseToApi(): any {
        return this;
    }
}
