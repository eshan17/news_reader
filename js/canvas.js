var canvas = oCanvas.create({
	canvas: "#myCanvas",
	fps: 60
});

var button = canvas.display.rectangle({
	x: canvas.width / 2,
	y: canvas.width / 5,
	origin: { x: "center", y: "top" },
	width: 80,
	height: 40,
	fill: "linear-gradient(315deg, #079, #013)",
	join: "round",
	shadow: "0 0 20px rgba(0,0,0, 0.8)"
});

canvas.addChild(button);

var increase = true;
button.bind("click tap", function () {
	if (increase) {
		increase = false;

		this.stop().animate({
			x: canvas.width / 2,
			y: canvas.height / 1.5,
			height: 20,
			rotation: 180
		});
	} else {
		increase = true;

		this.stop().animate({
			x: canvas.width / 2,
			y: canvas.width / 5,
			height: 40,
			rotation: 0
		});
	}
});
