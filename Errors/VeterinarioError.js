export default class VeterinarioError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}