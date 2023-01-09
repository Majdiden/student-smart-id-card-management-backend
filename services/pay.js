const axios = require("axios");
const crypto = require('crypto');
const cookieParser = require("cookie-parser");
const isomorphicCookie = require('isomorphic-cookie');

axios.defaults.withCredentials = true;
const Pay = async (req, res) => {
    res.send({ message: "SUCCESSFUL" });
  const unique = crypto.randomUUID();
  console.log("unique:", unique);
//   axios
//     .post(
//       "http://syberapp.test.sybertechnology.com/api/login",
//       {
//         userIdentifier: "0111111111",
//         password: "hello2020",
//         fireBaseToken: "1",
//       },
//       {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "xwrsy67Un9oshl8H=c5g",
//           Version: 77,
//         },
//       }
//     )
//     .then(async (response1) => {
    //   console.log("login: ", response1.headers["set-cookie"]);
      console.log(req)
    //   if (response1.status == 200) {
        var headers = {
            Connection: "keep-alive",
            "Content-Type": "application/json",
            Authorization: "eAGqwRPbYhFqCZOxywKS",
            Version: 15,
            Accept: '*/*',
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
            Cookie: isomorphicCookie.load('serverCookie') ? isomorphicCookie.load('serverCookie') : null,
          };
          if(headers.Cookie == null){
            headers.Cookie = "remember-me-posc=WGJxdVRmU04reGpRUFFsaHJmNVZ1Zz09OkFxb0ZicGFHeFh1QkI3d1N2UXgrWmc9PQ"
          }
          
        await axios
          .post(
            "http://syberapp.test.sybertechnology.com/payment",
            {
              iPIN: "YmZFhTysLdrBMxAx3caP8mrxmhlQYHkKGGI+IxqizeJPl9jQzyIoSX1gr5i/Pz4PJoLedFPe30PJCaC8j0CKNw==",
              amount: "100.0",
              transactionId: unique,
              serviceId: "001001000039",
              customerRef: "249999990234",
              expDate: "08/23",
              authType: "10",
              pan: "7888450004340823",
            },
            {
              withCredentials: true,
              headers
              
            }
          )
          .then(async (response2) => {
            console.log(response2);
            if(response2.data.responseStatus == "SUCCESSFUL"){
                // console.log(rmbme)
               await isomorphicCookie.save('serverCookie', response2.headers["set-cookie"][0].slice(
                    0,
                    response2.headers["set-cookie"][0].indexOf(";")
                    ));
                    res.send({ message: response2.data.responseStatus });
                    console.log(headers)
                    console.log(isomorphicCookie.load('serverCookie'));
            }
          })
          .catch((err1) => console.log(err1));
      }
//     })
//     .catch((err2) => console.log("login error: ", err2));
// };

module.exports = { Pay };
