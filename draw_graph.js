function draw_graph(){
var dd = mapmap.datadata;

var map = mapmap('#chart')
    // layer 1: ARMY MOVEMENT
    .geometry(napoleon.army, {
        map: dd.map.key('group'),
        reduce: dd.emit.geo.segments()
    })
    .meta({
        'size': {
            label: "Troop Size",
            numberFormat: ',.0d',
            domain: [0,1000000],
            scale: 'linear',
            'stroke-width': [0, 100],
            undefinedLabel: null
        },
        'dir': {
            scale: 'ordinal',
            domain: [-1,1],
            'stroke': ['#000000', '#e5cbab'],
            undefinedSymbols: {
                'stroke': '#000000'
            }
        }
    })
    .hoverInfo('size')
    .attr('stroke-linecap', 'round')
    .symbolizeAttribute('size', 'stroke-width')
    .symbolizeAttribute('dir', 'stroke')
    // The anchorFunction "projects" any data to a point on the map
    .anchorFunction(lonAnchors)
    // layer 2: CITIES
    .geometry(napoleon.cities, {
        map: dd.map.geo.point('lat','lon')
    })
    .symbolize(mapmap.symbolize.addLabel('name', {
        dx: 7,
        'text-anchor': 'left'
    }))
;

createChart('elements', napoleon.temp, map);



function lonAnchors(obj) {
    // search data for given longitude, starting from end of journey
    for (var i=napoleon.army.length - 1; i>=0; i--) {
        var place = napoleon.army[i];
        if (place.lon == obj.lon) {
            return this.project([place.lon, place.lat]);
        }
    }
    return null;
}

function createChart(el, data, map) {

    var width = 800,
        height = 100;

    var y = d3.scale.linear()
        .range([height, 10]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
        
    el = d3.select('#' + el);
           
    y.domain(d3.extent(data, function(d) { return d.temp; }));
      
    var path = d3.svg.line()
        .x(function(d){
            return map.anchor(d)[0];
        })
        .y(function(d){ return y(d.temp); });
    
    el.append('path')
        .datum(data)
        .attr({
            'class': 'temp',
            fill: 'none',
            stroke: '#333',
            'stroke-width': '0.8'
        })
        .attr('d', path);
    
    el.selectAll('line.anchor')
        .data(data)
        .enter()
        .append('line')
        .attr({
            'class': 'anchor',
            x1:function(d){return map.anchor(d)[0]},
            y1:function(d){ return y(d.temp); },
            x2:function(d){return map.anchor(d)[0]},
            y2:0,
            fill: 'none',
            stroke: '#333',
            'stroke-width': '0.3'
        });
    
    d3.select('#chart g.fixed')
        .selectAll('line.anchor')
        .data(data)
        .enter()
        .append('line')
        .attr({
            'class': 'anchor',
            x1:function(d){return map.anchor(d)[0]},
            y1:function(d){ return map.anchor(d)[1]; },
            x2:function(d){return map.anchor(d)[0]},
            y2:400,
            fill: 'none',
            stroke: '#333',
            'stroke-width': '0.3'
        });    
}
}