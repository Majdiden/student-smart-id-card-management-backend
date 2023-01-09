const { NFC } = require("nfc-pcsc");
var ndef = require("@taptrack/ndef");

const scanToIssue = (_req, res) => {
  const nfc = new NFC();
  const KEY_TYPE_A = 0x60;
  const KEY_TYPE_B = 0x61;
  const encapsulate = (data, blockSize = 16) => {
    if (data.length > 0xfffe) {
      throw new Error("Maximal NDEF message size exceeded.");
    }

    const prefix = Buffer.allocUnsafe(data.length > 0xfe ? 4 : 2);
    prefix[0] = 0x03; // NDEF type
    if (data.length > 0xfe) {
      prefix[1] = 0xff;
      prefix.writeInt16BE(data.length, 2);
    } else {
      prefix[1] = data.length;
    }

    const suffix = Buffer.from([0xfe]);

    const totalLength = prefix.length + data.length + suffix.length;
    const excessLength = totalLength % blockSize;
    const rightPadding = excessLength > 0 ? blockSize - excessLength : 0;
    const newLength = totalLength + rightPadding;

    return Buffer.concat([prefix, data, suffix], newLength);
  };

  nfc.on("reader", async (reader) => {
    reader.aid = "FFFFFFFFFF";
    console.log(`${reader.reader.name}  device attached`);
   await reader.on("card", async (card) => {
     await reader.authenticate(4, KEY_TYPE_B, "ffffffffffff");
      console.log(`${reader.reader.name}  card detected`, card);
      await res.send({ message: "success"});
    });

    reader.on("card.off", (card) => {
      console.log(`${reader.reader.name}  card removed`, card);
    });

    reader.on("error", (err) => {
      console.log(`${reader.reader.name}  an error occurred`, err);
    });

    reader.on("end", () => {
      console.log(`${reader.reader.name}  device removed`);
    });
  });
};

module.exports = { scanToIssue };
