import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const HighchartsChart = ({ options }:any) => {

  return <HighchartsReact
    highcharts={Highcharts}
    options={options}
  />
};

export default HighchartsChart;
