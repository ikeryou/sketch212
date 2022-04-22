import { Conf } from './core/conf';
import { Rect } from './libs/rect';
import { Item } from './parts/item';
import { Color } from "three/src/math/Color";
import './style.css'

const selectClassNames:Array<string> = [];
const posTable:Array<any> = [];
const sampleImgSize:Rect = new Rect();

// 画像解析して選択したとき用のクラスを作っておく
const img:HTMLImageElement = new Image();
img.onload = () => {
  const cvs:any = document.createElement('canvas');
  cvs.width = img.width;
  cvs.height = img.height;
  sampleImgSize.width = img.width;
  sampleImgSize.height = cvs.height;
  const ctx = cvs.getContext('2d');
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';

  const imageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const key = ~~(i / 4)
    const ix = ~~(key % cvs.width)
    const iy = ~~(key / cvs.height)

    if(iy % 2 == 0) {
      let r = data[i + 0] // 0 ~ 255
      let g = data[i + 1] // 0 ~ 255
      let b = data[i + 2] // 0 ~ 255
      const a = data[i + 3] // 0 ~ 255

      // 白だと反映されないので調整
      if(r >= 250 && g >= 250 && b >= 250) {
        r -= 10
        g -= 10
        b -= 10
      }

      // const col = new Color(a > 0 ? 0xff0000 : 0xffffff);
      let col:Color = new Color(r/255, g/255, b/255);
      if(a <= 0) col = new Color(0x0000ff)

      const sheets = document.styleSheets
      const sheet = sheets[sheets.length - 1];
      const name = 'col-' + ix + '-' + iy
      sheet.insertRule(
        '.' + name + '::selection { background: ' + col.getStyle() + '; color: #000; }',
        // '.' + name + '::selection { color: ' + col.getStyle() + '; }',
        sheet.cssRules.length
      );
      selectClassNames.push(name);

      posTable.push({
        className:name,
        x:ix,
        y:iy,
      })
    }
  }
  console.log(posTable.length);

  const tg = document.querySelector('.l-main');
  if(tg != undefined) {
    const num = posTable.length;
    for(let i = 0; i < num; i++) {
      const item = document.createElement('div');
      tg.append(item);
    }
  }

  new Item({
    el:(document.querySelector('.l-main') as HTMLElement),
    sampleSize:sampleImgSize,
    selectClassName:selectClassNames,
    posTable:posTable,
  })
}

img.src = Conf.instance.PATH_IMG + 'sample-64.png';




