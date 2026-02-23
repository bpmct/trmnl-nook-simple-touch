/* #__NO_SIDE_EFFECTS__ */
export function getInt16LittleEndian(buffer, offset) {
    return ((buffer[offset] | (buffer[offset + 1] << 8)) << 16) >> 16;
}
/* #__NO_SIDE_EFFECTS__ */
export function getInt16BigEndian(buffer, offset) {
    return (((buffer[offset] << 8) | buffer[offset + 1]) << 16) >> 16;
}
/* #__NO_SIDE_EFFECTS__ */
export function getInt16(buffer, offset, littleEndian) {
    return littleEndian
        ? ((buffer[offset] | (buffer[offset + 1] << 8)) << 16) >> 16
        : (((buffer[offset] << 8) | buffer[offset + 1]) << 16) >> 16;
}
/* #__NO_SIDE_EFFECTS__ */
export function setInt16LittleEndian(buffer, offset, value) {
    buffer[offset] = value;
    buffer[offset + 1] = value >> 8;
}
export function setInt16BigEndian(buffer, offset, value) {
    buffer[offset] = value >> 8;
    buffer[offset + 1] = value;
}
export function setInt16(buffer, offset, value, littleEndian) {
    if (littleEndian) {
        buffer[offset] = value;
        buffer[offset + 1] = value >> 8;
    }
    else {
        buffer[offset] = value >> 8;
        buffer[offset + 1] = value;
    }
}
//# sourceMappingURL=int16.js.map