/* global Module */

/* Magic Mirror
 * Module: MMM-Chart
 *
 * By Evghenii Marinescu https://github.com/MarinescuEvghenii/
 * MIT Licensed.
 */

Module.register("MMM-Chart", {
    defaults: {
        width       : "600px",
        height      : "300px",
        chartConfig : {
            type: 'bar',
            data: {
                labels: ["", "", "", ""],
                datasets: [{
                    data: [0,0,0,0],
                    backgroundColor: [
                        'rgba(255, 255, 255, 1.0)',
                        'rgba(255, 255, 255, 1.0)',
                        'rgba(255, 255, 255, 1.0)',
                        'rgba(255, 255, 255, 1.0)'
                    ],
                    borderColor: [
                        'rgba(255, 255, 255, 1.0)',
                        'rgba(255, 255, 255, 1.0)',
                        'rgba(255, 255, 255, 1.0)',
                        'rgba(255, 255, 255, 1.0)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Custom Chart Title',
                    fontColor: "#FFF",
                    fontSize: 45,
                    padding: 40,
                    position: "bottom"
                },
                defaults: {
                    barPercentage: 0.6,
                    categoryPercentage: 0.6
                },
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false,
                            display: false,
                            min: 0,
                            max: 1,
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: 25,
                            fontColor: '#FFF',
                            fontFamily: "メイリオ, Meiryo, sans-serif"
                        }
                    }]
                }
            }
        }
    },

    getScripts: function() {
		return ["modules/" + this.name + "/node_modules/chart.js/dist/Chart.bundle.min.js"];
    },
    
    // Define styles.
	getStyles: function() {
		return ["./mmm_chart.css"];
	},

	start: function() {
        this.config = Object.assign({}, this.defaults, this.config);
        Log.info("Starting module: " + this.name);
        
        // Schedule update interval.
		var self = this;
		setInterval(function() {
            self.fetchData();
        }, 0.5 * 1000);
    },
    
    fetchData: function() {
        
        var self = this;
        fetch('https://script.google.com/macros/s/AKfycbwAsbAMX3LiBGL3mKWacPCutAFmSu518nwftRt3Una1a9qDxNm7/exec?action=latest')
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {

                // Fetch data from Spread sheet, and update the config.
                var numberArray = [];
                var labelArray  = [];
                var chartTitle  = "運命を変えよう";
                for (var i = 0; i < myJson.length; i+=1) {
                    // numberArray.push(Math.floor(Math.random() * (100)));
                    const val = myJson[i]["status"] == 0 ? 1 : 0;
                    if (myJson[i]["status"] == 0) {
                        chartTitle= myJson[i]["ads"];
                    }
                    numberArray.push(val);
                    labelArray.push(myJson[i]["product_name"]);
                }

                self.chart.data.datasets[0].data = numberArray;
                self.chart.data.labels = labelArray;

                self.chart.options.title.text = chartTitle;
                
                // self.ad_img.src = "http://pgsaiyo.com/plant/shiga/images/shiga_vi.jpg";

                self.addWrapper.innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/wq1bZ-UP6oI" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
                // self.updateDom();
                self.chart.update();
            });        
    },

	getDom: function() {
        // Create wrapper element
        const wrapperEl = document.createElement("div");
        // wrapperEl.setAttribute("style", "position: relative; display: block; width: 200; height: 200;");

        const canvasWrapper = document.createElement("div");

        // Create chart canvas
        const chartEl  = document.createElement("canvas");
        chartEl.id = "chart1"
        const w = "600px";
        const h = "300px";
        chartEl.width  = w;
        chartEl.height = h;
        chartEl.style.width  = w;
        chartEl.style.height = h;

        // Init chart.js
        this.chart = new Chart(chartEl.getContext("2d"), this.defaults.chartConfig);

        canvasWrapper.appendChild(chartEl);


        // <img border="0" src="../images/img001.gif" width="128" height="128" alt="イラスト1">
        const addWrapper = document.createElement("div");
        // var img = document.createElement('img');
        // img.src = 'http://www.industrysourcing.com/sites/default/files/skii.jpg';
        // img.style.width = '60%'
        // img.style.height = 'auto'
        // img.style.setProperty("-webkit-transition", "all .3s ease-in-out");
        // img.style.setProperty("-moz-transition", "all .3s ease-in-out");
        // img.style.setProperty("transition", "all .3s ease-in-out");

        // this.ad_img = img;

        addWrapper.innerHTML = '<img src="http://www.industrysourcing.com/sites/default/files/skii.jpg" width="60%" height="auto"></img>';

        this.addWrapper = addWrapper;

        // Append chart
        wrapperEl.appendChild(canvasWrapper);
        wrapperEl.appendChild(addWrapper);

        // wrapperEl.appendChild(p);

        // // Create chart canvas
        // const chartEl_count  = document.createElement("canvas");
        // chartEl_count.id = "chart_count"
        // const w = "600px";
        // const h = "300px";
        // chartEl_count.width  = w;
        // chartEl_count.height = h;
        // chartEl_count.style.width  = w;
        // chartEl_count.style.height = h;

        // // Init chart.js
        // this.chart_count = new Chart(chartEl_count.getContext("2d"), this.defaults.chartConfig);

        // // Append chart
        // wrapperEl.appendChild(chartEl_count);

		return wrapperEl;
	}
});
