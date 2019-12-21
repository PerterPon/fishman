function calculateFacing(nowPoint, targetPoint) {
    const cycleNumber = Math.atan2(nowPoint.y - targetPoint.y, nowPoint.x - targetPoint.x) * 180 / Math.PI;
    // console.log(cycleNumber * 180 / Math.PI);
    let finalAngle = 0;
    console.log(cycleNumber);
    if (0 > cycleNumber && -90 < cycleNumber) {
      finalAngle = 360 - (cycleNumber + 90);
    } else if (-90 > cycleNumber && -180 <= cycleNumber) {
      finalAngle = -1 * (cycleNumber + 90);
    } else if (0 <= cycleNumber && 90 > cycleNumber) {
      finalAngle = 360 - (cycleNumber + 90);
    } else if (90 < cycleNumber && 180 >= cycleNumber) {
      finalAngle = 180 - (cycleNumber - 90);
    }
    return finalAngle / 360 * 6268;
  }

console.log(calculateFacing({
    x: 3120,
    y: 6160
}, {
    x: 3608,
    y: 5863
}));

