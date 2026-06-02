/**
 * Applies manual business rules to the base AI price.
 * @param {number} basePrice - The raw price returned by the Python AI
 * @param {object} propertyData - The full data object from the frontend
 */
function applyManualAdjustments(basePrice, propertyData) {
    let finalPrice = basePrice;
    const appliedAdjustments = []; 

    // --- RULE 1: Parking ---
    if (propertyData.parking === 'Underground') {
        finalPrice += 50000;
        appliedAdjustments.push({ factor: 'Underground parking', impact: '+50,000 PLN' });
    } else if (propertyData.parking === 'Outdoor') {
        finalPrice += 20000;
        appliedAdjustments.push({ factor: 'Outdoor parking', impact: '+20,000 PLN' });
    }

    // --- RULE 2: Balcony & Sun Orientation ---
    if (propertyData.balcony && propertyData.balcony !== 'None') {
        const orientation = propertyData.sunOrientation;
        let percentageBonus = 0.03; // Mixed/Default (3%)

        if (orientation === 'South') percentageBonus = 0.07;
        else if (['East', 'West'].includes(orientation)) percentageBonus = 0.05;
        else if (orientation === 'North') percentageBonus = 0.02;

        finalPrice += (basePrice * percentageBonus);
        appliedAdjustments.push({ 
            factor: `${propertyData.balcony} (${orientation || 'Mixed'}-facing)`, 
            impact: `+${(percentageBonus * 100).toFixed(1)}%` 
        });
    }

    // --- RULE 3: Floor & Elevator Penalty ---
    if (propertyData.elevator === 'No' && propertyData.floor > 2) {
        finalPrice -= (basePrice * 0.05); // 5% penalty
        appliedAdjustments.push({ factor: 'No elevator (Floor > 2)', impact: '-5.0%' });
    }

    return {
        finalPrice: Math.round(finalPrice),
        adjustments: appliedAdjustments
    };
}

module.exports = { applyManualAdjustments };