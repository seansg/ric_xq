export const options = {
  indexAxis: 'y',
  scales: {
    x: {
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value, index, ticks) {
          return value + '%';
        },
        font: {
          weight: 'bold',
          size: 24
        }
      }
    },
    y: {
      ticks: {
        font: {
          weight: 'bold',
          size: 24
        }
      }
    }
  },
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        font: {
          size: 24
        }
      }
    },
  },
};
