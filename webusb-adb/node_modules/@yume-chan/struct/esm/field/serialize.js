/* Adapt default field serializer to universal field serializer */
export function defaultFieldSerializer(serializer) {
    return (source, context) => {
        if ("buffer" in context) {
            const buffer = serializer(source, context);
            context.buffer.set(buffer, context.index);
            return buffer.length;
        }
        else {
            return serializer(source, context);
        }
    };
}
/* Adapt byob field serializer to universal field serializer */
export function byobFieldSerializer(size, serializer) {
    return (source, context) => {
        if ("buffer" in context) {
            context.index ??= 0;
            serializer(source, context);
            return size;
        }
        else {
            const buffer = new Uint8Array(size);
            serializer(source, {
                buffer,
                index: 0,
                littleEndian: context.littleEndian,
            });
            return buffer;
        }
    };
}
//# sourceMappingURL=serialize.js.map