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
import ChartDataLabels from "chartjs-plugin-datalabels"
import { borderColor } from '@mui/system';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    ChartDataLabels
  );
interface IPROPS{
    moneyData: any[]
    labels: any[]
    prevCategories: any[]
}
let BarChart:React.FC<IPROPS> = ({moneyData,labels,prevCategories}) => {
    const ref = useRef()
    const[borderColor,setBorderColor]=useState(['rgb(39, 174, 239)',
    'rgb(244, 106, 155)',
    'rgb(234, 85, 69)',
    'rgb(239, 155, 32)',
    'rgb(135, 188, 69)',
    'rgb(179, 61, 198)'])
    const[backgroundColor, setBackgroundColor] = useState(['rgb(39, 174, 239)',
    'rgb(244, 106, 155)',
    'rgb(234, 85, 69)',
    'rgb(239, 155, 32)',
    'rgb(135, 188, 69)',
    'rgb(179, 61, 198)'])
    var data = {
        /*labels: Object.entries(categories).map(([key,value])=>{
            key: => ke
        }),*/
        labels: ["","","","","",""],
        datasets:[{
            label: "Current Month $$",
            data: moneyData,
            backgroundColor: [
                'rgb(39, 174, 239)',
                'rgb(244, 106, 155)',
                'rgb(234, 85, 69)',
                'rgb(239, 155, 32)',
                'rgb(135, 188, 69)',
                'rgb(179, 61, 198)'
              ],
              borderColor: borderColor,
              borderWidth: 1

        },{
            label: "Last Month $$",
            data: prevCategories,
            backgroundColor: [
                'rgb(39, 174, 239,0.5)',
                'rgb(244, 106, 155,0.5)',
              'rgb(234, 85, 69,0.5)',
              'rgb(239, 155, 32,0.5)',
              'rgb(135, 188, 69,0.5)',
              'rgb(179, 61, 198,0.5)'
              ],
              borderColor: borderColor,
              borderWidth: 1
        }]
    }
    const options ={
        responsive: true,
        maintainAspectRatio: false,
        plugins:{
            title:{
                display: true,
                text:"Spendings",
                font:{
                    size:20
                },
                color:"#1a53ff"
            },
            scales:{
                y:{
                    title:{
                        diplay:true,
                        text:'Category'
                    },
                    beginAtZero: true,
                },
                title:{
                    display:true,
                    text:"HELLO"
                }
                
            },
            datalabels: {
                display: false,
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
    }

  return (
    
    
    <Bar
        ref = {ref}
      data={data}
      options={options}
    />

    

  )
}

export default BarChart
