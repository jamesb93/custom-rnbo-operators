class gutterbiquad extends StatefulOperator 
{
	dsponly = true;
	digest = "A biquad filter for gutter synth"

	x1: number = 0;
	x2: number = 0;
	y1: number = 0;
	y2: number = 0;
	a0: number = 0;
	a1: number = 0;
	a2: number = 0;
	b1: number = 0;
	b2: number = 0;

	next(x: number, freq: number, q: number): number {
		let k = fasttan(PI * freq / samplerate())
		let norm = 1.0 / (1.0 + k / q + k * k)

		let a0 = k / q * norm
		let a1 = 0.0
		let a2 = -1 * this.a1
		let b1 = 2.0 * (k * k - 1) * norm
		let b2 = (1.0 - k / q + k * k) * norm

		let tmp = x * a0 + this.x1 * a1 + this.x2 * a2 - (this.y1 * b1 + this.y2 * b2);

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
