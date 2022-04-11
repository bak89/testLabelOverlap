d3.select(window).on("resize", callFunction);
callFunction();

function callFunction() {
    let svgtest = d3.select("body").select("svg");
    if (!svgtest.empty()) {
        svgtest.remove();
    }

    let labels, links, label_array = [], anchor_array = [],
        dataset = [], //Initialize empty array
        margin = {top: 50, right: 50, bottom: 20, left: 50},
        width = window.innerWidth - margin.left - margin.right,
        height = window.innerHeight - margin.top - margin.bottom,
        xScale, yScale, rScale;

//Redraw label and lines with transition
    function redrawLabels() {
        labels
            .transition()
            .duration(1500)
            .attr("x", (d) => d.x)
            .attr("y", (d) => d.y);

        links
            .transition()
            .duration(1500)
            .attr("x2", (d) => d.x)
            .attr("y2", (d) => d.y);
    }

//Dynamic, random dataset
    const numDataPoints = 150;				//Number of dummy data points to create
    let xRange = Math.random() * 1000;	//Max range of new x values
    let yRange = Math.random() * 1000;	//Max range of new y values
    for (var i = 0; i < numDataPoints; i++) {					//Loop numDataPoints times
        var newNumber1 = Math.floor(Math.random() * xRange);	//New random integer
        var newNumber2 = Math.floor(Math.random() * yRange);	//New random integer
        dataset.push([newNumber1, newNumber2]);					//Add new number to array
    }

    var getRandomStr = function () {
        var randomStrLength = Math.floor(Math.random() * 10) + 5,
            pool = 'abcdefghijklmnopqrstuvwxyz1234567890',
            randomStr = '';

        var pl = pool.length
        for (var i = 0; i < randomStrLength; i++) {
            var randomChar = pool.substr(Math.floor(Math.random() * pl), 1);
            randomStr += randomChar;
        }

        return randomStr;
    }

//Create scale functions
    xScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, (d) => d[0])]) //input
        .range([margin.left, width - margin.right]); //output

    yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, (d) => d[1])])
        .range([height - margin.bottom, margin.top]);

    rScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, (d) => d[1])])
        .range([2, 20]);
    //console.log(dataset)

//Define X axis
    let xAxis = d3.axisBottom(xScale).ticks(5);

//Define Y axis
    let yAxis = d3.axisLeft(yScale).ticks(5);

//Create SVG element
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Draw boundaries of figure
    let plot_boundary = svg.append("rect")
        .attr("x", 0.0)
        .attr("y", 0.0)
        .attr("width", width)
        .attr("height", height)
        .style("fill-opacity", '0.0')
        .style("stroke", "black")
        .style("stroke-opacity", "0.4");

    svg.append("g").attr("transform", `translate( ${margin.left} , ${margin.top} )`);


//Create X axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxis);

//Create Y axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis);

//Create circles
    svg.selectAll("circle")
        .data(dataset)
        .join("circle")
        .attr("id", (d) => {
            var text = getRandomStr();
            var id = "point-" + text;
            var point = {x: xScale(d[0]), y: yScale(d[1])};
            var onFocus = function () {
                d3.select("#" + id)
                    .attr("stroke", "blue")
                    .attr("stroke-width", "2");
            };
            var onFocusLost = function () {
                d3.select("#" + id)
                    .attr("stroke", "none")
                    .attr("stroke-width", "0");
            };
            label_array.push({
                x: point.x,
                y: point.y,
                name: text,
                width: 0.0,
                height: 0.0,
                onFocus: onFocus,
                onFocusLost: onFocusLost
            });
            anchor_array.push({x: point.x, y: point.y, r: 10 * rScale(d[1])});
            return id;
        })
        .attr("fill", "green")
        .attr("opacity", 0.5)
        .attr("cx", (d) => xScale(d[0]))
        .attr("cy", (d) => yScale(d[1]))
        .attr("r", (d) => rScale(d[1]));

//Add labels
    //var labels = chartGroup.selectAll("text")
    labels = svg.selectAll('.label')
        .data(label_array)
        .join("text")
        .attr("class", "label")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .style("fill", "black")
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .text((d) => d.name);

    //Add height and width of label to array
    var index = 0;
    labels.each(function () {
        label_array[index].width = this.getBBox().width;
        label_array[index].height = this.getBBox().height;
        index += 1;
    });

    //Add links connecting label and circle
    links = svg.selectAll(".link")
        .data(label_array)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", (d) => d.x)
        .attr("y1", (d) => d.y)
        .attr("x2", (d) => d.x)
        .attr("y2", (d) => d.y)
        .attr("stroke-width", 0.2)
        .attr("stroke", "#6f6f6f");

    d3.labeler()
        .label(label_array)
        .anchor(anchor_array)
        .width(width)
        .height(height)
        .start(9000);


    redrawLabels();

}

