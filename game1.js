/*{{ javascript("jslib/draw2d.js") }}*/
/*{{ javascript("jslib/physics2ddevice.js") }}*/
/*{{ javascript("jslib/physics2ddebugdraw.js") }}*/
/*{{ javascript("jslib/boxtree.js") }}*/

TurbulenzEngine.onload = function onloadFn() {
	var intervalID;
	var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
	var mathDevice = TurbulenzEngine.createMathDevice({});

	var phys2D = Physics2DDevice.create();

	var viewWidth = this.viewWidth = 30;
	var viewHeight = this.viewHeight = 22;

	var draw2D = Draw2D.create({
		graphicsDevice : graphicsDevice
	});
	var phys2DDebug = Physics2DDebugDraw.create({
		graphicsDevice : graphicsDevice
	});

	draw2D.configure({
		viewportRectangle : [0, 0, viewWidth, viewHeight],
		scaleMode : 'scale'
	});
	phys2DDebug.setPhysics2DViewport([0, 0, viewWidth, viewHeight]);

	//WORLD
	var world = phys2D.createWorld({
		gravity : [0, 20]
	});

	var box = {
		width : 1,
		height : 1,
		position : [viewWidth / 2, viewHeight / 2]
	};
	box.shape = phys2D.createPolygonShape({
		vertices : phys2D.createBoxVertices(box.width, box.height)
	});
	box.rigidBody = phys2D.createRigidBody({
		type : 'dynamic',
		shapes : [box.shape],
		position : box.position
	});
	world.addRigidBody(box.rigidBody);

	var realTime = 0;
	var prevTime = TurbulenzEngine.time;

	function tick() {
		var curTime = TurbulenzEngine.time;
		var timeDelta = (curTime - prevTime);
		
		if (timeDelta > (1 / 20)) {
			timeDelta = (1 / 20);
		}

		realTime += timeDelta;
		prevTime = curTime;

		if (graphicsDevice.beginFrame()) {
			//RENDER HERE!!!

			while(world.simulatedTime < realTime) {
				world.step(1/60);
			}
			

			console.log("IT FUCKING RENDERED!!");

			phys2DDebug.setScreenViewport(draw2D.getScreenSpaceViewport());
			phys2DDebug.begin();
			phys2DDebug.drawWorld(world);
			phys2DDebug.end();

			graphicsDevice.endFrame();
		}
	}


	TurbulenzEngine.onunload = function gameOnunloadFn() {
		if (intervalID) {
			TurbulenzEngine.clearInterval(intervalID);
		}
		//Aufraeumen!! :$
		md = null;
		gd = null;
	};

	TurbulenzEngine.onerror = function gameErrorFn(msg) {
		//Fehlermeldung ausgeben!

		window.alert(msg);
	};

	intervalID = TurbulenzEngine.setInterval(tick, 1000 / 60);
};
