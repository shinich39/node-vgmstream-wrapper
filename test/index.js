import { decode } from "../dist/node-vgmstream-wrapper.mjs";

const input = "./test/self_ichika_2nd.acb";

decode(input).then((res) => {
  console.log(res);
}).catch((err) => {
  console.error(err);
});