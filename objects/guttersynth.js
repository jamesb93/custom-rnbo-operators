@meta({
	alias: [ "gutter~" ],
	aliasonly: true,
    signalObject: true,
})
class guttersynth extends XAMObject {
    @attribute({ 
		state: true, 
		settable: true 
	}) dt: number = 0.03;

	@attribute({ 
		state: true, 
		settable: true 
	}) omega: number = 0.0002;

	@attribute({ 
		state: true, 
		settable: true 
	}) c: number = 0.01;

	@attribute({ 
		state: true, 
		settable: true 
	}) gamma: number = 0.2;

	@attribute({ 
		state: true, 
		settable: true 
	}) smoothing: number = 1.0;

	@attribute({ 
		state: true, 
		settable: true 
	}) filtering: boolean = true;

	@attribute({ 
		state: true, 
		settable: true 
	}) audio_input: boolean = false;

	@attribute({ 
		state: true, 
		settable: true 
	}) distortion: number = 0;

	@attribute({ 
		state: true, 
		settable: true 
	}) q: number = 20;

	@attribute({ 
		state: true, 
		settable: true 
	}) gain1: number = 0.03;

    @attribute({ 
		state: true, 
		settable: true 
	}) gain2: number = 0.03;

	@attribute({
		state: true,
		settable: true
	}) divergence: number = 0.1

	@attribute({
		state: true,
		settable: true
	}) freqscale: number = 1.0;

	@attribute reset : bang;
	@doAction reset() {
		this.prevent_blowup()
	}

	@option({ digest: "numfilters", min: 24 }) numfilters: int = 24;

	// STATE
	duff_x: number = 0.0
	duff_y: number = 0.0
	dx: number = 0.0
	dy: number = 0.0
	t: number = 0.0

	freqs: list = [];
	filterbank1 = new OperatorArray(options.numfilters, gutterbiquad());
	filterbank2 = new OperatorArray(options.numfilters, gutterbiquad());

	init() {
		this.freqs = [104.089138, 272.024144, 142.539412, 740.982354, 3231.109278, 598.49, 564.111226, 152.53849, 4773.62, 798.261719, 729.54452, 734.375425, 661.9, 133.461019, 1715.611503, 11658.962024, 6408.56104, 11775.302108, 857.528465, 2020.251582, 14168.220305, 192.176545, 326.557302, 4386.849042]
	}

	prevent_blowup() {
		this.duff_x = 0.0
		this.duff_y = 0.0
		this.dx = 0.0
		this.dy = 0.0
		this.t = 0.0

		for (let i=0; i < 24; i++) {
			this.filterbank1[i].reset()
			this.filterbank2[i].reset()
		}
	}

	reset() {
		this.prevent_blowup()
	}

	@inlet({ digest: "signal input" }) input: [signal, list];
	@doAction input(v: list) {
		this.freqs = v;
	}

	@outlet({ digest: "guttter synth output" }) output: signal;

	perform() {
		for (let i: Index = 0; i < n; i++) {
			// FILTER
			let final_y: number = 0;
			if (this.filtering) {
				for (let j: int = 0; j < 24; j++) {
					const res1 = this.filterbank1[j].next(this.duff_x * this.gain1, this.freqs[j] * this.freqscale, this.q);
					const res2 = this.filterbank2[j].next(this.duff_x * this.gain2, this.freqs[j] * this.freqscale + random(-this.divergence, this.divergence), this.q);
					final_y += res1;
					final_y += res2;
				}
			} else {
				final_y = this.duff_x
			}

			// DUFFING
			const input_factor: number = this.audio_input ? this.input_signal[i] : sin(this.omega * this.t);
			this.dy = final_y - (final_y*final_y*final_y) - (this.c * this.duff_y) + this.gamma * input_factor;

			this.duff_y += this.dy
			this.dx = this.duff_y
			this.duff_x = guttersmooth(final_y + this.dx, this.duff_x, this.smoothing+1)
			
			// DISTORTION
			if (this.filtering) {
				this.duff_x = gutterdistort(this.duff_x, this.distortion)
				this.output[i] = final_y * 0.125
			} else {
				this.duff_x = clip(this.duff_x, -100.0, 100.0)
				if (abs(this.duff_x) > 99.0) {
					this.prevent_blowup()
				}
				this.output[i] = clip(this.duff_x, -1, 1)
			}
			this.t += this.dt
		}
	}
}
