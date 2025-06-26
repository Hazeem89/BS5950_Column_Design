// Calculate design strength py based on grade and flange thickness Tflange
export function calculatePy(grade, Tflange) {
  let py = grade; // default

  if (grade === 275) {
    if (Tflange <= 16) py = grade;
    else if (Tflange <= 40) py = grade - 10;
    else if (Tflange <= 63) py = grade - 20;
    else if (Tflange <= 80) py = grade - 30;
    else if (Tflange <= 100) py = grade - 40;
    else if (Tflange <= 150) py = grade - 50;
  } else if (grade === 355) {
    if (Tflange <= 16) py = grade;
    else if (Tflange <= 40) py = grade - 10;
    else if (Tflange <= 63) py = grade - 20;
    else if (Tflange <= 80) py = grade - 30;
    else if (Tflange <= 100) py = grade - 40;
    else if (Tflange <= 150) py = grade - 60;
  } else if (grade === 460) {
    if (Tflange <= 16) py = grade;
    else if (Tflange <= 40) py = grade - 20;
    else if (Tflange <= 63) py = grade - 30;
    else if (Tflange <= 80) py = grade - 50;
    else if (Tflange <= 100) py = grade - 60;
  }

  return py;
}


//Claculate the moment capacity about the major axis Mcx based on py and Sx and not exceed 1.2pyZx.
export function calculateMcx(sectionClass, py, Sx, Zx) {
  if (sectionClass === 'Plastic' || sectionClass === 'Compact') {
    console.log('Calculating Mcx for Plastic or Compact section');
    const Mcx = (py * Sx / 1000);
    return Math.min(Mcx, (1.2 * py * Zx / 1000));
  } 
  else if (sectionClass === 'Semi-Compact') {
    console.log('Calculating Mcx for Semi-Compact section');
    const Mcx = (py * Zx / 1000);
    return Math.min(Mcx, (1.2 * py * Zx / 1000));
  } 
  else if (sectionClass === 'Slender') {
    console.log('Calculating Mcx for Slender section - using effective section modulus Zxeff NOT Programmed YET');
    return 'Mcx = py * Zxeff';
  }
}


//Claculate the moment capacity about the minor axis Mcy based on py and Sy and not exceed 1.2pyZy.

export function calculateMcy(sectionClass, py, Sy, Zy) {
  if (sectionClass === 'Plastic' || sectionClass === 'Compact') {
    console.log('Calculating Mcy for Plastic or Compact section');
    const Mcy = (py * Sy / 1000);
    return Math.min(Mcy, 1.2 * py * Zy / 1000);
  } 
  else if (sectionClass === 'Semi-Compact') {
    const Mcy = (py * Zy / 1000);
    return Math.min(Mcy, 1.2 * py * Zy / 1000);
  } 
  else if (sectionClass === 'Slender') {
    console.log('Calculating Mcy for Slender section - using effective section modulus Zyeff NOT Programmed YET');
    return 'Mcy = py * Zyeff';
  }
}

// Calculate the effective length LE

export function calculateEffectiveLength(L) {
  const LE = L * 0.85; 
  return LE;
}


// Calculate the slenderness ratio λ based on effective length LE and radius of gyration r
export function calculateSlendernessRatio(LE, ry) {
  if (ry <= 0) {
    throw new Error("Radius of gyration must be greater than zero.");
  }
  const lambda = LE * 100 / ry;
  return lambda;
}

//Calculate Compression resistance Pc = pc * A
export function calculateCompressionResistance(sectionClass, pc, A) {
  if (sectionClass === 'Plastic' || 
    sectionClass === 'Compact' || 
    sectionClass === 'Semi-Compact') {    
  const Pc = pc * A / 10;
  return Pc;
}
  return ('Calculations involving slender sections are not handled by this application! Please use a more advanced structural analysis tool.');
}

//Calculate Equivalent slenderness (lateral-torsional buckling) λLT (lambda) = 0.5*L / ry
export function calculateEquivalentSlenderness(L, ry) {
  if (ry <= 0) {
    throw new Error("Radius of gyration must be greater than zero.");
  }
  const lambdaLT = 0.5 * L * 100 / ry;
  return lambdaLT;
}

//calculate the buckling resistance moment for simple columns Mbs 
export function calculateBucklingResistanceMoment(sectionClass, Pb, Sx, Zx) {
  if (sectionClass === 'Plastic' || sectionClass === 'Compact') {
    console.log('Calculating Mbs for Plastic or Compact section');
    const Mbs = Pb * Sx / 1000;
    return Mbs;
  } else if (sectionClass === 'Semi-Compact') {
    console.log('Calculating Mbs for Semi-Compact section');
    const Mbs = Pb * Zx / 1000;
    return Mbs;
  } else if (sectionClass === 'Slender') {
    console.log('Calculating Mbs for Slender section - using effective section modulus Zxeff NOT Programmed YET');
    return ('Calculations involving slender sections are not handled by this application! Please use a more advanced structural analysis tool.');
  }
}

