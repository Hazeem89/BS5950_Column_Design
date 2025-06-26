import React, { useEffect } from 'react';
import { useDesign } from '../../context/DesignContext';
import { calculateSlendernessRatio, calculateEffectiveLength, calculatePy, calculateCompressionResistance, calculateBucklingResistanceMoment, calculateEquivalentSlenderness } from '../../utils/calculations';

const OverallBucklingCheck = () => {
    const {
        designInputs: { Fc, grade, Mx, My, L },
        selectedSection,
        classificationResults,
        bucklingResults,
        setBucklingResults,
        pcLookupResult: pc,
        PbLookupResult: Pb,  
    } = useDesign();

    useEffect(() => {
        if (
            !selectedSection ||
            !Fc || isNaN(Number(Fc)) ||
            !Mx || isNaN(Number(Mx)) ||
            !My || isNaN(Number(My)) ||
            !L || isNaN(Number(L)) ||
            !grade || isNaN(Number(grade))
        ) {
            setBucklingResults(null);
            return;
        }

        const {
            Tflange,
            A,
            ry,
            Sy,
            Zx,
            Zy,
        } = selectedSection;

        const sectionClass = classificationResults?.flangeClass || 'Plastic'; // fallback if not defined
        const py = calculatePy(Number(grade), Number(Tflange));
        const LE = calculateEffectiveLength(Number(L));
        const λ = calculateSlendernessRatio(Number(LE), Number(ry));
        const Pc = calculateCompressionResistance(sectionClass, Number(pc), Number(A));
        const λLT = calculateEquivalentSlenderness(Number(L), Number(ry));
        const Mbs = calculateBucklingResistanceMoment(sectionClass, Number(Pb), Number(Sy), Number(Zx));
        const OverallBucklingCheck = (Fc * 10 / Pc) + (Mx / Mbs) + (My / (py  *  Zy)); // Overall buckling check BS5950:2000 Clause 4.7.7

        setBucklingResults({
            py,
            LE,
            λ,
            Pc,
            λLT,
            Mbs,
            OverallBucklingCheck,
        });

    }, [selectedSection, Fc, grade, Mx, My, L, setBucklingResults]);
    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Overall Buckling Check Results</h2>
            {bucklingResults ? (
                <div>
                    <p><strong>Design Strength (py):</strong> {bucklingResults.py.toFixed(2)} MPa</p>
                    <p><strong>Effective Length (LE):</strong> {bucklingResults.LE.toFixed(2)} m</p>
                    <p><strong>Slenderness Ratio (λ):</strong> {bucklingResults.λ.toFixed(2)}</p>
                    <p><strong>Compression resistance (Pc):</strong> {bucklingResults.Pc.toFixed(2)}</p>
                    <p><strong>Equivalent Slenderness (λLT):</strong> {bucklingResults.λLT.toFixed(2)}</p>
                    <p><strong>Buckling Resistance Moment (Mbs):</strong> {bucklingResults.Mbs.toFixed(2)} kNm</p>
                    <p><strong>Overall Buckling Check:</strong> {bucklingResults.OverallBucklingCheck.toFixed(2)}</p>

                </div>
            ) : (
                <p className="text-red-500">No results available. Please check your inputs.</p>
            )}
        </div>
    );  
}
export default OverallBucklingCheck;