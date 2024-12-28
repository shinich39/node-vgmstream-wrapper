# node-vgmstream-wrapper

vgmstream wrapper.

## Usage

```js
import { decode } from "../dist/node-vgmstream-wrapper.mjs";

const input = "./test/self_ichika_2nd.acb";

decode(input).then((res) => {
  console.log(res);
  // [
  //   {
  //     filename: 'voice_selfep_3rdaniv_band_01_01.wav',
  //     buffer: <Buffer 52 49 46 46 ec f3 07 00 57 41 56 45 66 6d 74 20 10 00 00 00 01 00 01 00 44 ac 00 00 88 58 01 00 02 00 10 00 64 61 74 61 c8 f3 07 00 00 00 00 00 00 00 ... 521154 more bytes>
  //   },
  //   ...
  // ]
}).catch((err) => {
  console.error(err);
});
```

## Version

- r1951

## References

- [vgmstream](https://github.com/vgmstream/vgmstream/blob/master/doc/USAGE.md#testexevgmstream-cli-command-line-decoder)