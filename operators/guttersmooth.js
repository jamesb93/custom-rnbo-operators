class guttersmooth extends Operator {
	dsponly = true
	compute(newval, oldval, factor): number {
		return (newval - oldval) * factor
	}
};