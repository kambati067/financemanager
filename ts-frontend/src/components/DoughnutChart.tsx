import React,{useState,useEffect} from 'react'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Colors,
    ArcElement,
  } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { off } from 'process';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  );
interface IPROPS{
    moneyData: any[]
    labels: any[]
}
let DoughnutChart:React.FC<IPROPS> = ({moneyData,labels}) => {
    let sum = 0;
    for(let i = 0; i<moneyData.length;i++){
        sum+=parseFloat(moneyData[i])
    }
    var pieData = {
        labels: labels,
          datasets: [{
            label: "$$",
            data: moneyData,
            backgroundColor: [
              'rgb(39, 174, 239)',
                'rgb(244, 106, 155)',
                'rgb(234, 85, 69)',
                'rgb(239, 155, 32)',
                'rgb(135, 188, 69)',
                'rgb(179, 61, 198)'
            ],
            hoverOffset: 4
          }]
    }
    const options ={
        responsive: true,
        maintainAspectRatio: false,
        plugins:{
            title:{
                display: true,
                text:"Distribution",
                font:{
                    size:20
                },
                color:"#1a53ff"
            },
            legend:{
                display:false
            },
            Tooltip:{
                enabled: false
            },
            datalabels:{
                formatter: (value:any,context:any) => {
                    if(value==0)
                    {
                        return '.'
                    }
                    const percentage = (value/sum *100).toFixed(1)
                    return percentage+'%'
                },
                font:{
                    size:15,
                },
                color:'white'
            }
        }
        //maintainAspectRatio: false 
    }

  return (
    
    
    <Doughnut
      data={pieData}
      options={options}
      plugins={[ChartDataLabels]}
    />

    

  )
}

export default DoughnutChart
