import React,{useState,useEffect, useRef} from 'react'
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
    ChartTypeRegistry,
    Chart,
  } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { borderColor } from '@mui/system';

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
    currMonth: Number
    prevMonth: Number
    pMonth: Number
    aMoneyData: any[]
    bMoneyData: any[]
    cMoneyData: any[]
}
let HorizontalBarChart:React.FC<IPROPS> = ({currMonth,prevMonth,pMonth,aMoneyData,bMoneyData,cMoneyData}) => {
  console.log(aMoneyData)  
  const[borderColor,setBorderColor]=useState(['rgb(244, 106, 155)',
    'rgb(234, 85, 69)',
    'rgb(239, 155, 32)',
    'rgb(39, 174, 239)',
    'rgb(135, 188, 69)',
    'rgb(179, 61, 198)'])
    const[backgroundColor, setBackgroundColor] = useState(['rgb(244, 106, 155)',
    'rgb(234, 85, 69)',
    'rgb(239, 155, 32)',
    'rgb(39, 174, 239)',
    'rgb(135, 188, 69)',
    'rgb(179, 61, 198)'])
    const arbitraryStackKey = "stack1";
    /*const data = {
        labels: ['a', 'b', 'c', 'd', 'e'],
        datasets: [
          // These two will be in the same stack.
          {
            stack: arbitraryStackKey,
            label: 'data1',
            data: [1, 2, 3, 4, 5]
          },
          {
            stack: arbitraryStackKey,
            label: 'data2',
            data: [5, 4, 3, 2, 1]   
          }
        ]
      }*/
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "July", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
      var data =  {
        labels: [monthNames[pMonth.valueOf()-1], monthNames[prevMonth.valueOf()-1], monthNames[currMonth.valueOf()-1]], // responsible for how many bars are gonna show on the chart
        // create 12 datasets, since we have 12 items
        // data[0] = labels[0] (data for first bar - 'Standing costs') | data[1] = labels[1] (data for second bar - 'Running costs')
        // put 0, if there is no data for the particular bar
        datasets: [{
           label: 'Food/Drinks',
           data: [cMoneyData[0], bMoneyData[0],aMoneyData[0]],
           backgroundColor: 'rgb(39, 174, 239)'
        }, {
          label: 'Other',
          data: [cMoneyData[1], bMoneyData[1],aMoneyData[1]],
          backgroundColor: 'rgb(244, 106, 155)'
       }, {
        label: 'Recreation',
        data: [cMoneyData[2], bMoneyData[2],aMoneyData[2]],
        backgroundColor: 'rgb(234, 85, 69)'
     },{
           label: 'Service/Utility',
           data: [cMoneyData[3], bMoneyData[3],aMoneyData[3]],
           backgroundColor: 'rgb(239, 155, 32)'
        },  {
           label: 'Shopping',
           data: [cMoneyData[4], bMoneyData[4],aMoneyData[4]],
           backgroundColor: 'rgb(135, 188, 69)'
        }, {
           label: 'Travel',
           data: [cMoneyData[5], bMoneyData[5],aMoneyData[5]],
           backgroundColor: 'rgb(179, 61, 198)'
        }]
     }
    const options = {
        plugins: {
          title: {
            display: true,
            text: 'Monthly Totals',
            font:{
                size:20
            },
            color:"#1a53ff"
          },
          legend:{
            display:false,
          },
          datalabels: {
            display: true,
            color: "#1a53ff",
            font:{
                size:15,
                weight: 'bold' as const
            },
            formatter:(value: any,context:any)=>{
                const datasetArray: string[] = []
                context.chart.data.datasets.forEach((dataset:any)=>{
          
                  if(dataset.data[context.dataIndex] != undefined){
                    datasetArray.push(dataset.data[context.dataIndex])
                  }
                })
          
                function totalSum(total:any, datapoint:any){
                  return total + datapoint;
                }
                //console.log(datasetArray)
                let sum = 0
                for(let i = 0; i<datasetArray.length;i++)
                    sum+=parseFloat(datasetArray[i])
                if(context.datasetIndex == datasetArray.length-1)
                return '$'+sum.toFixed(2)
                else
                return ''
            },
            anchor: "end" as const,
            offset: -50,
            align: "bottom" as const
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y" as const,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      };
      
    /*const options ={
        responsive: true,
        plugins:{
            title:{
                display: true,
                text:"Spendings",
                font:{
                    size:20
                },
                color:"#1a53ff"
            },
            legend:{
                display:true,
                position: "bottom" as 'bottom',
                labels:{
                    generateLabels: (ref:Chart<keyof ChartTypeRegistry>) =>{
                        return labels.map((label,index) =>({
                            text: label,
                            strokeStyle: borderColor[index],
                            fillStyle: backgroundColor[index]
                        }))
                    }
                }
            }
        }
    }*/

  return (
    
    
    <Bar
      data={data}
      options={options}
    />

    

  )
}

export default HorizontalBarChart
