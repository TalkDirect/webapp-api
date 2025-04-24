export class utils {

    // Function that generates the header bitfield for the websocket packet
    static generateWSHeaderField(finishedBit: number, opcode: number, payloadLength: number) {
        let returnBuffer = new Uint8Array(2);
        returnBuffer[0] = finishedBit+0b000+opcode << 2;
        let tempBuffer = new Uint8Array(1);
        tempBuffer[0] = tempBuffer[0] | payloadLength;
        returnBuffer[1] = 0b10000000 | tempBuffer[0];

        return returnBuffer;
    }

    applyMask(payload: Uint8Array, maskingKey: Uint8Array): Uint8Array {
        const maskedPayload = new Uint8Array(payload.length);
        for (let i = 0; i < payload.length; i++) {
            maskedPayload[i] = payload[i] ^ maskingKey[i % 4];
        }
        return maskedPayload;
    }

    static decodeWSHeaderField() {

    }
}