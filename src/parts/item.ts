
import { MyDisplay } from "../core/myDisplay";
import { Rect } from "../libs/rect";

// -----------------------------------------
//
// -----------------------------------------
export class Item extends MyDisplay {

  private _item:Array<any> = [];
  private _posTable:Array<any> = [];
  private _sampleSize:Rect;

  constructor(opt:{el:HTMLElement, sampleSize:Rect, selectClassName:Array<string>, posTable:Array<any>}) {
    super(opt)

    this._sampleSize = opt.sampleSize;
    // this._selectClassNames = opt.selectClassName;
    this._posTable = opt.posTable;

    const baseTxt = 'drink beer,'.split('')
    this.qsAll('div').forEach((val,i) => {
      // const txt = Util.instance.randomArr('ABCDEFGHIKLMNOPRSTUVWXYZ0123456789'.split(''));;
      const txt = baseTxt[i % baseTxt.length].toUpperCase();
      const el = val as HTMLElement;
      el.innerHTML = txt;

      const data = this._posTable[i];
      if(data.x == this._sampleSize.width - 1) {
        el.append(document.createElement('br'))
      }

      el.classList.add(data.className)

      this._item.push({
        el:el,
        posData:data,
        now:data.className,
        cnt:0,
      });
    });
  }


  protected _update(): void {
    super._update();

    if(this._c % 4 == 0) {
      this._item.forEach((val) => {
        const el:HTMLElement = val.el;
        el.classList.remove(val.now);

        let x = (val.posData.x + val.cnt) % this._sampleSize.width
        const n = 'col-' + x + '-' + val.posData.y;
        val.now = n;
        el.classList.add(val.now);

        val.cnt += 5;
      })
    }
  }
}