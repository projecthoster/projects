export default class Color {
    constructor(hexName) {
        this.hex = hexName;
    }

    getHex() {
        return this.hex;
    };

    setHex(hexName) {
        this.hex = hexName;
    };
}