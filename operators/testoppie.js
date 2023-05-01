class testoppie extends StatefulOperator
{
	dsponly = true;
	digest = "Two-pole, two-zero filter";

	x1 : number = 0;
	x2 : number = 0;
	y1 : number = 0;
	y2 : number = 0;

	next(x : number, a0 : number, a1 : number, a2 : number, b1 : number, b2 : number) : number
	{
		var tmp = x * a0 + this.x1 * a1 + this.x2 * a2 - (this.y1 * b1 + this.y2 *b2);

		this.x2 = this.x1;
		this.x1 = x;
		this.y2 = this.y1;
		this.y1 = tmp;

		return tmp;
	};

	@meta({ public : true })
	clear() {
		this.reset();
	}

	reset() {
		this.x1 = 0;
		this.x2 = 0;
		this.y1 = 0;
		this.y2 = 0;
	}

	dspsetup() {
		this.reset();
	}
};
