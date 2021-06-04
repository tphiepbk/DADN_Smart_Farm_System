var ctx = document.getElementById("chart");
// var myChart = new Chart(ctx, {
//   type: 'bar',
//   data: {
//     labels: ["Light", "Water Pumb"],
//     datasets: [{
//       label: '# Usage hours',
//       data: [12, 19],
//       backgroundColor: [
//         'rgba(255, 255, 0, 0.2)',
//         'rgba(54, 162, 235, 0.2)',

//       ],
//       borderColor: [
//         'rgba(255,255,0,1)',
//         'rgba(54, 162, 235, 1)'
//       ],
//       borderWidth: 1
//     }]
//   },
//   options: {
//     responsive: false,
//     scales: {
//       xAxes: [{
//         ticks: {
//           maxRotation: 90,
//           minRotation: 80
//         },
//           gridLines: {
//           offsetGridLines: true // à rajouter
//         }, 
//       },
//       {
//         position: "top",
//         ticks: {
//           maxRotation: 90,
//           minRotation: 80
//         },
//         gridLines: {
//           offsetGridLines: true // et matcher pareil ici
//         }
//       }],
//       yAxes: [{
//         ticks: {
//           beginAtZero: true
//         }
//       }]
//     }
//   }
// });

var barChartData = {
  labels: ["Usage hours"],
  datasets: [{
    type: 'bar',
    label: 'light',
    id: "y-axis-0",
    backgroundColor: 'rgba(255, 255, 0, 0.2)',
    borderColor: 'rgba(255,255,0,1)',
    data: [12]
  }, {
    type: 'bar',
    label: 'Water Pumb',
    id: "y-axis-0",
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgba(54, 162, 235, 1)',
    data: [6]
  },]
};

var myChart = new Chart(ctx, {
  type: 'bar',
  data: barChartData,
  options: {
    title: {
      display: true,
      text: "Chart.js Bar Chart - Stacked"
    },
    tooltips: {
      mode: 'label'
    },
    responsive: true,
    scales: {
      xAxes: [{
        stacked: true,
        barThickness: 18
      }],
      yAxes: [{
        stacked: true,
        position: "left",
        id: "y-axis-0",
      }]
    }
  }
});

