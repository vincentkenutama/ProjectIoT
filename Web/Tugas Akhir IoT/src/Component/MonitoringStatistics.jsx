import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export default function MonitoringStatistics({ namaData = 'Statistik', datas, dataKeys, replaceKeys, color = "#8884d8", date_filter = new Date().valueOf()}) {
  const [processedData, setProcessedData] = useState([]);
  const [statisticsData, setStatisticsData] = useState({ min: 0, max: 0, avg: 0 });

  const processData = (datas) => {
    let buff_data = [];
    let elements = [];
    let statistics = {
      min: 0,
      max: 0,
      avg: 0,
      now: 0
    };

    datas.forEach(element => {
      const processed = {};

      const date = new Date(element.created_at);
      const unix_time = date.valueOf();

      const date_day = date.getDate();
      const date_month = date.getMonth();
      const date_year = date.getFullYear();


      const date_hour = date.getHours();
      const date_minutes = date.getMinutes();
      const date_second = date.getSeconds();

      const setDate = `${date_hour}:${(date_minutes > 9) ? date_minutes : `0${date_minutes}`}:${(date_second > 9) ? date_second : `0${date_second}`}`;

      processed['name'] = setDate;
      const value = parseFloat(element[dataKeys]);
      processed[replaceKeys] = value;

    //   console.log(value == )

      if (!isNaN(value) && value) { 
        const filter_day = new Date(date_filter).getDate();
        const filter_month = new Date(date_filter).getMonth();
        const filter_year = new Date(date_filter).getFullYear();

        // console.log(date_day, filter_day)

        if(date_day == filter_day && date_month == filter_month && date_year == filter_year){
            elements.push(value);
            buff_data.push(processed);
        }
      }
    
    });

    statistics.min = Math.min(...elements);
    statistics.max = Math.max(...elements);
    statistics.avg = elements.reduce((sum, value) => sum + value, 0) / elements.length;
    
    statistics.now = elements[elements.length - 1]

    // console.log(statistics.now)
    
    // setProcessedData(buff_data)
    // setStatisticsData(statistics)

    return { buff_data, statistics };
  };

  const memoizedData = useMemo(() => processData(datas), [datas]);

  useEffect(() => {
    setProcessedData(memoizedData.buff_data);
    setStatisticsData(memoizedData.statistics);
  }, [memoizedData]);

  return (
    <div className='monitoring-statistics-card'>
      <span className='monitoring-statistics-title'>{namaData}</span>

      <LineChart
        width={450}
        height={350}
        data={processedData}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0
        }}
      >
        <CartesianGrid strokeDasharray="2 2" />
        <XAxis dataKey="name" angle={0} fontSize={12} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={replaceKeys}
          stroke={color}
          activeDot={{ r: 5 }}
        />
      </LineChart>

      <div className="monitoring-detailed-statistics">
        <div className="monitoring-stats">
          <span>{statisticsData.min}</span>
          <span className="monitoring-stats-placeholder">Min</span>
        </div>
        <div className="monitoring-stats">
          <span>{statisticsData.max}</span>
          <span className="monitoring-stats-placeholder">Max</span>
        </div>
        <div className="monitoring-stats">
          <span>{statisticsData.avg.toFixed(2)}</span>
          <span className="monitoring-stats-placeholder">Avg</span>
        </div>
        <div className="monitoring-stats">
          <span>{statisticsData.now}</span>
          <span className="monitoring-stats-placeholder">Now</span>
        </div>
      </div>
    </div>
  );
}
