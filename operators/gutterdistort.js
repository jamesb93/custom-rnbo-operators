class gutterdistort extends Operator {
	dsponly = true;

	compute(x, type): number {
		switch (type) {
			case 0:
				return clip(x, -1, 1)
			case 1:
				 return 1.0 / atan(3) * atan(x * 3)
			case 2:
				return atan(x)
			case 3:
				return 0.75 * (sqrt(((x * 1.3) * (x * 1.3) + 1.0)) * 1.65 - 1.65) / x
			case 4:
				return (0.1076 * x * x * x + 3.029 * x) / (x * x + 3.124) 
			default:
				return x
		}
	}
};