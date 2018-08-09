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
                console.log(myJson);
                console.log(self.defaults.chartConfig)
                console.log(self.updateDom)

                // Fetch data from Spread sheet, and update the config.
                var numberArray = [];
                var labelArray  = [];
                for (var i = 0; i < myJson.length; i+=1) {
                    // numberArray.push(Math.floor(Math.random() * (100)));
                    const val = myJson[i]["status"] == 0 ? 1 : 0;
                    numberArray.push(val);
                    labelArray.push(myJson[i]["product_name"]);
                }

                // self.defaults.chartConfig.data.datasets[0].data = numberArray;

                self.chart.data.datasets[0].data = numberArray;
                self.chart.data.labels = labelArray;

                self.chart.options.title.text = "運命を変えよう";

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

        

        var p = document.createElement('p');
        p.innerHTML = 'テストテスト';

        // Append chart
        wrapperEl.appendChild(canvasWrapper);
        wrapperEl.appendChild(p);

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
