$('.btn').on('mousedown',function(){
	$(this).children().css('-webkit-transform','scale(0.95)');
});
//开始再来一次结束游戏
$('.btn').on('mouseup',function(){
	$(this).children().css('-webkit-transform','scale(1)');
	if($(this).hasClass("begin")){
		game();
	}
	if($(this).hasClass("again")){
		game();
	}
	if($(this).hasClass("quit")){
		$(".wrap").empty();
	}

});
//图片路径
var imgsSrc=[
		[
			"imgs/Piece-0.png",
			 "imgs/Piece-1.png",
			 "imgs/Piece-2.png",
			 "imgs/Piece-3.png",
			 "imgs/Piece-4.png",
			 "imgs/Piece-5.png",
			 	
		],[
			"imgs/Piece-6.png",
			"imgs/Piece-7.png",
			 "imgs/Piece-8.png",
			 "imgs/Piece-9.png",
			 "imgs/Piece-10.png",
			 "imgs/Piece-11.png",
			 
		],[
			"imgs/Piece-12.png",
			 "imgs/Piece-13.png",
			 "imgs/Piece-14.png",
			 "imgs/Piece-15.png",
			 "imgs/Piece-16.png",
			 "imgs/Piece-17.png",
			 
		],[
			"imgs/Piece-18.png",
 			"imgs/Piece-19.png",
			 "imgs/Piece-20.png",
			 "imgs/Piece-21.png",
			 "imgs/Piece-22.png",
			 "imgs/Piece-23.png"
		]];
function game(){
	$(".wrap").empty();//清空游戏区域
	$(".wrap").html("<div class='gameArea'></div>");//为游戏区域添加内容
	$(document).unbind();//解除绑定事件
	var correct=0;//正确数量清零
	var gameArea=$(".gameArea");
	var rowc=87*0.347;//水平重叠区域
	var collc=103*0.347;//垂直重叠区域	
	var imgPos=[];
	//图片位置计算
	function addImg(_src,rowindex,colindex){//图片路径,图片编号.
		var img=new Image();//创建新图片
		img.src=_src;//为新图片添加链接
		$(img).addClass('canmoveimg');//为添加的图片添加属性
		
		var x,y,maxX,maxY;//xy为横纵坐标,maxXmaxY为图片所占最大横纵坐标
		if (rowindex==0) {//第几行
			y=0;
			if (colindex==0) {//第几列
				x=0;
				maxX=x+463*0.347;
				maxY=y+352*0.347;
			}else{
				x=463*0.347+(colindex-1)*480*0.347-colindex*rowc;//463为第一列拼图宽度,480为中间列拼图宽度
				if(colindex<5){
					maxX=x+480*0.347;
					maxY=y+352*0.347;
				}else{
					maxX=x+410*0.347;
					maxY=y+352*0.347;
				}
				

			}
		}else{
			y=352*0.347+(rowindex-1)*434*0.347-rowindex*collc;//352为第一行拼图高度,434为中间行拼图高度

			if (colindex==0) {
				x=0;
				maxX=x+463*0.347;
				if (rowindex==3) {
					maxY=y+415*0.347;
				}else{
					maxY=y+434*0.347;
				}
			}else{
				x=463*0.347+(colindex-1)*480*0.347-colindex*rowc;
				maxX=x+480*0.347;
				if(colindex<5){
					maxX=x+480*0.347;
				}else{
					maxX=x+410*0.347;
				}
				if (rowindex==3) {
					maxY=y+415*0.347;
				}else{
					maxY=y+434*0.347;
				}
			}
		}

		imgPos.push({"x":x,"y":y,"minX":x,"minY":y,"maxX":maxX,"maxY":maxY});//保存图片正确位置
		$(img).css({
			"width":(maxX-x)+"px",
			"height":(maxY-y)+"px"
		});
		$(".wrap").append(img);//把图片插入游戏区域
		
	}
	//循环添加拼图
	for (var i = 0; i < imgsSrc.length; i++) {//行		
		for (var z = 0; z < imgsSrc[i].length; z++) {//列
			addImg(imgsSrc[i][z],i,z);
		}
	}
	var moveImg=$(".canmoveimg");//获取所有碎片
	//初始化随机位置,将图片定位到右侧开始区域
	for (var i = 0; i < moveImg.length; i++) {
		moveImg.eq(i).css({
			"position":"absolute",
			"left":Math.floor(Math.random()*300*0.347+2360*0.347)+'px',
			"top":Math.floor(Math.random()*900*0.347)+'px',
			"z-index":30000*0.347+Math.floor(Math.random()*900*0.347)
		})
	}
	var flag=null,flagZ=-1;//flag为进入格子的标号,flagZ为拖动碎片的标号	
	var nowX=-1,nowY=-1;//保存当前鼠标位置
	//计算flag标号
	function calFlag(x,y){
		if (x<0||x>$(".gameArea").width()||y<0||y>$(".gameArea").height()) {
			return null;
		}else{
			for (var i = 0; i < imgPos.length; i++) {
				if(x>=imgPos[i].minX&&x<=imgPos[i].maxX&&y>=imgPos[i].minY&&y<=imgPos[i].maxY){
					break;
				}

			}
		}

		return i;
	}
	document.onmousedown=function(ev){
		var e=ev||window.event;
		if (e.preventDefault) {
			e.preventDefault();
		}else{
			e.returnValue=false;
		}
	}

	//鼠标拖动
	moveImg.mousedown(function(e){
	   	$(this).css("z-index","200000");//被点击的图片显示到最顶层
	    var x=e.clientX-$(e.target).offset().left;
	    var y=e.clientY-$(e.target).offset().top;
	    e.preventDefault();//阻止默认事件	   
	    flagZ=$(e.target).index()-1; 	    
	    document.onmousemove=function(ev){
	        nowX=ev.clientX-$(".game").offset().left;
	    	nowY=ev.clientY-$(".game").offset().top;
	    	var t = nowY-y;
       		var l = nowX-x;
	    	flag=calFlag(nowX,nowY);	    	
	        //开始移动
	        $(".canmoveimg").eq(flagZ).css({
	            left:l+'px',
	            top:t+'px'
	        }) 
	    }	    
	})
	//触摸拖动
	//已删除
	var liang=40000;
	//松开
	function mosup(){
		if (flag!=null) {//如果在某个格子上执行以下
			//当前拖拽碎片位置为当前格子位置
			moveImg.eq(flagZ).css({
		    	"left":imgPos[flag].x+"px",
		    	"top":imgPos[flag].y+"px"
		    });
		}
	     $(".canmoveimg").eq(flagZ).css("z-index",liang++);//保证放在相同位置的碎片后放的在先放的上面
	    
	     //下标相同正确,清除正确拼图相关事件
	     if (flagZ==flag) {
	    	correct++;//正确数量加一
	    	 $(".canmoveimg").eq(flagZ).off();
	    	 $(".canmoveimg").eq(flagZ).css("z-index",'10000');//正确位置的图片在最底层
	    	 setTimeout(function(){
	    	 	if (correct==24) {
			    	alert("完成");
			    }
	    	 },100);
	    }
	     flagZ=-1;
	   	 flag=null; 	
	    document.onmousemove=null;//清除移动事件
	    $(document).off();
	}
	//鼠标按键抬起
	$(document).mouseup(mosup);
	moveImg.mouseup(mosup);
}