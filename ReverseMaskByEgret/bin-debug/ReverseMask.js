var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var ReverseMask = (function (_super) {
    __extends(ReverseMask, _super);
    function ReverseMask(stage) {
        var _this = _super.call(this) || this;
        /** 缩放程度 */
        _this._scaleRate = 1;
        /** 缩放时长（毫秒） */
        _this._scaleTime = 5000;
        /** 遮罩对象 */
        _this._maskBitmap = null;
        _this._stage = stage;
        var sky = _this.createBitmapByName("bg_jpg");
        sky.width = _this._stage.stageWidth;
        sky.height = _this._stage.stageHeight;
        _this.addChild(sky);
        _this.__start();
        return _this;
    }
    /** 开始缩放 */
    ReverseMask.prototype.__start = function () {
        var _this = this;
        this.__stop();
        egret.Tween.get(this, { onChange: function () { _this.__update(); }, onChangeObj: this })
            .to({ _scaleRate: 0 }, this._scaleTime)
            .call(function () { console.log("Done!"); });
    };
    /** 结束缩放 */
    ReverseMask.prototype.__stop = function () {
        this._scaleRate = 20;
        this._maskBitmap && this._maskBitmap.parent && this._maskBitmap.parent.removeChild(this._maskBitmap);
        this._maskBitmap = null;
        egret.Tween.removeTweens(this);
    };
    /** 更新缩放 */
    ReverseMask.prototype.__update = function () {
        //-- 将原来的遮罩图的混合模式设置为擦除
        var bitmapMask = new egret.Bitmap(RES.getRes('mask'));
        bitmapMask.blendMode = egret.BlendMode.ERASE;
        bitmapMask.anchorOffsetX = bitmapMask.width >> 1;
        bitmapMask.anchorOffsetY = bitmapMask.height >> 1;
        bitmapMask.scaleX = bitmapMask.scaleY = this._scaleRate;
        bitmapMask.x = this._stage.stageWidth >> 1;
        bitmapMask.y = this._stage.stageHeight >> 1;
        //-- 反遮罩容器
        var reverseMask = new egret.Sprite();
        reverseMask.graphics.beginFill(0, 1);
        reverseMask.graphics.drawRect(0, 0, this._stage.stageWidth, this._stage.stageHeight);
        reverseMask.graphics.endFill();
        reverseMask.addChild(bitmapMask);
        //-- 创建一个RenderTexture，把反遮罩绘制上去
        var renderTex = new egret.RenderTexture();
        renderTex.drawToTexture(reverseMask);
        var mask = new egret.Bitmap(renderTex);
        this._maskBitmap = mask;
        this.mask = this._maskBitmap;
        !this._maskBitmap.parent && this.addChild(this._maskBitmap);
    };
    /** 根据name关键字创建一个Bitmap对 */
    ReverseMask.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return ReverseMask;
}(egret.DisplayObjectContainer));
__reflect(ReverseMask.prototype, "ReverseMask");
//# sourceMappingURL=ReverseMask.js.map