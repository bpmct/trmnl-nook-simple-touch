/* #__NO_SIDE_EFFECTS__ */
export function getInt32LittleEndian(buffer, offset) {
    return (buffer[offset] |
        (buffer[offset + 1] << 8) |
        (buffer[offset + 2] << 16) |
        (buffer[offset + 3] << 24));
}
/* #__NO_SIDE_EFFECTS__ */
export function getInt32BigEndian(buffer, offset) {
    return ((buffer[offset] << 24) |
        (buffer[offset + 1] << 16) |
        (buffer[offset + 2] << 8) |
        buffer[offset + 3]);
}
/* #__NO_SIDE_EFFECTS__ */
export function getInt32(buffer, offset, littleEndian) {
    return littleEndian
        ? buffer[offset] |
            (buffer[offset + 1] << 8) |
            (buffer[offset + 2] << 16) |
            (buffer[offset + 3] << 24)
        : (buffer[offset] << 24) |
            (buffer[offset + 1] << 16) |
            (buffer[offset + 2] << 8) |
            buffer[offset + 3];
}
export function setInt32LittleEndian(buffer, offset, value) {
    buffer[offset] = value;
    buffer[offset + 1] = value >> 8;
    buffer[offset + 2] = value >> 16;
    buffer[offset + 3] = value >> 24;
}
export function setInt32BigEndian(buffer, offset, value) {
    buffer[offset] = value >> 24;
    buffer[offset + 1] = value >> 16;
    buffer[offset + 2] = value >> 8;
    buffer[offset + 3] = value;
}
export function setInt32(buffer, offset, value, littleEndian) {
    if (littleEndian) {
        buffer[offset] = value;
        buffer[offset + 1] = value >> 8;
        buffer[offset + 2] = value >> 16;
        buffer[offset + 3] = value >> 24;
    }
    else {
        buffer[offset] = value >> 24;
        buffer[offset + 1] = value >> 16;
        buffer[offset + 2] = value >> 8;
        buffer[offset + 3] = value;
    }
}
//# sourceMappingURL=int32.js.map