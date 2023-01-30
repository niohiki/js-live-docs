// Shorthands
function forId(id) {
    return document.getElementById(id)
}

// Delay applying to divs if they are not yet loaded in the DOM
function whenAvailable(elementId, callback) {
    if (document.getElementById(elementId) != null) {
        callback()
    } else {
        onWindowLoadCallbacks.push(callback)
    }
}
onWindowLoadCallbacks = []
window.addEventListener('load', () => {
    onWindowLoadCallbacks.forEach(x => x())
})

// To read CSV files from an input element
function setupCSVLoader(inputElementId, processCallback) {
    whenAvailable(inputElementId, () => {
        forId(inputElementId).oninput = () => {
            let reader = new FileReader()
            reader.onload = (e) => processCallback(d3.csv.parse(e.target.result))
            reader.readAsText(forId(inputElementId).files[0])
        }
    })
}

// Plot creation utils
function addLinePlot(divId, lineNames) {
    addGenericScatterPlot(divId, 'lines', lineNames)
}


function addScatterPlot(divId, lineNames) {
    addGenericScatterPlot(divId, 'markers', lineNames)
}

function addGenericScatterPlot(divId, mode, lineNames) {
    whenAvailable(divId, () => {
        Plotly.newPlot(forId(divId), lineNames.map(name => (
            {type: 'scatter', mode: mode, name: name, x: [], y: []}
        )))
    })
}

function setPlotSliders(divId, sliders) {
    whenAvailable(divId, () => {
        Plotly.relayout(divId, {
            sliders: Object.entries(sliders).map(([name, steps], i) => ({
                name: name,
                steps: steps.map(i => ({
                    value: i,
                    label: i,
                    method: 'skip',
                    args: [],
                }))
            }))
        })
    })
}

// Plot editing utils
function updatePlotData(divId, xs, ys) {
    whenAvailable(divId, () => {
        Plotly.update(forId(divId), {
            'x': xs,
            'y': ys,
        })
    })
}

// Interaction callbacks
function buttonAction(inputId, callback) {
    whenAvailable(inputId, () => {
        forId(inputId).onclick = callback
    })
}

function sliderAction(divId, callback) {
    whenAvailable(divId, () => {
        forId(divId).on('plotly_sliderchange', callback)
    })
}

// Code editor
function runCodeEditor(iframeId, data, callback) {
    whenAvailable(iframeId, () => {
        forId(iframeId).contentWindow.postMessage(JSON.stringify({
            source: iframeId,
            data: data,
        }), '*')
        window.addEventListener('message', message => {
            let payload = JSON.parse(message.data)
            if (payload.source == iframeId) {
                callback(payload.result)
            }
        })
    })
}
