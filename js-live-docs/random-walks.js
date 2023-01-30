function smoothingStep(xs) {
    let postValues = xs.slice(2)
    let midValues = xs.slice(1, xs.length - 1)
    let preValues = xs.slice(0, xs.length - 2)
    let averagedValues = preValues.map(
        (preValue, index) => 0.25 * preValue + 0.5 * midValues[index] + 0.25 * postValues[index]
    )
    return [xs[0]].concat(averagedValues).concat(xs[xs.length - 1])
}
function smoothing(xs, steps) {
    for (let step = 0; step < steps; step++) {
        xs = smoothingStep(xs)
    }
    return xs
}
