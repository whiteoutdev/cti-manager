export default class AbstractModel {
    serialiseToDatabase(): any {
        return this;
    }

    serialiseToApi(): any {
        return this;
    }
}
