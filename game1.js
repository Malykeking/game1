/*{{ javascript("jslib/draw2d.js") }}*/
/*{{ javascript("jslib/physics2ddevice.js") }}*/
/*{{ javascript("jslib/physics2ddebugdraw.js") }}*/
/*{{ javascript("jslib/boxtree.js") }}*/

TurbulenzEngine.onload = function onloadFn() {
	console.log("Game1 by FWirtz");
	console.log("Version 003_alpha (WIP)");
	var intervalID;
	var graphicsDevice = this.graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
	var mathDevice = this.mathDevice = TurbulenzEngine.createMathDevice({});
	var phys2D = this.phys2D = Physics2DDevice.create();

	var scale = this.scale = 30;
	var viewWidth = this.viewWidth = 1200 / scale;
	var viewHeight = this.viewHeight = 675 / scale;

	var draw2D = this.draw2D = Draw2D.create({
		graphicsDevice : graphicsDevice
	});
	var phys2DDebug = this.phys2DDebug = Physics2DDebugDraw.create({
		graphicsDevice : graphicsDevice
	});

	draw2D.configure({
		viewportRectangle : [0, 0, viewWidth, viewHeight],
		scaleMode : 'scale'
	});
	phys2DDebug.setPhysics2DViewport([0, 0, viewWidth, viewHeight]);

	//WORLD
	var world = this.world = phys2D.createWorld({
		gravity : [0, 20]
	});

	createObjects();

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

			while (world.simulatedTime < realTime) {
				world.step(1 / 60);
			}

			graphicsDevice.clear();

			phys2DDebug.setScreenViewport(draw2D.getScreenSpaceViewport());
			phys2DDebug.begin();
			phys2DDebug.drawWorld(world);
			phys2DDebug.end();

			graphicsDevice.endFrame();
		}
	}

	function createObjects() {
		var car = this.car = {
			position : [viewWidth / 2, viewHeight / 2]
		};
		car.shape1 = phys2D.createPolygonShape({
			vertices : [[0, 0], [0, -50 / scale], [25 / scale, -100 / scale], [75 / scale, -100 / scale], [125 / scale, -50 / scale]],
			group: 4,
			mask: 9
		});
		car.shape2 = phys2D.createPolygonShape({
			vertices : [[0, 0], [125 / scale, -50 / scale], [150 / scale, -50 / scale], [150 / scale, 0]],
			group: 4,
			mask: 9
		});
		car.wheel1 = phys2D.createCircleShape({
			radius : 25 / scale,
			origin : [0, 0],
			group: 4,
			mask: 9
		});
		car.wheel1_rB = phys2D.createRigidBody({
			type : 'dynamic',
			shapes : [car.wheel1],
			position : [(viewWidth / 2) + (25 / scale), viewHeight / 2]
		});
		car.wheel2 = phys2D.createCircleShape({
			radius : 25 / scale,
			origin : [0, 0],
			group: 4,
			mask: 9
		});
		car.wheel2_rB = phys2D.createRigidBody({
			type: 'dynamic',
			shapes: [car.wheel2],
			position: [(viewWidth/2) + (125 / scale) , viewHeight/2]
		});
		car.rigidBody = phys2D.createRigidBody({
			type : 'dynamic',
			shapes : [car.shape1, car.shape2],
			position : car.position
		});
		car.wConstraint1 = phys2D.createWeldConstraint({
			bodyA: car.rigidBody,
			bodyB: car.wheel1_rB,
			anchorA: [25/scale, 0],
			anchorB: [0, 0]
		});
		car.wConstraint2 = phys2D.createWeldConstraint({
			bodyA: car.rigidBody,
			bodyB: car.wheel2_rB,
			anchorA: [125/scale, 0],
			anchorB: [0, 0]
		});
		
		world.addRigidBody(car.rigidBody);
		world.addRigidBody(car.wheel1_rB);
		world.addRigidBody(car.wheel2_rB);
		world.addConstraint(car.wConstraint1);
		world.addConstraint(car.wConstraint2);
		console.log(car.shape1.computeCenterOfMass());
		console.log(car.shape2.computeCenterOfMass());

		var floor = this.floor = {
			width : viewWidth,
			height : 2,
			position : [viewWidth / 2, viewHeight]
		};
		floor.shape = phys2D.createPolygonShape({
			vertices : phys2D.createBoxVertices(floor.width, floor.height)
		});
		floor.rigidBody = phys2D.createRigidBody({
			type : 'static',
			shapes : [floor.shape],
			position : floor.position
		});
		world.addRigidBody(floor.rigidBody);
	}


	TurbulenzEngine.onunload = function gameOnunloadFn() {
		if (intervalID) {
			TurbulenzEngine.clearInterval(intervalID);
		}
		//Clear up the mess...!! :$
		md = null;
		gd = null;
	};

	TurbulenzEngine.onerror = function gameErrorFn(msg) {
		//print Errors

		window.alert(msg);
	};

	intervalID = TurbulenzEngine.setInterval(tick, 1000 / 60);
};
