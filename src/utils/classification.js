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

// Calculate epsilon based on py
export function calculateEpsilon(py) {
  return Math.sqrt(275 / py);
}

// Classify flange based on b/T, and epsilon
export function classifyFlange(bT, Tflange, epsilon) {
  if (bT <= 9 * epsilon) return 'Plastic';
  if (bT <= 10 * epsilon) return 'Compact';
  if (bT <= 15 * epsilon) return 'Semi-Compact';
  return 'Slender';
}

// Calculate r1 = Fc / (d * tWeb * py)
export function calculateR1(Fc, d, tWeb, py) {
  let r1 = (1000 * Fc) / (d * tWeb * py);

  if (r1 <= -1) {
    r1 = -0.9999;  // or some value just greater than -1
  } else if (r1 > 1) {
    r1 = 1;
  }
  
  return r1;
}


// Calculate r2 = Fc / (A * py)
export function calculateR2(Fc, A, py) {
  return (10 * Fc) / (A * py);
}

// Classify web based on dt, r1, r2, and epsilon
export function classifyWeb(dt, r1, r2, epsilon) {
  const limit1 = 80 * epsilon / (1 + r1);
  const limit2 = r1 > 0 
    ? 100 * epsilon / (1 + 1.5 * r1)
    : 100 * epsilon / (1 + r1);
  const limit3 = 120 * epsilon / (1 + 2 * r2);
  const epsilon40 = 40 * epsilon;

  if (dt <= limit1 && dt <= epsilon40) {
    return 'Plastic';
  } else if (dt <= limit2 && dt <= epsilon40) {
    return 'Compact';
  } else if (dt <= limit3 && dt <= epsilon40) {
    return 'Semi-compact';
  } else {
    return 'Slender';
  }
}

// Classify section based on flange and web classifications
export function classifySection(flangeClassification, webClassification) {
    if (flangeClassification === webClassification) {
        return webClassification;
    } else if (webClassification === "Plastic" && flangeClassification !== webClassification) {
        return flangeClassification;
    } else if (webClassification === "Compact" && flangeClassification !== webClassification &&
        (flangeClassification === "Semi-compact" || flangeClassification === "Slender")) {
        return flangeClassification;
    } else if (webClassification === "Semi-compact" && flangeClassification === "Slender") {
        return flangeClassification;
    } else {
        return webClassification;
    }
}
