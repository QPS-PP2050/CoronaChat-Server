// Copyright 2015 - 2020 Amish Shah.  All rights reserved. Apache-2.0 License.

import { idToBinary, binaryToID } from './Util';

// CoronaChat epoch (2020-09-01T00:00:00.000Z)
const EPOCH = 1598918400000;
let INCREMENT = 0;

export function generate(timestamp: number | Date = Date.now()) {
    if (timestamp instanceof Date) timestamp = timestamp.getTime();
    if (typeof timestamp !== 'number' || isNaN(timestamp)) {
        throw new TypeError(
            `"timestamp" argument must be a number (received ${isNaN(timestamp) ? 'NaN' : typeof timestamp})`,
        );
    }
    if (INCREMENT >= 4095) INCREMENT = 0;
    const BINARY = `${(timestamp - EPOCH).toString(2).padStart(42, '0')}0000100000${(INCREMENT++)
        .toString(2)
        .padStart(12, '0')}`;
    return binaryToID(BINARY);
}

export function deconstruct(snowflake: string) {
    const BINARY = idToBinary(snowflake).toString().padStart(64, '0');
    const res = {
      timestamp: parseInt(BINARY.substring(0, 42), 2) + EPOCH,
      workerID: parseInt(BINARY.substring(42, 47), 2),
      processID: parseInt(BINARY.substring(47, 52), 2),
      increment: parseInt(BINARY.substring(52, 64), 2),
      binary: BINARY,
    };
    Object.defineProperty(res, 'date', {
      get: function get() {
        return new Date(this.timestamp);
      },
      enumerable: true,
    });
    return res;
  }