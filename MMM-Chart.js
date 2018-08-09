/* global Module */

/* Magic Mirror
 * Module: MMM-Chart
 *
 * By Evghenii Marinescu https://github.com/MarinescuEvghenii/
 * MIT Licensed.
 */

Module.register("MMM-Chart", {
    defaults: {
        width       : "200px",
        height      : "200px",
        chartConfig : {
            type: 'bar',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
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
			self.updateDom();
		}, 5000);
    },
    
    fetchData: function() {
        // Fetch data from Spread sheet, and update the config.
        var numberArray = [];
        for (var i = 0; i < 6; i+=1) {
            numberArray.push(Math.floor(Math.random() * (100)));
        }
        this.defaults.chartConfig.datasets[0].data = numberArray;
    },

	getDom: function() {
        // Create wrapper element
        const wrapperEl = document.createElement("div");
        // wrapperEl.setAttribute("style", "position: relative; display: block; width: 200; height: 200;");

        // Create chart canvas
        const chartEl  = document.createElement("canvas");
        chartEl.className += "pg";
        chartEl.id = "myChart"
        chartEl.width  = _config.width;
        chartEl.height = _config.height;
        chartEl.style.width  = _config.width;
        chartEl.style.height = _config.height;

        // Init chart.js
        this.chart = new Chart(chartEl.getContext("2d"), this.defaults.chartConfig);

        // Append chart
        wrapperEl.appendChild(chartEl);

		return wrapperEl;
	}
});
