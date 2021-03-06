"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parsePly = require("parse-ply");
const str3stream = require('string-to-stream');
function parsePlyAsync(ply) {
    return new Promise((resolve, reject) => {
        const stream = str3stream(ply);
        parsePly(stream, (err, data) => {
            console.log(arguments);
            if (err)
                reject(err);
            resolve(data);
        });
    });
}
function triangulateFaces(indices) {
    const res = [];
    for (let i = 0; i < indices.length; i++) {
        const face = indices[i];
        const fl = face.length;
        if (fl === 3) {
            res.push(...face);
        }
        else if (fl === 4) {
            res.push(face[0], face[1], face[2]);
            res.push(face[0], face[2], face[3]);
        }
        else {
            throw `unsupported face size ${fl}`;
        }
    }
    return new Uint16Array(res);
}
async function convert(ply, opts) {
    const data = await parsePlyAsync(ply);
    const vattribs = [];
    // assert all attributes exist in the file
    for (const aname of opts.attribs) {
        const a = data.vertex[aname];
        if (a === undefined) {
            throw new Error(`File doesn't contain attribute ${aname}`);
        }
        vattribs.push(a);
    }
    const floatPerVert = opts.attribs.length;
    const numVerts = data.vertex[opts.attribs[0]].length;
    const indices = triangulateFaces(data.face.vertex_indices);
    const vbufferSize = numVerts * floatPerVert * 4;
    const ibufferSize = indices.length * 2;
    const buffersize = 
    // vbuffer size
    4 +
        // vbuffer data
        vbufferSize +
        // ibuffer data, assuming short indices
        ibufferSize;
    var buffer = Buffer.alloc(buffersize);
    let ptr = 0;
    console.log(numVerts, opts.attribs.length, buffersize);
    buffer.writeInt32LE(vbufferSize, ptr);
    ptr += 4;
    for (let i = 0; i < numVerts; i++) {
        for (let j = 0; j < vattribs.length; j++) {
            buffer.writeFloatLE(vattribs[j][i], ptr);
            ptr += 4;
        }
    }
    for (let i = 0; i < indices.length; i++) {
        buffer.writeInt16LE(indices[i], ptr);
        ptr += 2;
    }
    return buffer;
}
const PLY2GL = {
    convert
};
exports.default = PLY2GL;
