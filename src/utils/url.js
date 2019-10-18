export function isURL(string) {
    try {
        const url = new URL(string);
    } catch (e) {
        if(e instanceof TypeError) return false;
        else return string.length > 0;
    }
    return true;
}