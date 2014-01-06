/*{{ javascript("jslib/draw2d.js") }}*/
/*{{ javascript("jslib/physics2ddevice.js") }}*/
/*{{ javascript("jslib/physics2ddebugdraw.js") }}*/
/*{{ javascript("jslib/boxtree.js") }}*/

TurbulenzEngine.onload = function onloadFn() {
	console.log("Game1 by FWirtz");
	console.log("Version 004_alpha (WIP)");
	var intervalID;
	var graphicsDevice = this.graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
	var mathDevice = this.mathDevice = TurbulenzEngine.createMathDevice({});
	var phys2D = this.phys2D = Physics2DDevice.create();

	var vport = this.vport = {
		scale : 30,
		x : 0,
		y : 0,
		width : 1200 / 30,
		height : 675 / 30
	};

	var draw2D = this.draw2D = Draw2D.create({
		graphicsDevice : graphicsDevice
	});
	var phys2DDebug = this.phys2DDebug = Physics2DDebugDraw.create({
		graphicsDevice : graphicsDevice
	});

	draw2D.configure({
		viewportRectangle : [vport.x, vport.y, vport.width, vport.height],
		scaleMode : 'scale'
	});
	phys2DDebug.setPhysics2DViewport([vport.x, vport.y, vport.width, vport.height]);

	//WORLD
	var world = this.world = phys2D.createWorld({
		gravity : [0, 20]
	});

	createCar(); //TODO first create lvl, NEXT create car!!!
	
	var realTime = 0;
	var prevTime = TurbulenzEngine.time;
	
	var cTime = 1;

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

			//phys2DDebug.setScreenViewport(draw2D.getScreenSpaceViewport());
			
			// cTime++;
			// if(cTime % 100 === 0) {
				// vport.x++;
				// vport.width++;
			// }
			
			phys2DDebug.setPhysics2DViewport([vport.x, vport.y, vport.width, vport.height]);
			phys2DDebug.begin();
			phys2DDebug.drawWorld(world);
			phys2DDebug.end();

			graphicsDevice.endFrame();
		}
	}

	function createCar() {
		var car = this.car = {
			position : [vport.width / 2, vport.height / 2]
		};
		car.shape1 = phys2D.createPolygonShape({
			vertices : [[-75 / vport.scale, 0], [-50 / vport.scale, -50 / vport.scale], [0, -50 / vport.scale], [50 / vport.scale, 0]],
			group : 4,
			mask : 9
		});
		car.shape2 = phys2D.createPolygonShape({
			vertices : [[-75 / vport.scale, 0 / vport.scale], [75 / vport.scale, 0], [75 / vport.scale, 50 / vport.scale], [-75 / vport.scale, 50 / vport.scale]],
			group : 4,
			mask : 9
		});
		car.wheel1 = phys2D.createCircleShape({
			radius : 25 / vport.scale,
			origin : [0, 0],
			group : 4,
			mask : 9
		});
		car.wheel1_rB = phys2D.createRigidBody({
			type : 'dynamic',
			shapes : [car.wheel1],
			position : [(vport.width / 2) + (25 / vport.scale), vport.height / 2]
		});
		car.wheel2 = phys2D.createCircleShape({
			radius : 25 / vport.scale,
			origin : [0, 0],
			group : 4,
			mask : 9
		});
		car.wheel2_rB = phys2D.createRigidBody({
			type : 'dynamic',
			shapes : [car.wheel2],
			position : [(vport.width / 2) + (125 / vport.scale), vport.height / 2]
		});
		car.rigidBody = phys2D.createRigidBody({
			inertia : 5, //TODO inertia of 1000000 might be causing problems?!
			type : 'dynamic',
			shapes : [car.shape1, car.shape2],
			position : car.position
		});
		//car.rigidBody.alignWithOrigin();
		car.wConstraint1 = phys2D.createWeldConstraint({
			bodyA : car.rigidBody,
			bodyB : car.wheel1_rB,
			anchorA : [-45 / vport.scale, 50 / vport.scale],
			anchorB : [0, 0]
		});
		car.wConstraint2 = phys2D.createWeldConstraint({
			bodyA : car.rigidBody,
			bodyB : car.wheel2_rB,
			anchorA : [45 / vport.scale, 50 / vport.scale],
			anchorB : [0, 0]
		});
		
		
		
		world.addRigidBody(car.rigidBody);
		world.addRigidBody(car.wheel1_rB);
		world.addRigidBody(car.wheel2_rB);
		world.addConstraint(car.wConstraint1);
		world.addConstraint(car.wConstraint2);
		console.log(car.shape1.computeCenterOfMass());
		console.log(car.shape2.computeCenterOfMass());

		generateLevel(0); //TODO dont call this from here. just dont. trust me. you really dont want to do that. not kidding. change it NOW!
	}

	function generateLevel(type) {
		if (type === 1) {
			//create Random-Level
		} else {
			//create plane floor
			var floor = this.floor = {
				width : vport.width,
				height : 2,
				position : [vport.width / 2, vport.height]
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
	}


	TurbulenzEngine.onunload = function gameOnunloadFn() {
		if (intervalID) {
			TurbulenzEngine.clearInterval(intervalID);
		}
		//Aufraeumen!! :$
		md = null;
		gd = null;
		phys2D = null;
		draw2D = null;
		phys2DDebug = null;
		world = null;
	};

	TurbulenzEngine.onerror = function gameErrorFn(msg) {
		//Fehlermeldung ausgeben!

		window.alert(msg);
	};

	intervalID = TurbulenzEngine.setInterval(tick, 1000 / 60);
};
