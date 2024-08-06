/* eslint-disable @typescript-eslint/no-unused-vars */
import HighchartsChart from "./HighchartsChart";
import "../css/chart.style.css"; // Import your CSS file
import { generateDateArray, generateHourArray, generatechartData, generatechartDataDay, isMoreThanNDaysApart } from "~/utils";

interface IEventMap {
  value: string;
  label: string;
}

interface IEventDataProps {
  data: any;
  eventNameMap: IEventMap[];
  fromDate: string;
  toDate: string;
  eventsSearch:string[];
}

const LineChartPageAnalytic = (props: IEventDataProps) => {
  const data = props.data;
  const eventNameMap = props.eventNameMap;
  const {fromDate,toDate} = props;
  var categoryData = [];
  var chartData = [];
  if(isMoreThanNDaysApart(fromDate, toDate, 1)){
    let interval = 1;
    if(isMoreThanNDaysApart(fromDate, toDate, 20)){
      interval = 2;
      if(isMoreThanNDaysApart(fromDate, toDate, 60)){
        interval = 3;
        if(isMoreThanNDaysApart(fromDate, toDate, 80)){
          interval = 4;
        }
        else{
          interval = 10;
        }
      }
    }   
    categoryData =  generateDateArray(new Date(fromDate), new Date(toDate), interval);
    chartData = generatechartDataDay(eventNameMap, data, fromDate, toDate, interval, 'day',categoryData, props.eventsSearch)
  }
  else{
    categoryData = generateHourArray(new Date(fromDate));
    chartData = generatechartData(eventNameMap, data, fromDate, toDate, 1, 'hour')
  }

  const options = {
    chart: {
      type: "spline",
    },
    legend: {
      symbolWidth: 40,
    },
    title: {
      text: "",
      align: "left",
    },
    xAxis: {
      type: "datetime",          
      categories: categoryData,
    },
    yAxis: {
      title: {
        text: "Total",
      },
      accessibility: {
        description: "Total",
      },
    },
    tooltip: {
      valueSuffix: "",
      stickOnContact: true,
      shared: true,
    },
    series: chartData,

    plotOptions: {
      series: {
        marker: {
          symbol: "circle",
          fillColor: "#FFFFFF",
          enabled: true,
          radius: 2.5,
          lineWidth: 1,
          lineColor: null,
        },
      },
    },

    colors: ["#ff9933", "#66ffff", "#3333ff", "#ff0000", "#ff66ff", "#ffff33", "#00ff00"],

    // Define the data points. All series have a year of 1970/71 in order
    // to be compared on the same x axis. Note that in JavaScript, months start
    // at 0 for January, 1 for February etc.
  };

  return (
    <div>
      <HighchartsChart options={options} />
    </div>
  );
};

export default LineChartPageAnalytic;
