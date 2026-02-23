/* #__NO_SIDE_EFFECTS__ */
export function getUint16LittleEndian(buffer, offset) {
    return buffer[offset] | (buffer[offset + 1] << 8);
}
/* #__NO_SIDE_EFFECTS__ */
export function getUint16BigEndian(buffer, offset) {
    return (buffer[offset] << 8) | buffer[offset + 1];
}
/* #__NO_SIDE_EFFECTS__ */
export function getUint16(buffer, offset, littleEndian) {
    return littleEndian
        ? buffer[offset] | (buffer[offset + 1] << 8)
        : buffer[offset + 1] | (buffer[offset] << 8);
}
export function setUint16LittleEndian(buffer, offset, value) {
    buffer[offset] = value;
    buffer[offset + 1] = value >> 8;
}
export function setUint16BigEndian(buffer, offset, value) {
    buffer[offset] = value >> 8;
    buffer[offset + 1] = value;
}
export function setUint16(buffer, offset, value, littleEndian) {
    if (littleEndian) {
        buffer[offset] = value;
        buffer[offset + 1] = value >> 8;
    }
    else {
        buffer[offset] = value >> 8;
        buffer[offset + 1] = value;
    }
}
//# sourceMappingURL=uint16.js.map