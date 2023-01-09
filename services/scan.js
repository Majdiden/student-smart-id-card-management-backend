const { NFC } = require("nfc-pcsc");
var ndef = require("@taptrack/ndef");

const Scan = (_req, res) => {
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

      await reader.read(4, 32, 16).then(async (data) => {
        try {
          console.log("data:", data);
          var message = ndef.Message.fromBytes(data);
          var records = message.getRecords();

          var recordContents = ndef.Utils.resolveTextRecord(records[0]);
          console.log("Content: " + recordContents.content);
          if (recordContents.content) {
            await res.send({ message: "success", card: recordContents.content });
          }
          console.log("Language: " + recordContents.language);
        } catch (err) {
          console.log("err:", err);
        }
      });

    //   var textRecord = ndef.Utils.createTextRecord("7888450004340823");
    //   var message = new ndef.Message([textRecord]);
    //   var bytes = message.toByteArray();
    //   const data = encapsulate(Buffer.from(bytes.buffer));
    //   await reader.authenticate(4, KEY_TYPE_A, "ffffffffffff");
    //   reader.write(4, data, 16);
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

module.exports = { Scan };
