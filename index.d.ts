/// <reference types="node" />
declare type AttribOption = string;
declare type ConvertOptions = {
    attribs: AttribOption[];
};
declare function convert(ply: string, opts: ConvertOptions): Promise<Buffer>;
declare const PLY2GL: {
    convert: typeof convert;
};
export default PLY2GL;
