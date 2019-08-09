
 class ReverseMask extends egret.DisplayObjectContainer {
	/** 缩放程度 */
	private _scaleRate: number = 1;
	/** 缩放时长（毫秒） */
	public _scaleTime: number = 5000;
	/** 遮罩对象 */
	private _maskBitmap: egret.Bitmap = null;
    private _stage;
    public constructor(stage) {
        super();
        this._stage = stage;
        let sky = this.createBitmapByName("bg_jpg");
        sky.width = this._stage.stageWidth;
        sky.height = this._stage.stageHeight;
        this.addChild(sky);
		this.__start();
    }

	/** 开始缩放 */
	private __start()
	{
		this.__stop();
		egret.Tween.get(this, {onChange: () => { this.__update(); }, onChangeObj: this})
		.to({_scaleRate: 0}, this._scaleTime)
		.call(() => { console.log("Done!"); });
	}

	/** 结束缩放 */
	private __stop()
	{
		this._scaleRate = 20;
		this._maskBitmap && this._maskBitmap.parent && this._maskBitmap.parent.removeChild(this._maskBitmap);
		this._maskBitmap = null;
		egret.Tween.removeTweens(this);
	}

	/** 更新缩放 */
	public __update()
	{
		//-- 将原来的遮罩图的混合模式设置为擦除
		let bitmapMask = new egret.Bitmap(RES.getRes('mask'));
		bitmapMask.blendMode = egret.BlendMode.ERASE;
		bitmapMask.anchorOffsetX = bitmapMask.width >> 1
		bitmapMask.anchorOffsetY = bitmapMask.height >> 1;
		bitmapMask.scaleX = bitmapMask.scaleY = this._scaleRate;
		bitmapMask.x = this._stage.stageWidth >> 1;
		bitmapMask.y = this._stage.stageHeight >> 1;

		//-- 反遮罩容器
		let reverseMask = new egret.Sprite();
		reverseMask.graphics.beginFill(0, 1);
		reverseMask.graphics.drawRect(0, 0, this._stage.stageWidth, this._stage.stageHeight);
		reverseMask.graphics.endFill();
		reverseMask.addChild(bitmapMask);

		//-- 创建一个RenderTexture，把反遮罩绘制上去
		let renderTex = new egret.RenderTexture();
		renderTex.drawToTexture(reverseMask);
		let mask = new egret.Bitmap(renderTex);
		this._maskBitmap = mask;
		this.mask = this._maskBitmap;
		!this._maskBitmap.parent && this.addChild(this._maskBitmap);
	}

    /** 根据name关键字创建一个Bitmap对 */
    private createBitmapByName(name: string) 
    {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}