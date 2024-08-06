/* eslint-disable @typescript-eslint/no-unused-vars */
import HighChartFunnel from "./HighChartFunnel";
import "../css/chart.style.css"; // Import your CSS file

interface IConversionRateProps {
  vc_atc_Rate: string;
  atc_ic_Rate: string;
  ic_pur_Rate: string;
}

const FunnelChartEvents = (props: IConversionRateProps) => {
  const vc_atc_Rate = props.vc_atc_Rate;
  const atc_ic_Rate = props.atc_ic_Rate;
  const ic_pur_Rate = props.ic_pur_Rate;

  // Prepare data for Highcharts
  const chartData = [
    {
      y: +vc_atc_Rate,
      name: "VC>ATC",
      color: "#3333ff",
    },
    {
      y: +atc_ic_Rate,
      name: "ATC>IC",
      color: "#ff0000",
    },
    {
      y: +ic_pur_Rate,
      name: "IC>PUR",
      color: "#ff66ff",
    },
  ];

  const options = {
    chart: {
      type: "funnel",
    },
    legend: {
      enabled: false,
    },
    title: {
      text: "Conversion rate funnel",
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format:
            "<div style={{marginBottom: 5}}><b >{point.name}</b></br> {point.y:,.2f} %</div> ",
          softConnector: true,
        },
        center: ["40%", "50%"],
        neckWidth: "30%",
        neckHeight: "25%",
        width: "70%",
      },
    },
    series: [
      {
        name: "conversion rate",
        data: chartData,
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            plotOptions: {
              series: {
                dataLabels: {
                  inside: true,
                },
                center: ["50%", "50%"],
                width: "100%",
              },
            },
          },
        },
      ],
    },
  };

  return (
    <div className="" >
      <HighChartFunnel options={options} />
      <div className="flex justify-center w-full h-[88px]">
        <div className="flex gap-4">
          <div className="flex justify-start items-center">
            <div className="w-[8px] h-[8px] bg-[#3333ff] mr-2" />
            <div className="">{"VC>ATC"}</div>
          </div>
          <div className="flex justify-start items-center">
            <div className="w-[8px] h-[8px] bg-[#ff0000] mr-2" />
            <div className="">{"ATC>IC"}</div>
          </div>
          <div className="flex justify-start items-center">
            <div className="w-[8px] h-[8px] bg-[#ff66ff] mr-2" />
            <div className="">{"IC>PUR"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelChartEvents;
